import { supabase } from './supabaseClient.js';

// Calls the secure ai-generate edge function with the user's session (auto-attached
// by supabase.functions.invoke). No provider key is ever present in the client.
export async function generateAI(prompt) {
  if (!supabase) return '';
  try {
    const { data, error } = await supabase.functions.invoke('ai-generate', {
      body: { prompt },
    });
    if (error) {
      // Try to surface the function's JSON error message.
      let msg = error.message || 'AI request failed.';
      try {
        const body = await error.context?.json?.();
        if (body?.error) msg = body.error;
      } catch (_) { /* ignore */ }
      return `⚠️ ${msg}`;
    }
    return data?.text || '';
  } catch (e) {
    return `⚠️ ${e?.message || 'AI request failed.'}`;
  }
}
