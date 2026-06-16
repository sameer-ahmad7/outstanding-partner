import { supabase } from './supabaseClient.js';

export async function signIn(email, password) {
  return supabase.auth.signInWithPassword({ email, password });
}

export async function signUp(email, password, displayName) {
  return supabase.auth.signUp({
    email,
    password,
    options: { data: { display_name: displayName || '' } },
  });
}

export async function signOutUser() {
  return supabase.auth.signOut();
}

export async function sendPasswordReset(email) {
  return supabase.auth.resetPasswordForEmail(email);
}

// Verify a token_hash carried by an email deep link (signup confirmation or
// password recovery). Establishes a session on success.
export async function verifyEmailOtp(tokenHash, type) {
  return supabase.auth.verifyOtp({ token_hash: tokenHash, type });
}

// Update the password for the currently-signed-in user (no email sent).
export async function updatePassword(newPassword) {
  return supabase.auth.updateUser({ password: newPassword });
}

// Re-send the signup verification email.
export async function resendVerification(email) {
  return supabase.auth.resend({ type: 'signup', email });
}

export async function getSession() {
  return supabase.auth.getSession();
}

// cb receives (session, event) — event is positional-second so existing
// `onAuthChange(session => ...)` call sites keep working.
export function onAuthChange(cb) {
  return supabase.auth.onAuthStateChange((event, session) => cb(session, event));
}

// Maps a Supabase user object to the app's lightweight authUser shape.
export function toAuthUser(user) {
  if (!user) return null;
  return {
    id: user.id,
    email: user.email || '',
    name: user.user_metadata?.display_name || '',
    emailConfirmed: !!user.email_confirmed_at,
  };
}
