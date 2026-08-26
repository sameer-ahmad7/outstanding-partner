import { createClient } from '@supabase/supabase-js';
import { Capacitor } from '@capacitor/core';

const url = import.meta.env.VITE_SUPABASE_URL;
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY;

// On the web, signInWithOAuth returns to /app with the session in the URL hash
// (#access_token=…&refresh_token=…). Supabase only consumes that hash when
// detectSessionInUrl is on — with it off the tokens just sat in the address bar and the
// app still considered you signed out. Nothing in this app parses the hash itself.
//
// Native is deliberately excluded: there the OAuth result comes back through
// signInWithIdToken, and email links arrive as outstandingpartner://auth/...?token_hash=…
// which is handled by verifyOtp, not by a hash. Leaving it off there keeps the Capacitor
// WebView from inspecting its capacitor://localhost URL on every launch.
const isNative = Capacitor?.isNativePlatform?.() || false;

// Single shared client. Sessions persist in localStorage (works in browser + Capacitor WebView).
export const supabase = url && anon
  ? createClient(url, anon, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: !isNative,
      },
    })
  : null;

export const hasSupabase = !!supabase;
