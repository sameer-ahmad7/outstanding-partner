# Email templates + Resend SMTP setup

Branded transactional emails for Outstanding Partner. Sent via **Resend** (custom SMTP) so we
aren't capped by Supabase's built-in email limits, and so mail comes from our own domain.

## Files
- `confirm-signup.html` — Supabase "Confirm signup" template (email verification).
- `reset-password.html` — Supabase "Reset password" template.

Both contain a button that deep-links into the native app:
`outstandingpartner://auth/...?token_hash={{ .TokenHash }}&type={{ .Type }}`. The app's
deep-link handler (`src/state/AppStateProvider.jsx`) calls `supabase.auth.verifyOtp({ token_hash, type })`
to confirm the account (or open the password-reset screen for `type=recovery`).

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
