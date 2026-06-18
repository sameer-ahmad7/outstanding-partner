# Resend setup for outstandingpartner.app

Goal: send branded verification / password-reset emails from **hello@outstandingpartner.app**
via Resend SMTP, so Supabase isn't rate-limited and mail lands in the inbox.

DNS is managed at **Namecheap** (the domain's A records already point at Firebase Hosting — the
email records below are additive and won't affect the website).

---

## Step 1 — Add the domain in Resend
1. Sign in at https://resend.com → **Domains** (left sidebar) → **Add Domain**.
2. Enter `outstandingpartner.app` → Region: pick the closest (e.g. **US East**) → **Add**.
3. Resend shows a list of DNS records (an **MX**, two/three **TXT** records for SPF + DKIM, and an
   optional **DMARC**). Keep this page open — the exact values are unique to your domain.

## Step 2 — Add the records at Namecheap
Namecheap → **Domain List** → **Manage** next to `outstandingpartner.app` → **Advanced DNS** →
**Add New Record** for each one Resend shows.

⚠️ **Host-field rule (important):** Namecheap wants only the *subdomain part*, not the full domain.
Strip `.outstandingpartner.app` from whatever Resend shows:

| Resend shows (Name/Host) | Type | Namecheap **Host** field | Value | Notes |
|---|---|---|---|---|
| `send.outstandingpartner.app` | **MX** | `send` | `feedback-smtp.<region>.amazonses.com` (as shown) | Priority **10** |
| `send.outstandingpartner.app` | **TXT** | `send` | `v=spf1 include:amazonses.com ~all` (as shown) | SPF |
| `resend._domainkey.outstandingpartner.app` | **TXT** | `resend._domainkey` | the long `p=...` key (as shown) | DKIM — paste exactly, no line breaks |
| `_dmarc.outstandingpartner.app` | **TXT** | `_dmarc` | `v=DMARC1; p=none;` | Optional but recommended |

- Set **TTL** to **Automatic** for each.
- Copy values **exactly** from Resend (especially the DKIM key — one long string).
- These do **not** touch the existing `@` / `www` A-records that serve the website, so the site and
  the Universal-Links files keep working.

## Step 3 — Verify
Back in Resend → on the domain → **Verify DNS Records** (or just wait — it auto-checks).
Propagation is usually a few minutes, occasionally up to an hour. Status should turn **Verified**.

## Step 4 — Generate the API key
1. Resend → **API Keys** → **Create API Key**.
2. Name: `outstanding-partner` (or similar).
3. Permission: **Sending access**.
4. Domain: `outstandingpartner.app` (restrict to it) — optional but cleaner.
5. **Create** → copy the key (starts with `re_…`). **It's shown only once.**

## Step 5 — Send me the key (then I take over)
Paste the `re_…` key here. I'll then (using the Supabase Management token you already gave me):
- Configure Supabase **Custom SMTP** → host `smtp.resend.com`, port `465`, user `resend`,
  password = your key, sender **hello@outstandingpartner.app**, name "Outstanding Partner".
- Turn **Confirm email = ON** and install the two branded templates from `email-templates/`.
- Run the full end-to-end test: sign up → branded email → tap → verify → paywall → redeem code → Today.

---

### Notes
- The **from-address** is `hello@outstandingpartner.app` even though the MX/SPF live on the `send`
  subdomain — that's normal (the subdomain only handles bounce/Return-Path).
- If you'd rather I fetch the records / key directly, add me as a Resend **team member**
  (Resend → Settings → Team) and I can read them — but pasting the key here is enough.
- Free tier = 3,000 emails/month, 100/day — plenty for launch; upgrade later if needed.
