# Accounts Setup

What each external account is for, and exactly which values the app needs.

## 1. Supabase (auth + database) — REQUIRED ✅ done

- Project URL → `VITE_SUPABASE_URL`
- `anon` public key → `VITE_SUPABASE_ANON_KEY`  (safe for the client; protected by RLS)
- **Never** put the `service_role` key in the app. It is only used inside edge functions,
  where Supabase injects it automatically as `SUPABASE_SERVICE_ROLE_KEY`.
- Auth → disable "Confirm email" for testing; re-enable before production if desired.
- CLI: a **Personal Access Token** (account → Access Tokens) + DB password are needed to
  run `supabase link / db push / functions deploy`. Revoke the token when finished.

## 2. RevenueCat (subscriptions) — REQUIRED for Phase 5

- Create iOS app + Android app inside one RevenueCat project.
- Entitlement: `premium`. Offering: `default`. Packages: monthly ($21.99, 7-day trial); yearly optional.
- Public SDK keys → `VITE_REVENUECAT_IOS_API_KEY`, `VITE_REVENUECAT_ANDROID_API_KEY`.
- Store products are created in App Store Connect / Play Console first, then linked in RevenueCat.

## 3. Apple Developer / App Store Connect — REQUIRED to ship iOS

- Apple Developer Program membership (paid).
- App record with bundle id `com.outstandingpartner.app`.
- Create an auto-renewing subscription (group + product), then link it in RevenueCat.
- Provide: app icon (1024², no alpha), screenshots, privacy policy URL, support URL, reviewer test account.
- Complete the Paid Applications Agreement.

## 4. Google Play Console — REQUIRED to ship Android

- Google Play developer account (one-time fee).
- App record with package `com.outstandingpartner.app`.
- Create a subscription product, then link it in RevenueCat.
- Provide: icon, feature graphic, screenshots, privacy policy URL, Data Safety form.

## 5. AI provider (Phase 6, optional) — REQUIRED only if AI is enabled

- OpenAI or Anthropic API key, stored as a Supabase **secret** (never in the app):
  `npx supabase secrets set AI_API_KEY=...`

## 6. Firebase — NOT used in v1

Deferred (analytics/Crashlytics/push). Revisit only if those features are requested.

---

### Values to hand to the developer

| Value | Where | Status |
|------|-------|--------|
| Supabase URL + anon key | Settings → API | ✅ provided |
| Supabase access token + DB password (CLI) | Account → Access Tokens; Project → Database | ✅ provided |
| RevenueCat iOS + Android public SDK keys | Project → API keys | ⏳ pending |
| App Store Connect access | appstoreconnect.apple.com | ⏳ pending |
| Google Play Console access | play.google.com/console | ⏳ pending |
| Confirmed support/privacy emails | — | default `@outstandingpartner.app` |
