# Outstanding Partner

Relationship-coaching mobile app. **Vite + React (JSX)** wrapped with **Capacitor** (iOS/Android), **Supabase** for auth + cloud sync (RLS), **RevenueCat** for subscriptions, and a secure **Supabase Edge Function** for AI.

- **App name:** Outstanding Partner
- **Bundle / package id:** `com.outstandingpartner.app`

## Prerequisites

- **Node 22** (`nvm use 22`). The repo's tooling assumes Node ≥ 20.
- Xcode (iOS) + CocoaPods, Android Studio + SDK (Android).
- Supabase CLI is included as a dev dependency (`npx supabase ...`).

## Setup

```bash
npm install
cp .env.example .env     # fill in Supabase + RevenueCat keys
```

`.env` (Vite vars — safe for the client; protected by Supabase RLS):

```
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
VITE_REVENUECAT_IOS_API_KEY=...        # Phase 5
VITE_REVENUECAT_ANDROID_API_KEY=...    # Phase 5
VITE_DEV_AUTH_BYPASS=false             # true = skip login in local dev
```

## Develop (web)

```bash
npm run dev          # http://localhost:5173
npm run build        # production web build -> dist/
```

## Mobile (Capacitor)

```bash
npm run build
npx cap sync
npx cap run ios       # or: npx cap open ios
npx cap run android   # or: npx cap open android
```

## Supabase (CLI)

```bash
export SUPABASE_ACCESS_TOKEN=sbp_...          # personal access token
npx supabase link --project-ref <ref>
npx supabase db push                          # apply migrations in supabase/migrations
npx supabase functions deploy delete-account  # deploy edge functions
```

## Architecture

```
src/
  App.jsx                     # main app shell (tabs, screens, flows)
  config/app.config.js        # brand name, support/privacy emails, subscription copy
  constants/data.js           # all static content (texts, activities, zodiac, cycle phases…)
  utils/helpers.js            # pure helpers (cycle math, content pickers, storage, zodiac)
  components/
    primitives.jsx            # small UI: badges, PhaseCard, ReminderCard, Toast
    legal/                    # SupportScreen, PrivacyPolicyScreen
  hooks/useCloudSync.js       # snapshot-based Supabase sync
  services/
    supabaseClient.js  auth.service.js  appData.service.js
    account.service.js  storage.js  platform.service.js
supabase/
  migrations/                 # SQL schema (profiles, user_app_state, user_subscriptions + RLS)
  functions/delete-account/   # account deletion (service role)
```

### Data & sync
The app persists state to `localStorage` (via `safeSet`). When signed in, `useCloudSync`
debounce-uploads a full snapshot to `user_app_state.data` (JSONB) and, on a fresh device,
restores the cloud copy. RLS ensures each user can only read/write their own rows.

### Cycle logic (do not change)
`cycleDay = max(1, min(28, ((diff-1) % 28) + 1))` where `diff = floor((now-start)/864e5)+1`.
Phases: menstrual [1–5], follicular [6–11], ovulation [12–16], luteal [17–28].

## Status

Done: baseline + Capacitor, modular refactor + rebrand, Supabase auth + cloud sync + RLS,
legal screens + data controls (Reset All Data, account deletion).
Pending: RevenueCat paywall (Phase 5), AI edge function (Phase 6).

See `ACCOUNTS_SETUP.md`, `REVENUECAT_SETUP.md`, `STORE_SUBMISSION_CHECKLIST.md`.
