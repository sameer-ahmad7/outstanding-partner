# Outstanding Partner — Project Handoff / State of the App

> Single source of truth so a new session/developer can continue seamlessly.
> Last updated after commit `e41ce71`.

---

## 1. What this app is

**Outstanding Partner** is a relationship‑coaching mobile app (iOS + Android). It helps a user be a better partner using their partner's **menstrual cycle phase**, **brain‑chemistry** framing, and curated content (texts, date ideas, at‑home activities, challenges, zodiac/numerology). It started as a single ~5,100‑line React file (`better-partner-v6 (1).txt`, originally branded "Better Partner") and was rebuilt into a production app.

- **App name:** Outstanding Partner   **Bundle/package id:** `com.outstandingpartner.app`
- **Repo (local):** `~/Desktop/outstanding-partner` (standalone git repo; commit per phase)
- **Model:** **subscription‑only** (hard paywall, no free tier) + **friends‑&‑family lifetime access codes**

---

## 2. Tech stack

- **Frontend:** Vite + React (JSX, no TypeScript). Heavy inline styles, dark theme (`#0d0d0d` bg, accent `#c0392b`, logo bg `#0a0a0a`).
- **Mobile wrapper:** Capacitor 8 (iOS via SPM, Android via Gradle). Plugins: app, status-bar, splash-screen, keyboard, preferences, `@revenuecat/purchases-capacitor`.
- **Backend:** Supabase (Auth + Postgres + RLS + Edge Functions). Project ref `avnqmwuvzdkkfnovaibl`.
- **Subscriptions:** RevenueCat (entitlement `premium`, offering `default`).
- **Legal web pages:** Firebase Hosting (project `outstanding-partner-app`).
- **Node 22** required (`nvm use 22.18.0`). Older Node breaks Vite 8.

---

## 3. How to run / build

```bash
cd ~/Desktop/outstanding-partner
nvm use 22.18.0          # IMPORTANT: Node 22+
npm install
npm run dev              # web dev (http://localhost:5173)
npm run build            # production web build -> dist/

# Mobile
npx cap sync
npx cap run ios --target "<iOS 18.4 sim udid>"   # iPhone 16 Pro iOS 18.4 recommended
npx cap run android --target emulator-5554

# Open native IDEs
npx cap open ios         # Xcode (Archive/upload from here)
npx cap open android
```

