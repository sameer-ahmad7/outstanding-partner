import { Capacitor } from '@capacitor/core';
import { supabase } from './supabaseClient.js';

// Apple + Google sign-in. Two code paths on purpose:
//
//  • NATIVE (iOS/Android) — get an ID token from the OS-level provider, then hand it to Supabase
//    via signInWithIdToken. This keeps the user inside the native account sheet; the OAuth
//    redirect flow in a webview is both ugly and rejected by Apple for Sign in with Apple.
//  • WEB (/app) — signInWithOAuth redirect, which is the only option in a browser.
//
// Both paths land on the SAME Supabase user for a given verified email as long as identity
// linking is enabled in Supabase Auth. That matters more than it looks: RevenueCat's app_user_id
// is the Supabase user id, so a duplicate user id would make a paying customer's subscription
// disappear. See IMPLEMENTATION_PLAN_V2.md → WS1 gotcha 3.

const isNative = () => Capacitor?.isNativePlatform?.() || false;

let initPromise = null;
async function initSocial() {
  if (!isNative()) return null;
  if (!initPromise) {
    initPromise = (async () => {
      const { SocialLogin } = await import('@capgo/capacitor-social-login');
      await SocialLogin.initialize({
        apple: { clientId: import.meta.env.VITE_APPLE_SERVICES_ID || undefined },
        google: {
          // iOS uses the iOS client id; Android authenticates via the SHA-1 registered against
          // the Android client id but still needs the WEB client id as the serverClientId in
          // order to return an idToken we can hand to Supabase.
          iOSClientId: import.meta.env.VITE_GOOGLE_IOS_CLIENT_ID || undefined,
          webClientId: import.meta.env.VITE_GOOGLE_WEB_CLIENT_ID || undefined,
        },
      });
      return SocialLogin;
    })();
  }
  return initPromise;
}

// GoogleSignIn 9.x puts a `nonce` claim in the id_token whether or not we asked for one, and
// Supabase rejects a token whose nonce it can't correlate:
//   "Passed nonce and nonce in id_token should either both exist or not."
// So we generate the nonce ourselves, hand it to the SDK, and pass the same value to Supabase.
// That keeps the replay protection the nonce exists for — the alternative, Supabase's
// "Skip nonce checks", disables the check for every client.
function makeNonce() {
  const a = new Uint8Array(32);
  (globalThis.crypto || window.crypto).getRandomValues(a);
  return Array.from(a, (b) => b.toString(16).padStart(2, '0')).join('');
}

// Read the nonce claim back out of the id_token so a mismatch is diagnosable rather than
// surfacing as an opaque Supabase error.
function tokenNonce(idToken) {
  try {
    const p = String(idToken).split('.')[1];
    const json = atob(p.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(json).nonce || null;
  } catch (e) { return null; }
}

export function socialAuthAvailable(provider) {
  if (!isNative()) return true; // web always has the OAuth redirect path
  if (provider === 'apple') return Capacitor.getPlatform() === 'ios' && !!import.meta.env.VITE_APPLE_SERVICES_ID;
  if (provider === 'google') return !!(import.meta.env.VITE_GOOGLE_WEB_CLIENT_ID);
  return false;
}

// Apple only returns the real email + name on the FIRST authorization, and only if the user
// didn't pick Hide My Email. Persist whatever we get; we will never see it again.
async function captureAppleProfile(result) {
  try {
    const p = result?.profile || result?.result?.profile || {};
    const given = p.givenName || '';
    const family = p.familyName || '';
    const name = [given, family].filter(Boolean).join(' ').trim();
    if (name) {
      await supabase.auth.updateUser({ data: { display_name: name } });
    }
  } catch (e) { /* non-fatal */ }
}

export async function signInWithApple() {
  if (isNative()) {
    const SocialLogin = await initSocial();
    const res = await SocialLogin.login({ provider: 'apple', options: { scopes: ['email', 'name'] } });
    const idToken = res?.result?.idToken || res?.idToken;
    if (!idToken) throw new Error('Apple sign-in did not return an identity token.');
    const out = await supabase.auth.signInWithIdToken({ provider: 'apple', token: idToken });
    if (out.error) throw out.error;
    await captureAppleProfile(res);
    return out;
  }
  return supabase.auth.signInWithOAuth({
    provider: 'apple',
    options: { redirectTo: `${window.location.origin}/app` },
  });
}

export async function signInWithGoogle() {
  if (isNative()) {
    const SocialLogin = await initSocial();
    const nonce = makeNonce();
    const res = await SocialLogin.login({ provider: 'google', options: { scopes: ['email', 'profile'], nonce } });
    const idToken = res?.result?.idToken || res?.idToken;
    if (!idToken) throw new Error('Google sign-in did not return an identity token.');
    const claim = tokenNonce(idToken);
    if (claim && claim !== nonce) {
      console.warn('[socialAuth] google nonce claim differs from the one we sent; using the claim');
    }
    const out = await supabase.auth.signInWithIdToken({
      provider: 'google',
      token: idToken,
      ...(claim ? { nonce: claim === nonce ? nonce : claim } : {}),
    });
    if (out.error) throw out.error;
    return out;
  }
  return supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: `${window.location.origin}/app` },
  });
}

