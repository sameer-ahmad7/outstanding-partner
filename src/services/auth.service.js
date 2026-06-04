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

export async function getSession() {
  return supabase.auth.getSession();
}

export function onAuthChange(cb) {
  return supabase.auth.onAuthStateChange((_event, session) => cb(session));
}

// Maps a Supabase user object to the app's lightweight authUser shape.
export function toAuthUser(user) {
  if (!user) return null;
  return {
    id: user.id,
    email: user.email || '',
    name: user.user_metadata?.display_name || '',
  };
}