**Simulator notes:** Use **iOS 18.4** sims. **iOS 17.5 sims crash** (RevenueCat needs `SwiftUICore`, absent there). Avoid iOS 26 sim (flaky). RevenueCat **StoreKit local testing only works via Xcode ⌘R** with Run → Options → StoreKit Configuration = `ios/App/App/IAP.storekit` (CLI/simctl can't load it).

---

## 4. Environment variables (`.env`, git‑ignored; template in `.env.example`)

```
VITE_SUPABASE_URL=https://avnqmwuvzdkkfnovaibl.supabase.co
VITE_SUPABASE_ANON_KEY=<anon public key — safe for client, RLS-protected>
VITE_REVENUECAT_IOS_API_KEY=appl_cYOGSDwtqNwMaymvaKKOmdCnwEh   # public SDK key
VITE_REVENUECAT_ANDROID_API_KEY=""                              # pending (Play not set up)
VITE_ENABLE_AI="false"            # AI on hold
VITE_DEV_AUTH_BYPASS="false"      # true = skip login locally (preview/dev)
VITE_SCREENSHOT="false"           # dev-only: force a deterministic screen for store screenshots
VITE_SCREENSHOT_TAB=""            # with SCREENSHOT+bypass: which tab to land on
```

**Secrets NOT in repo (user holds):** Supabase **personal access token** (`sbp_…`) + **DB password** (for `supabase link/db push/functions deploy`); RevenueCat **secret** key (only if AI/webhooks need it later); AI provider key (only if AI resumes). The Supabase **service_role** key is auto‑injected into edge functions by Supabase — never put it in the app.

---

## 5. Current state (TL;DR)

- App builds clean; runs on iOS 18.4 sim, Android emulator, and web (dev).
- **Auth + full cloud sync + RLS** working (Supabase). **Paywall** (subscription‑only) working in code; **redeem‑code** (lifetime) working.
- **AI is ON HOLD** (client request) — edge function kept in repo, client call stubbed.
- **Legal pages live** on Firebase: `https://outstanding-partner-app.web.app/privacy` and `/support` (custom domain `outstandingpartner.app` DNS added; SSL provisioning).
- **App Store Connect** app exists (1.0, "Prepare for Submission"). **BLOCKER: Paid Apps Agreement = "New"** → Apple serves 0 IAP products → paywall shows "Subscriptions aren't available." Must be activated.
- **No build uploaded yet** — recent changes (logo/splash, redeem field, paywall fixes, bullet fixes) are baked into the binary and need an **Archive + upload** to reach TestFlight.

---

## 6. Phases (status)

| Phase | What | Status | Commit |
|---|---|---|---|
| 1 | Baseline Vite+React + Capacitor iOS/Android + icon/splash | ✅ | `bf63fa0` |
| 2 | Modular refactor (constants/utils/UI primitives) + rebrand Better→Outstanding | ✅ | `f1ce68f` |
| 3+4 | Supabase Auth + full cloud sync + RLS + CLI | ✅ | `11a4d79` |
| 5 | RevenueCat subscription‑only paywall (AI on hold) | ✅ | `0752a67` |
| 6 | Secure AI via Supabase Edge Function (built, then put **on hold**) | ✅ (disabled) | `1875abf` |
| 7 | Legal screens + Reset All Data + account deletion | ✅ | `833a988`, `07eb79c` |
| 8 | Mobile polish (safe area, status bar, back button) + store docs | ✅ | `6d61ed3` |
| 9 | Legal web hosting + paywall polish + cancellation handling | ✅ | `316f475` |
| — | UI/UX overflow audit + splash fixes | ✅ | `51611fc` |
| — | Friends & family one‑time lifetime codes | ✅ | `e0acd43` |
| — | New logo (icon+splash, `#0a0a0a` blend) | ✅ | `a90d477` |
| — | Partial App.jsx component split (Auth/Paywall/Onboarding) | ✅ | `e41ce71` |
| **Next** | **Web app + Stripe** (see §12) | ⏳ planned | — |

Full plan file: `~/.claude/plans/users-sameerahmad-downloads-better-part-lexical-stardust.md`.

---

## 7. Repo / component architecture

```
src/
  App.jsx                  # main shell + 7 tabs (~2,461 lines). Owns ALL state.
  config/app.config.js     # brand name, support/privacy emails, subscription copy
  constants/data.js        # all static content (texts, activities, zodiac, cycle phases…)
  utils/helpers.js         # cycle math, content pickers, zodiac, safeGet/Set (+ storage-change hook), fetchAI (stubbed)
  components/
    primitives.jsx         # badges, PhaseCard, ReminderCard, Toast
    auth/AuthScreen.jsx        # login / signup / forgot  (EXTRACTED)
    paywall/Paywall.jsx        # subscription gate + "Have a code?" redeem  (EXTRACTED)
    onboarding/Onboarding.jsx  # onboarding slides  (EXTRACTED)
    legal/{SupportScreen,PrivacyPolicyScreen,legalStyles}
  hooks/
    useSubscription.js     # RevenueCat config + entitlement + offerings (native only)
    useCloudSync.js        # snapshot localStorage <-> Supabase, debounced
  services/
    supabaseClient.js auth.service.js appData.service.js account.service.js
    revenuecat.service.js storage.js platform.service.js ai.service.js (unused/on hold)
supabase/
  migrations/  functions/{ai-generate,delete-account}/  config.toml
web-legal/  index.html privacy.html support.html   # Firebase Hosting site
firebase.json .firebaserc   # Hosting config (public: web-legal)
```

### App.jsx split status (important for the client's request)
- **Extracted into components:** Auth, Paywall, Onboarding (+ earlier: constants, utils, UI primitives, legal). App.jsx went **3,079 → 2,461 lines**. Pattern: App owns all `useState`; screens receive state/handlers as **props**; services imported directly inside components.
- **STILL in App.jsx (deferred to post‑launch):** the **7 tabs** — Today, Texts, Activities, Guide, Log, Reminders, Profile (+ Profile sub‑sections: overview/cycle/lpp/western/chinese/numerology/gameplan). These share lots of state; the clean extraction needs a Context/`useAppData` provider. Client chose to **submit first, then finish the split**.

---

## 8. Supabase integration

**Project ref:** `avnqmwuvzdkkfnovaibl`. CLI is linked (`supabase/`). Apply migrations / deploy functions:
```bash
export SUPABASE_ACCESS_TOKEN=sbp_…        # user provides
npx supabase db push --password "<DB password>"
npx supabase functions deploy <name>
```

**Tables (migrations applied):**
- `profiles(id, email, display_name, …)` — RLS: self only. Auto‑created on signup via `handle_new_user` trigger.
- `user_app_state(user_id, data jsonb, schema_version, updated_at)` — the **full app snapshot** (cloud sync). RLS: self all.
- `user_subscriptions(user_id, revenuecat_app_user_id, entitlement, is_active, product_id, store, expires_at, **lifetime bool**, updated_at)` — RLS: self **SELECT only** (writes via service role / RPC). `lifetime` = redeemed‑code lifetime access.
- `access_codes(code, note, redeemed_by, redeemed_at, created_at)` — RLS enabled, **no policies** (locked; only the SECURITY DEFINER functions touch it).

**Functions (Postgres RPC):**
- `redeem_access_code(p_code)` — atomic single‑use claim → sets `user_subscriptions.lifetime=true`. Callable by authenticated users.
- `generate_access_codes(n, note)` — admin helper to mint N unique `OP-XXXX-XXXX` codes (run in SQL editor; revoked from anon/authenticated).
- `handle_new_user`, `set_updated_at` (triggers).

**Edge Functions (Deno):**
- `delete-account` — verifies JWT, deletes the auth user (cascades all rows). Used by in‑app **Delete Account**.
- `ai-generate` — provider‑flexible (anthropic/openai/gemini) AI generation, premium‑gated. **Deployed but unused (AI on hold)**; needs `AI_API_KEY` secret to function.

**Sync model:** app writes everything to `localStorage` (via `safeSet`); `useCloudSync` debounce‑uploads a snapshot to `user_app_state.data` and restores it on a new device (remote‑wins, one reload). Auth: email/password; email confirmation currently OFF for testing.

---

## 9. RevenueCat integration

- **Entitlement:** `premium`. **Offering:** `default` with packages `$rc_monthly` → `com.outstandingpartner.app.monthly` and `$rc_annual` → `com.outstandingpartner.app.yearly`. (Verified via offerings API — config is correct.)
- **Pricing:** Monthly **$21.99**, Yearly **$224.99** (Apple tier ≈ $224), both **7‑day free trial**. Prices render **dynamically** from `product.priceString` (correct currency); fallback strings only show pre‑load.
- **Access gating:** `subscribed = RevenueCat 'premium' entitlement OR user_subscriptions.lifetime (redeemed code) OR dev bypass`. The app is hard‑gated: signup → paywall until `subscribed`.
- **Cancellation/expiry:** handled in‑app — `customerInfo` listener + cold‑start refresh + **app‑resume re‑check**. No webhook needed yet (deferred to web/Stripe phase).
- **Keys:** iOS public key in `.env` (`appl_…`). **Android key pending** (Play not set up). RC project has the In‑App Purchase key uploaded for iOS.

---

## 10. Friends & family — lifetime "forever" access codes

Client wants: **unique code per friend, single‑use, lifetime free**. Implemented:
- **Generate codes (admin, Supabase SQL editor):**
  ```sql
  select code from public.generate_access_codes(20, 'friends & family');
  -- view/manage:
  select code, note, redeemed_by, redeemed_at from public.access_codes order by created_at desc;
  ```
- **Redeem (in app):** paywall → **"Have a code?"** field (below Restore Purchases) → enter code → **Redeem** → `redeem_access_code` RPC atomically claims it once → sets `lifetime=true` → app unlocks forever.
- Single‑use enforced server‑side; idempotent for the same user. Generation is admin‑only (no in‑app generator).
- Alternative (no code): grant a **RevenueCat Lifetime promotional entitlement** per customer in the RC dashboard.

---

## 11. Legal pages / web (current)

- **Firebase Hosting** site `outstanding-partner-app`, source `web-legal/` (static, dark theme, accurate Outstanding‑Partner + cloud‑sync content — NOT the client's outdated local‑only text).
- Live: `https://outstanding-partner-app.web.app/` , `/privacy` , `/support`.
- **Custom domain:** `outstandingpartner.app` (Namecheap). DNS records added (A `199.36.158.100`, TXT `hosting-site=outstanding-partner-app`); SSL provisioning. Deploy: `npx firebase-tools deploy --only hosting` (user logged in as sameer.ahmad3247@gmail.com).
- **The React app is NOT deployed to web** — only these two legal pages are public, so no one sees login/signup on the web.
- In‑app Support + Privacy screens (`components/legal/`) reachable **without login** (App Store requirement) + Reset All Data + Delete Account.

---

## 12. NEXT PHASE — Web app + Stripe (planned, not started)

- Promote the Vite app to a real web target (Supabase auth already cross‑platform).
- **Stripe** for web subscriptions (Checkout + customer portal) since Apple/Google IAP is mobile‑only.
- Reconcile entitlement across **RevenueCat (mobile) + Stripe (web)** — likely feed `user_subscriptions` from **both** a RevenueCat webhook and a Stripe webhook; app reads entitlement from there on web.
- Until then, **web stays limited to the legal pages**.

---

## 13. App Store Connect — status & remaining

**Account:** Apple Developer (Long Duc Nguyen). App record exists, v1.0 "Prepare for Submission". Bundle `com.outstandingpartner.app`, Apple ID `6778456225`.

**Done / decided:**
- Subscription group "Outstanding Partner Access" + Monthly/Yearly products created (7‑day trial on both).
- Screenshots generated: `store-assets/` — iPhone 6.5″ (1242×2688) + iPad 13″ (2064×2752): paywall, today, texts, activities. Also 6.9″ paywall.
- Localization text: Monthly "Outstanding Partner — Monthly" / "Full access, billed monthly. 7‑day free trial."; Yearly equivalents.
- **App Privacy** answers: data types = Name, Email, Health, Other User Content, User ID → all **Linked = Yes**, **Tracking = No**, purpose **App Functionality**. Privacy Policy URL = the Firebase URL.
- **Content Rights:** "No third‑party content." **Age Rating:** mild sexual content → **17+**.
- **Encryption:** `ITSAppUsesNonExemptEncryption=false` in Info.plist (skips export prompt).
- **Reviewer demo account:** `appreview@outstandingpartner.app` / `OutstandingReview!2026` (grant it a RevenueCat **promotional entitlement** so reviewers skip payment; put creds in App Review notes).

**REMAINING / BLOCKERS:**
1. ⛔ **Paid Applications Agreement = "New"** → activate it (Business → Agreements → Review & Agree + complete **Bank + Tax**). Until Active, **0 IAP products load anywhere** (this is why the paywall says "Subscriptions aren't available"). #1 priority.
2. Products must be **"Ready to Submit"** (not "Missing Metadata").
3. **Upload a build:** Xcode → Product → Archive → Distribute → App Store Connect. (Bump `CURRENT_PROJECT_VERSION` for each new upload.) Needed so the new logo/splash, redeem field, paywall fixes, and bullet fixes reach TestFlight/App Store.
4. Attach the build to v1.0, finish metadata, **Submit for Review**.

**Known Xcode issue:** macOS 26 / Xcode 26 "Pseudo Terminal Setup Error (Device not configured)" on Run. Workarounds: Edit Scheme → Run → uncheck "Debug executable"; or `xcrun simctl shutdown all; sudo killall -9 com.apple.CoreSimulator.CoreSimulatorService`; or reboot. Archive/upload is unaffected.

---

## 14. Key implementation facts (don't break)

- **Cycle math:** `cycleDay = max(1, min(28, ((diff-1)%28)+1))`, `diff = floor((now-start)/864e5)+1`. Phases: menstrual[1–5], follicular[6–11], ovulation[12–16], luteal[17–28].
- **In‑app copy** still says "Better Husband"/"husband/boyfriend" in places (client kept that phrasing; only "Better Partner"→"Outstanding Partner" was swapped).
- **AI on hold:** `helpers.fetchAI` returns "" ; re‑enable by delegating to `ai.service.generateAI` + setting `AI_API_KEY` secret + un‑hiding AI UI (currently the AI generators are defined but not surfaced).
- **Dev flags:** `VITE_DEV_AUTH_BYPASS` (skip login + auto‑premium), `VITE_SCREENSHOT`(+`_TAB`) (force a screen for screenshots). Both default false; never ship true.
- **Brand colors:** app bg `#0d0d0d`, logo/splash bg `#0a0a0a`, accent `#c0392b`, green `#27ae60`.

---

## 15. Immediate next steps (suggested order)

1. **Activate Paid Apps Agreement** + ensure products "Ready to Submit". (Unblocks the live paywall — no build needed.)
2. **Archive + upload a new build** (gets logo/splash, redeem field, fixes into TestFlight).
3. Grant the **reviewer demo account** a RevenueCat lifetime promo entitlement; fill App Review notes.
4. Verify custom domain SSL is live; set App Store Privacy/Support URLs to `https://outstandingpartner.app/...`.
5. Submit for review.
6. **Post‑launch:** finish App.jsx split (extract the 7 tabs via a Context/`useAppData` provider); then start the **Web app + Stripe** phase.

## 16. Deliverable docs in repo
`README.md`, `ACCOUNTS_SETUP.md`, `REVENUECAT_SETUP.md` (App Store Connect + RC + Apple compliance), `STORE_SUBMISSION_CHECKLIST.md`, `FIREBASE_HOSTING.md`, `ANTHROPIC_API_KEY_GUIDE.md`, and this `PROJECT_HANDOFF.md`.
