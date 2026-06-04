import { supabase } from './supabaseClient.js';

// Fetch the user's full app-state JSON document (or null if none yet).
export async function getUserAppState(userId) {
  const { data, error } = await supabase
    .from('user_app_state')
    .select('data')
    .eq('user_id', userId)
    .maybeSingle();
  if (error) throw error;
  return data?.data ?? null;
}

// Upsert the user's full app-state JSON document.
export async function upsertUserAppState(userId, data) {
  const { error } = await supabase
    .from('user_app_state')
    .upsert(
      { user_id: userId, data, updated_at: new Date().toISOString() },
      { onConflict: 'user_id' }
    );
  if (error) throw error;
}

// Read the user's subscription mirror row (Phase 5 RevenueCat / webhook writes it).
export async function getUserSubscription(userId) {
  const { data, error } = await supabase
    .from('user_subscriptions')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();
  if (error) throw error;
  return data ?? null;
}
