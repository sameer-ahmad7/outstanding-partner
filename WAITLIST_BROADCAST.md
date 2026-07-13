# Waitlist launch broadcast — how to email everyone when Android goes live

When Outstanding Partner is live on Google Play, run the broadcast to email every
Android-waitlist subscriber the Play Store link. Safe to re-run — it only emails
people who haven't been notified yet.

## What it does
- Emails each un-notified `public.waitlist` subscriber a branded "It's here — on Android 🎉"
  email with the Google Play link, via Resend (batches of 100).
- Marks each sent row `notified_at`, so **re-running never double-emails**. If a run stops
  partway (rate limit, timeout), just run it again — it resumes with whoever's left.

## Prerequisites (already set up)
- Supabase Edge Function **`waitlist-broadcast`** (deployed, `verify_jwt=false`).
- Edge Function secrets: **`RESEND_API_KEY`** (sending) + **`BROADCAST_SECRET`** (admin gate).
- `waitlist.notified_at` column (migration `20260713140000_waitlist_notified.sql`).

## How to run it

Endpoint: `https://avnqmwuvzdkkfnovaibl.supabase.co/functions/v1/waitlist-broadcast`
Auth: header `x-broadcast-secret: <BROADCAST_SECRET>`  *(the secret is stored in Supabase
Edge Function secrets; ask the developer for the value, or set your own in the dashboard).*

**1. Dry run first** (sends nothing, shows how many will get the email):
```bash
curl -X POST "https://avnqmwuvzdkkfnovaibl.supabase.co/functions/v1/waitlist-broadcast" \
  -H "x-broadcast-secret: <BROADCAST_SECRET>" \
  -H "Content-Type: application/json" \
  -d '{"dryRun": true}'
# -> {"ok":true,"dryRun":true,"pending": 123}
```

**2. Send for real:**
```bash
curl -X POST "https://avnqmwuvzdkkfnovaibl.supabase.co/functions/v1/waitlist-broadcast" \
  -H "x-broadcast-secret: <BROADCAST_SECRET>" \
  -H "Content-Type: application/json" \
  -d '{}'
# -> {"ok":true,"sent": 123, "remaining": 0}
```
Re-run the same command until `remaining` is 0 (for very large lists it processes up to
1000 per call by default).

## Options (JSON body)
- `"dryRun": true` — preview the pending count, send nothing.
- `"playUrl": "https://play.google.com/store/apps/details?id=com.outstandingpartner.app"` —
  override the link (this is the default, so usually you can omit it).
- `"limit": 500` — max emails to process this invocation (default 1000; re-invoke to continue).

## Notes
- Only subscribers with `notified_at IS NULL` get emailed. To resend to everyone (rare),
  first `update public.waitlist set notified_at = null;` in the SQL editor.
- The email sends from `hello@outstandingpartner.app` (verified Resend domain).
- Prefer the developer runs it, or you run the curl above — the Supabase dashboard's function
  tester also works if you add the `x-broadcast-secret` header.
