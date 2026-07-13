// Public endpoint for the marketing-site Android waitlist.
// Inserts the email into public.waitlist (service role) and, only for a NEW
// signup, sends a branded confirmation via Resend. Reads RESEND_API_KEY from
// the Edge Function secrets (not exposed to the client).
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY") ?? "";
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const FROM = "Outstanding Partner <hello@outstandingpartner.app>";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...cors, "Content-Type": "application/json" },
  });
}

function emailHtml(): string {
  return `<!doctype html><html><body style="margin:0;background:#FBF7F1;font-family:-apple-system,'Segoe UI',Helvetica,Arial,sans-serif;color:#2A2521;">
  <div style="max-width:480px;margin:0 auto;padding:40px 24px;text-align:center;">
    <img src="https://outstandingpartner.app/assets/app-icon.png" width="60" height="60" alt="Outstanding Partner" style="border-radius:15px;display:block;margin:0 auto 20px;" />
    <h1 style="font-family:Georgia,serif;font-size:26px;margin:0 0 12px;color:#2A2521;">You're on the list ✅</h1>
    <p style="font-size:15px;line-height:1.7;color:#5F574E;margin:0 0 18px;">
      Thanks for your interest in <strong>Outstanding Partner</strong>. You'll be the first to know the moment the app lands on <strong>Google Play</strong> — we'll email you once, and only once.
    </p>
    <p style="font-size:15px;line-height:1.7;color:#5F574E;margin:0 0 26px;">
      Can't wait? It's already live on iPhone.
    </p>
    <a href="https://outstandingpartner.app" style="display:inline-block;background:#C0392B;color:#fff;text-decoration:none;font-weight:700;font-size:15px;padding:13px 30px;border-radius:999px;">Visit outstandingpartner.app</a>
    <p style="font-size:12px;color:#9a8f83;margin:34px 0 0;">© 2026 Outstanding Partner · Be the partner she brags about.</p>
  </div></body></html>`;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return json({ ok: false, error: "method_not_allowed" }, 405);

  let payload: { email?: string; hp?: string };
  try { payload = await req.json(); } catch { return json({ ok: false, error: "bad_request" }, 400); }

  const email = String(payload.email ?? "").trim().toLowerCase();
  if (payload.hp) return json({ ok: true }); // honeypot: pretend success for bots
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return json({ ok: false, error: "invalid_email" }, 400);

  const sb = createClient(SUPABASE_URL, SERVICE_ROLE, { auth: { persistSession: false } });
  const { error } = await sb.from("waitlist").insert({ email, source: "landing" });

  let isNew = true;
  if (error) {
    if (error.code === "23505") isNew = false; // already on the list
    else { console.error("waitlist insert failed:", error); return json({ ok: false, error: "db" }, 500); }
  }

  if (isNew && RESEND_API_KEY) {
    try {
      const r = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { "Authorization": `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from: FROM,
          to: email,
          subject: "You're on the list — Outstanding Partner for Android",
          html: emailHtml(),
        }),
      });
      if (!r.ok) console.error("resend send failed:", r.status, await r.text());
    } catch (e) { console.error("resend error:", e); }
  }

  return json({ ok: true, isNew });
});
