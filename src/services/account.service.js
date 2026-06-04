import { supabase } from './supabaseClient.js';

// Permanently delete the current user's account via the delete-account edge function.
export async function deleteAccount() {
  const { data, error } = await supabase.functions.invoke('delete-account', { method: 'POST' });
  if (error) throw error;
  return data;
}
