// Edge Function: ai-generate
// Secure server-side AI text/activity generation. The provider API key lives ONLY
// here as a Supabase secret (AI_API_KEY) and never reaches the client.
//
// Secrets (set via: supabase secrets set ...):
//   AI_API_KEY   - the provider API key (required)
//   AI_PROVIDER  - 'anthropic' | 'openai' | 'gemini'   (default: anthropic)
//   AI_MODEL     - model id (optional; sensible default per provider)
//
// Auth: verify_jwt is enabled, so only signed-in users can call it. (The client
// also only surfaces AI to premium users; a hard entitlement check is added in
// Phase 5 once RevenueCat populates user_subscriptions.)

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function callAnthropic(key: string, model: string, prompt: string) {
  const r = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'x-api-key': key, 'anthropic-version': '2023-06-01', 'Content-Type': 'application/json' },
    body: JSON.stringify({ model, max_tokens: 1024, messages: [{ role: 'user', content: prompt }] }),
  });
  const d = await r.json();
  if (!r.ok) throw new Error(d?.error?.message || `Anthropic ${r.status}`);
  return d?.content?.[0]?.text || '';
}

async function callOpenAI(key: string, model: string, prompt: string) {
  const r = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ model, max_tokens: 1024, messages: [{ role: 'user', content: prompt }] }),
  });
  const d = await r.json();
  if (!r.ok) throw new Error(d?.error?.message || `OpenAI ${r.status}`);
  return d?.choices?.[0]?.message?.content || '';
}

async function callGemini(key: string, model: string, prompt: string) {
  const r = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
    },
  );
  const d = await r.json();
  if (!r.ok) throw new Error(d?.error?.message || `Gemini ${r.status}`);
  return d?.candidates?.[0]?.content?.parts?.[0]?.text || '';
}

const DEFAULT_MODEL: Record<string, string> = {
  anthropic: 'claude-3-5-sonnet-latest',
  openai: 'gpt-4o-mini',
  gemini: 'gemini-1.5-flash',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const key = Deno.env.get('AI_API_KEY');
    if (!key) return json({ error: 'AI is not configured yet.' }, 503);

    const provider = (Deno.env.get('AI_PROVIDER') || 'anthropic').toLowerCase();
    const model = Deno.env.get('AI_MODEL') || DEFAULT_MODEL[provider] || DEFAULT_MODEL.anthropic;

    const { prompt } = await req.json().catch(() => ({ prompt: '' }));
    if (!prompt || typeof prompt !== 'string') return json({ error: 'Missing prompt' }, 400);
    if (prompt.length > 4000) return json({ error: 'Prompt too long' }, 400);

    let text = '';
    if (provider === 'openai') text = await callOpenAI(key, model, prompt);
    else if (provider === 'gemini') text = await callGemini(key, model, prompt);
    else text = await callAnthropic(key, model, prompt);

    return json({ text });
  } catch (e) {
    return json({ error: String((e as Error)?.message || e) }, 500);
  }
});
