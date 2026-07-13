// Admin-triggered launch broadcast: emails every waitlist subscriber the Google
// Play link via Resend, and marks them notified so re-runs never double-send.
//
// Auth: pass the admin secret as the `x-broadcast-secret` header. It's stored as the
// BROADCAST_SECRET Edge Function secret, so only an admin who has it can trigger a
// mass email. verify_jwt is off at the gateway; the check below is the real gate.
//
// Body (all optional):
//   { "dryRun": true }            -> returns the count of pending emails, sends nothing
//   { "playUrl": "https://..." }  -> override the Play Store link (defaults below)
//   { "limit": 500 }             -> max emails to process this invocation (resumable;
//                                    re-invoke to continue — only un-notified are picked)
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY") ?? "";
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const BROADCAST_SECRET = Deno.env.get("BROADCAST_SECRET") ?? "";
const FROM = "Outstanding Partner <hello@outstandingpartner.app>";
const DEFAULT_PLAY_URL = "https://play.google.com/store/apps/details?id=com.outstandingpartner.app";
const BATCH = 100;          // Resend batch endpoint max
const BATCH_DELAY_MS = 600; // gentle pacing between batches

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { ...cors, "Content-Type": "application/json" } });
}

function isAdmin(req: Request): boolean {
  const provided = (req.headers.get("x-broadcast-secret") || "").trim();
  return !!BROADCAST_SECRET && provided === BROADCAST_SECRET;
}

function emailHtml(playUrl: string): string {
  return `<!doctype html><html><body style="margin:0;background:#FBF7F1;font-family:-apple-system,'Segoe UI',Helvetica,Arial,sans-serif;color:#2A2521;">
  <div style="max-width:480px;margin:0 auto;padding:40px 24px;text-align:center;">
    <img src="https://outstandingpartner.app/assets/app-icon.png" width="60" height="60" alt="Outstanding Partner" style="border-radius:15px;display:block;margin:0 auto 20px;" />
    <h1 style="font-family:Georgia,serif;font-size:26px;margin:0 0 12px;color:#2A2521;">It's here — on Android 🎉</h1>
    <p style="font-size:15px;line-height:1.7;color:#5F574E;margin:0 0 24px;">
      You asked to be the first to know, so here it is: <strong>Outstanding Partner</strong> is now live on <strong>Google Play</strong>. Start your 7-day free trial and become the partner she brags about.
    </p>
    <a href="${playUrl}" style="display:inline-block;background:#C0392B;color:#fff;text-decoration:none;font-weight:700;font-size:16px;padding:14px 34px;border-radius:999px;">Get it on Google Play</a>
    <p style="font-size:13px;color:#9a8f83;margin:22px 0 0;">7 days free. Cancel anytime.</p>
    <p style="font-size:12px;color:#b5ab9f;margin:30px 0 0;">© 2026 Outstanding Partner · You're receiving this because you joined the Android waitlist at outstandingpartner.app.</p>
  </div></body></html>`;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return json({ ok: false, error: "method_not_allowed" }, 405);
  if (!isAdmin(req)) return json({ ok: false, error: "unauthorized" }, 401);
  if (!RESEND_API_KEY) return json({ ok: false, error: "resend_key_missing" }, 500);

  let body: { dryRun?: boolean; playUrl?: string; limit?: number } = {};
  try { body = await req.json(); } catch { /* empty body ok */ }
  const playUrl = body.playUrl || DEFAULT_PLAY_URL;
  const limit = Math.max(1, Math.min(5000, body.limit ?? 1000));

  const sb = createClient(SUPABASE_URL, SERVICE_ROLE, { auth: { persistSession: false } });

  const { data: rows, error } = await sb
    .from("waitlist").select("email").is("notified_at", null).order("created_at").limit(limit);
  if (error) { console.error("select failed:", error); return json({ ok: false, error: "db" }, 500); }
  const emails = (rows ?? []).map((r) => r.email);

  if (body.dryRun) return json({ ok: true, dryRun: true, pending: emails.length });
  if (emails.length === 0) return json({ ok: true, sent: 0, remaining: 0, note: "nobody to notify" });

  const html = emailHtml(playUrl);
  let sent = 0;
  for (let i = 0; i < emails.length; i += BATCH) {
    const chunk = emails.slice(i, i + BATCH);
    const payload = chunk.map((to) => ({
      from: FROM, to, subject: "Outstanding Partner is now on Android \u{1F389}", html,
    }));
    const r = await fetch("https://api.resend.com/emails/batch", {
      method: "POST",
      headers: { "Authorization": `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!r.ok) {
      console.error("resend batch failed:", r.status, await r.text());
      break; // leave the rest un-notified for a retry run
    }
    // mark this batch notified so a re-run skips them
    const stamp = new Date().toISOString();
    const { error: upErr } = await sb.from("waitlist").update({ notified_at: stamp }).in("email", chunk);
    if (upErr) { console.error("mark-notified failed:", upErr); break; }
    sent += chunk.length;
    if (i + BATCH < emails.length) await new Promise((res) => setTimeout(res, BATCH_DELAY_MS));
  }

  const { count } = await sb.from("waitlist").select("*", { count: "exact", head: true }).is("notified_at", null);
  return json({ ok: true, sent, remaining: count ?? null });
});
