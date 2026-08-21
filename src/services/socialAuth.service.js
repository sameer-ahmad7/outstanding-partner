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
    const res = await SocialLogin.login({ provider: 'google', options: { scopes: ['email', 'profile'] } });
    const idToken = res?.result?.idToken || res?.idToken;
    if (!idToken) throw new Error('Google sign-in did not return an identity token.');
    const out = await supabase.auth.signInWithIdToken({ provider: 'google', token: idToken });
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
