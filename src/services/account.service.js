import { supabase } from './supabaseClient.js';

// Permanently delete the current user's account via the delete-account edge function.
export async function deleteAccount() {
  const { data, error } = await supabase.functions.invoke('delete-account', { method: 'POST' });
  if (error) throw error;
  return data;
}

// Redeem a one-time access code -> grants lifetime access (atomic, single-use, server-side).
// Returns { ok: boolean, error?: string }.
export async function redeemAccessCode(code) {
  if (!supabase) return { ok: false, error: 'Not available' };
  const { data, error } = await supabase.rpc('redeem_access_code', { p_code: code });
  if (error) return { ok: false, error: error.message || 'Could not redeem code' };
  return data || { ok: false, error: 'Could not redeem code' };
}
