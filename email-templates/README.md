# Email templates + Resend SMTP setup

Branded transactional emails for Outstanding Partner. Sent via **Resend** (custom SMTP) so we
aren't capped by Supabase's built-in email limits, and so mail comes from our own domain.

## Files
- `confirm-signup.html` — Supabase "Confirm signup" template (email verification).
- `reset-password.html` — Supabase "Reset password" template.

Both contain a button that links to an **HTTPS Universal/App Link**:
`https://outstandingpartner.app/auth/confirm?token_hash={{ .TokenHash }}&type={{ .Type }}`
(reset uses `/auth/reset`).

**How the link resolves:**
- **App installed** → iOS Universal Link / Android App Link opens the app directly. The app's
  deep-link handler (`src/state/AppStateProvider.jsx`, `appUrlOpen`) parses `token_hash`+`type`
  and calls `supabase.auth.verifyOtp(...)` — confirms the account, or opens the reset screen for
  `type=recovery`.
- **App NOT installed** → the browser loads the Firebase-hosted fallback `web-legal/auth.html`,
  which verifies the token via Supabase JS and shows a branded success message (or a
  set-new-password form for recovery), plus an "Open the app" button (custom-scheme fallback).

Association files (deployed to the custom domain via Firebase):
- `web-legal/.well-known/apple-app-site-association` — appID `MHWR5UKD73.com.outstandingpartner.app`, paths `/auth/*`.
- `web-legal/.well-known/assetlinks.json` — package `com.outstandingpartner.app` + signing SHA-256.

### Universal/App Links — remaining production steps
- **iOS**: the App ID in the Apple Developer portal must have the **Associated Domains** capability
  enabled, and the provisioning profile must include it (entitlement already added at
  `ios/App/App/App.entitlements`). Device testing requires a paid-team provisioning profile.
- **Android**: `assetlinks.json` currently has the **debug** keystore SHA-256. Before release, add
  the **release / Play App Signing** SHA-256 fingerprint (Play Console → App integrity) to the
  array and redeploy hosting, or autoVerify will fail for store builds.
- The custom-scheme (`outstandingpartner://`) registration is kept as a fallback and powers the
  "Open the app" button on the web page.

## One-time setup (do once the client shares the Resend API key)

### 1. Resend — verify the sending domain
- In Resend → **Domains** → add `outstandingpartner.app`.
- Add the SPF / DKIM / DMARC records Resend shows into **Namecheap → Advanced DNS**; wait for "Verified".
- Sender identity: **hello@outstandingpartner.app** (display name "Outstanding Partner").
- Create an API key (or use SMTP creds): host `smtp.resend.com`, port `465`, user `resend`, pass = API key.

### 2. Supabase → Authentication → SMTP Settings
- Enable **Custom SMTP**.
- Host `smtp.resend.com`, port `465`, username `resend`, password = Resend API key.
- Sender email `hello@outstandingpartner.app`, sender name `Outstanding Partner`.

### 3. Supabase → Authentication → Email Templates
- **Confirm signup** → paste `confirm-signup.html`.
- **Reset password** → paste `reset-password.html`.

### 4. Supabase → Authentication → Settings (Providers → Email)
- Turn **Confirm email = ON**.
- Site URL: `https://outstandingpartner.app`.
- Additional Redirect URLs: add `outstandingpartner://**`.

## Notes
- The deep link uses `{{ .TokenHash }}` (not `{{ .ConfirmationURL }}`), so it is independent of the
  redirect allowlist and works cold-start. Do not "simplify" the templates back to `{{ .ConfirmationURL }}`.
- Existing accounts created before confirmation was enabled are already confirmed — unaffected.