export async function socialSignOut() {
  if (!isNative()) return;
  try {
    const SocialLogin = await initSocial();
    await SocialLogin.logout({ provider: 'google' });
  } catch (e) { /* not signed in with google */ }
}

// Turn a provider error into something a person can act on, or null when the user simply
// backed out. Returns null => show nothing at all.
//
// The native SDK errors are not user-facing text: @capgo/capacitor-social-login passes Apple's
// raw NSError straight through, so a cancelled sheet surfaced as
//   "The operation couldn't be completed. (com.apple.AuthenticationServices.AuthorizationError error 1000.)"
// ASAuthorizationError: 1000 unknown · 1001 canceled · 1002 invalidResponse · 1003 notHandled
//   · 1004 failed · 1005 notInteractive.        GIDSignInError: -5 canceled.
// 1000 is treated as a cancel because that is what the sheet reports when it is dismissed;
// a genuine presentation failure lands here too, so we keep a console warning for debugging
// rather than swallowing it entirely.
export function socialAuthErrorMessage(e, provider) {
  const name = provider === 'apple' ? 'Apple' : 'Google';
  const raw = (e && (e.message || e.error_description || e.error)) || '';
  const code = (e && (e.code ?? e.errorCode)) ?? '';
  const hay = `${raw} ${code}`;

  // Cancelled / dismissed — not an error.
  if (/cancel|abort|closed|dismiss|user.?denied|popup_closed/i.test(hay)) return null;
  if (/AuthorizationError error (1000|1001)/.test(raw)) { console.warn('[socialAuth] dismissed or unavailable:', raw); return null; }
  if (String(code) === '1000' || String(code) === '1001' || String(code) === '-5') return null;

  if (/network|offline|internet|timed? ?out/i.test(hay)) {
    return 'You appear to be offline. Check your connection and try again.';
  }
  // Misconfiguration — the audience/client checks. Deliberately not raw, but distinct enough
  // to be recognisable in a bug report.
  if (/audience|invalid_client|invalid client|not enabled|unsupported provider/i.test(hay)) {
    return `${name} sign-in isn’t available right now. Please try another way to sign in.`;
  }
  if (/nonce/i.test(hay)) {
    console.warn('[socialAuth] nonce rejected by Supabase:', raw);
    return `Couldn’t verify the ${name} sign-in. Please try again.`;
  }
  if (/already registered|already exists|identity.*linked/i.test(hay)) {
    return 'That account is already linked to a different sign-in method. Try signing in with the other method.';
  }
  console.warn('[socialAuth] unmapped error:', raw || e);
  return `Couldn’t sign in with ${name}. Please try again.`;
}
