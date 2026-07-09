# Outstanding Partner — Web App Phase: Implementation Plan (Detailed)

Technical plan for extending the existing Vite + React + Capacitor app to a full web presence
with Stripe (via RevenueCat Web Billing), the marketing landing page, public legal pages, and
Meta ads tracking (Pixel/Dataset + Conversions API + mobile SDK → Ads Manager).

Reference inputs: `outstanding-partner-landing-page.html` (design source of truth) and
`WEBSITE-DEVELOPER-BRIEF (1).md`.

---

## 1. Objectives

1. Ship the existing app as a **web app** (browser) from the **same codebase**, with Supabase sign-in + cross-device sync (already cross-platform).
2. Add **web subscriptions via Stripe**, using **RevenueCat Web Billing** so entitlements are unified across iOS, Android, and Web (subscribe anywhere → premium everywhere) with a self-serve management URL.
3. Publish the **marketing landing page** (from the brief) + fold in the **existing legal pages** (Privacy, Support) as **public, un-authenticated** pages.
4. Add an **Android waitlist** (Google Play pending) that stores emails in Supabase.
5. Wire **Meta tracking**: Pixel/Dataset (web) + Conversions API (server) + Meta SDK (mobile app events) → **Ads Manager**, with the required **ATT** + privacy-label compliance.
6. Prepare **Google Play** submission.

---

## 2. Architecture overview

**Single Firebase Hosting site** on `outstandingpartner.app` serving both the static marketing/legal pages and the SPA app, split by path for performance and SEO:

```
outstandingpartner.app
├─ /                     → Marketing landing page   (static, fast, public)         [NEW]
├─ /privacy              → Privacy policy            (static, public)               [EXISTS]
├─ /support             → Support / FAQ             (static, public)               [EXISTS]
├─ /auth                → Email verify / reset page  (static, public)               [EXISTS]
├─ /.well-known/*        → AASA + assetlinks          (static)                       [EXISTS]
└─ /app/**               → Web app SPA (React)        (auth-gated app; public shell) [NEW]
```

- **Why split static vs SPA:** the landing must hit PageSpeed 90+ / FCP < 1.5s (brief). The React bundle is ~830 KB — too heavy for the landing. So the landing + legal stay **lightweight static HTML**; the **SPA loads only under `/app`**.
- **Legal pages are public** (the client's explicit requirement) — they're static files with no auth, already reachable pre-login; nothing gates them.
- The SPA at `/app` is the same Vite build used by Capacitor; a Firebase rewrite sends `/app/**` to the SPA's `index.html`.

**Confirmed decisions (client-approved 2026-07-03):**
- **Hosting = Firebase Hosting** (single site on outstandingpartner.app — legal pages, `/auth`, AASA/assetlinks, DNS already there). Not Netlify.
- **Landing page = static** (lightweight HTML, not the React bundle) for PageSpeed 90+ / FCP < 1.5s.
- **Web app served at `/app`** (path-based, one Firebase site + one SSL cert). The `app.` subdomain option was considered and declined.

---

## 3. Monorepo & shared-code strategy

The Vite build already *is* the web app; Capacitor just wraps it. Introduce a thin **platform-adapter layer** so one codebase targets web + native:

```
outstanding-partner/
├─ src/                    # shared React app (unchanged core)
│  ├─ platform/            # NEW adapter layer
│  │  ├─ index.js          # detects web vs native (Capacitor.isNativePlatform())
│  │  ├─ payments.web.js   # RevenueCat Web SDK (purchases-js)
│  │  ├─ payments.native.js# RevenueCat native SDK (existing)
│  │  └─ analytics.js      # Meta Pixel (web) / FB SDK events (native)
│  └─ ...                  # existing components/state/services
├─ site/                   # NEW static marketing + legal (was web-legal/)
│  ├─ index.html           # landing page (from brief)
│  ├─ privacy.html, support.html, auth.html, .well-known/
├─ ios/ , android/         # Capacitor (unchanged)
└─ firebase.json           # rewrites for /app SPA + static routes
```

- **No fork.** Every existing feature/bugfix stays single-sourced (we've shipped many fixes this session — keep it one codebase).
- Native-only Capacitor calls are already guarded by `Capacitor.isNativePlatform()` (the pattern used for the Clipboard/Browser fixes) — audit remaining plugin calls (Preferences, StatusBar, Keyboard, SplashScreen, App) for web fallbacks.
- `web-legal/` is renamed/expanded to `site/`; existing `firebase.json` rewrites are extended.

**Payments adapter interface** (both platforms implement):
```
getEntitlement()      → { active: boolean, managementURL, willRenew, ... }
purchase(pkg)         → starts checkout (native: store sheet; web: RC Web Billing/Stripe)
restore()             → restore purchases (native) / re-resolve customer (web)
manageSubscription()  → opens managementURL (Stripe portal on web, store page on native)
```
The app's paywall/gating calls the adapter, not RevenueCat directly — so `Paywall.jsx` + `AppStateProvider` subscription logic stays one code path.

---

## 4. Payments — Stripe via RevenueCat Web Billing

**Single source of truth = RevenueCat**, keyed by **`app_user_id = Supabase user id` on every platform**. Same customer across App Store, Play, and Web → `entitlements.active.premium` is identical everywhere → cross-platform sync is automatic.

Setup:
1. Connect the client's **Stripe** account to **RevenueCat → Web Billing**.
2. Create the **web products/offering** in RevenueCat (Monthly $21.99, Yearly $224.99, 7-day trial) mapped to the same `premium` entitlement as the store products.
3. Web app integrates **`@revenuecat/purchases-js`**: `configure({ appUserId: supabaseUserId })` → fetch offerings → `purchase()` opens RC Web Billing checkout (Stripe) → on success, entitlement is live.
4. **Manage subscription:** `customerInfo.managementURL` → Stripe customer portal on web; native store page on mobile. One "Manage subscription" button, resolved per platform by the adapter.
5. **Server mirror (optional but recommended):** RevenueCat webhook → Supabase `user_subscriptions` (the table already exists with `entitlement/is_active/store/expires_at/lifetime`). Gives server-side entitlement checks + feeds the Conversions API (§6). Keep the existing silent `lifetime` honoring.

**Compliance guardrail (hard rule):** never surface Stripe/web pricing or a "subscribe on web" link **inside** the iOS/Android apps (Guideline 3.1.1 — the class of issue fixed in `APPLE_RESUBMISSION.md`). Apps = IAP only; web = Stripe. The landing page and web app (in a browser) may use Stripe freely.

---

## 5. Auth & data (already cross-platform)

- **Supabase Auth** + the existing snapshot **cloud sync** (`user_app_state` JSONB) already work in any browser — the web app reuses them as-is.
- Email verification, forgot/reset/change password already built; the `/auth` page already handles verify/reset links.
- The web app's gate order mirrors mobile: not signed in → auth screens; signed in + not premium → paywall (web = Stripe checkout); premium → app.

---

## 6. Meta tracking (Pixel + Conversions API + SDK → Ads Manager)

Three sensors feeding **Ads Manager** (Datasets = the Pixel):

1. **Meta Pixel (web)** — on the **landing page + web app**. Events: `PageView`, `Lead` (waitlist signup), `StartTrial`, `Subscribe`, `Purchase`. Uses the **Pixel/Dataset ID**.
2. **Conversions API (server-side)** — a small endpoint (Supabase Edge Function) fires purchase/trial events to Meta from the **RevenueCat/Stripe webhook**, deduped with the browser pixel via `event_id`. Survives ad-blockers + iOS privacy limits. **Strongly recommended** — browser-only tracking loses 20–40% of conversions.
3. **Meta SDK (mobile)** — Facebook SDK App Events in the iOS/Android apps: app install/activate, `StartTrial`, `Subscribe`, `Purchase`. Uses the **App ID + Client Token**. Integrated via a Capacitor plugin; Android needs key hashes (generated at build).

**Compliance (required, or store rejection):**
- iOS **App Tracking Transparency (ATT)** prompt before any cross-app/ads tracking; gate the SDK's advertiser tracking on the user's ATT choice.
- Update **App Store privacy nutrition labels** + **Play Data Safety** to declare tracking + the health/cycle data.
- Website: a lightweight **cookie/consent** note for the Pixel (region-dependent).

**Ads Manager** itself needs no code — once the ad account + Pixel + App exist under the Business portfolio and events flow in, campaigns are created/optimized there.

---

## 7. Marketing landing page

- Use `outstanding-partner-landing-page.html` as the **structure + copy source of truth** (hero, cycle bar, science banner, 6 reasons, final CTA, footer) — **but NOT its color palette.**
- **⚠️ Client design direction (2026-07-03 — overrides the original brief):** the landing must be **bright, professional, and welcoming — NOT dark.** The brief + attached HTML are dark/masculine; the client explicitly rejected that look *for the landing page*. Reskin to a light, clean, professional palette (white/off-white base, a professional accent, warm/inviting feel). Keep the **compass logo** + Playfair/DM Sans for brand continuity. **Propose 2–3 light palette options for approval before building.** This applies to the **landing page only** — the app (`/app`) keeps its existing dark theme.
- **Changes from the static file:**
  - **Reskin dark → bright/professional/welcoming** palette (per direction above).
  - **App Store button** → real listing URL once live (Apple app id).
  - **Google Play button** → replace with a **"Notify me when it's on Android"** waitlist form until Play is live (§8), then swap to the real Play URL.
  - Add a secondary **"Start free trial on the web"** CTA → `/app` sign-up (Stripe path) so paid traffic can convert without an app store.
  - Add **Meta Pixel** + SEO/OG tags (brief provides them) + a real `og-image.png`.
  - Keep **Privacy / Support** footer links → `/privacy`, `/support` (public).
- Performance: inline critical CSS, preload fonts, WebP + lazy images, sticky mobile CTA bar (brief), target PageSpeed 90+ / FCP < 1.5s.

---

## 8. Android waitlist (Google Play pending)

- **Storage: Supabase** (client's confirmed choice). New table `waitlist(email text unique, source text, created_at timestamptz default now())` with **RLS: anonymous INSERT only, no SELECT** (list stays private; visitors can add but not read).
- Landing form → Supabase anon insert (dedupe on unique email + honeypot for spam).
- Optional instant "you're on the list ✅" email via **Resend** (already configured for auth email).
- At launch: export/segment and email everyone (Resend broadcast or mailing tool). Emails carry into the full app later.

---

## 9. Deployment

- Single **Firebase Hosting** site; extend `firebase.json`:
  - static routes for `/`, `/privacy`, `/support`, `/auth`, `/.well-known/*`
  - SPA rewrite `/app/**` → the built SPA `index.html`
  - keep AASA/assetlinks content-type + `/auth` no-store headers (already set)
- Build pipeline: `vite build` (web app) + copy `site/` static files → `firebase deploy`.
- Domain already on Namecheap → Firebase; SSL auto.
- Env: web needs `VITE_REVENUECAT_WEB_API_KEY` (RC Web Billing public key), `VITE_META_PIXEL_ID`; server needs Meta CAPI token + RC webhook secret (Edge Function secrets). Keep `VITE_DEV_AUTH_BYPASS`/`VITE_SCREENSHOT` false in production.

---

## 10. Phased delivery + verification gates

**Phase W1 — Web app shell (shared codebase)**
- Monorepo `platform/` adapter; serve SPA at `/app`; audit native-plugin guards for web.
- ✅ Gate: web app loads, sign in, Today/tabs render, cloud sync works browser↔mobile.

**Phase W2 — Web payments (RevenueCat Web Billing + Stripe)**
- Connect Stripe↔RC; web offering; `purchases-js`; `app_user_id = Supabase id`; manage-URL; (optional) RC→Supabase webhook mirror.
- ✅ Gate: subscribe on web (Stripe test) → premium in the web app AND on mobile for the same account; cancel via management URL; restore works.

**Phase W3 — Landing + legal + waitlist (all public)**
- Adapt landing page; wire waitlist→Supabase; keep legal public; SEO/OG; performance pass.
- ✅ Gate: landing scores 90+ mobile; waitlist stores an email; `/privacy` `/support` public; CTAs route correctly.

**Phase W4 — Play Store release**
- Signed **AAB**; complete Play Console **store listing** (graphics, description, screenshots, content rating) + **Data Safety** form; **Play Billing** products created + linked in RevenueCat; `assetlinks.json` release SHA-256 added; keep redeem-code removed (Google 3.x parity).
- Release-track progression: **internal testing → closed/open testing (optional) → production (live on Google Play)**.
- ✅ Gate: **production release live on Google Play**; a real Android install unlocks premium via Play Billing; App Links verified.
- Then swap the landing's Android waitlist for the real Play button and **email the waitlist** that Android is live.

**Phase W5 (LAST) — Meta ads: tracking + Ads Manager setup + marketing training**

*5a. Tracking (the sensors)*
- Meta Pixel on landing + web app (PageView, Lead, StartTrial, Subscribe, Purchase); Conversions API Edge Function from RC/Stripe webhooks (event_id dedupe); Meta SDK app events in iOS/Android (install, trial, subscribe); iOS ATT prompt + App Store privacy labels + Play Data Safety (ships as one final app release).

*5b. Ads Manager configuration (make the funnel usable)*
- **Domain verification** (Business Settings → Brand safety) for outstandingpartner.app — required for iOS web conversion tracking.
- **Aggregated Event Measurement (AEM):** configure the 8 prioritized web events (Purchase > StartTrial > Lead > … ) for post-iOS-14 attribution.
- **Conversion mapping:** set Purchase/StartTrial as the optimization events so campaigns optimize toward *paying subscribers*, not clicks.
- **Campaign scaffolding** in Ads Manager, ready to run:
  - **App Promotion** campaigns (App Install / App Events) → mobile installs + subscribes; SKAdNetwork set up for iOS.
  - **Sales/Conversion** campaigns → web `/app` sign-ups (Stripe path).
- **Audiences:** Custom Audiences (website visitors via Pixel, waitlist list, app users) + **Lookalikes** + a **retargeting** audience (started-trial-didn't-pay).

*5c. Marketing training & handover (for you)*
- **Live training session(s)** walking you through running Ads Manager end-to-end.
- **Written runbook** (`META_ADS_RUNBOOK.md`) covering: how Ads Manager is structured (campaign → ad set → ad); reading the dashboard (installs, trials, subscribers, cost-per-result, ROAS); creating/duplicating/pausing campaigns; budgets & bidding basics; building audiences (custom/lookalike/retargeting); reading the funnel (visit → install → trial → paid); and a do's/don'ts + troubleshooting checklist.

- ✅ Gate: Events Manager shows web + mobile events; ATT prompt shows on iOS; domain verified + AEM configured; at least one App Promotion and one web Sales campaign built and optimizing on Purchase; you can independently create a campaign and read results after the training.
- **Last on purpose:** it measures the full funnel (web visit → install on both stores → trial → paid), which only exists once W1–W4 are live; building it earlier means redoing it.

---

## 11. Prerequisites from the client

- **Stripe** account (done) → connect to RevenueCat Web Billing.
- **RevenueCat** access (done).
- **Meta:** Pixel/Dataset ID, Facebook App ID, Client Token; Business verification (for app ads).
- **Google Play Console** access + signing key.
- Final **App Store / Play listing URLs** (for landing buttons) once live.
- Confirm: instant waitlist confirmation email — yes/no. *(only remaining open item)*

*Resolved: Firebase Hosting, static landing, web app at `/app` — all confirmed 2026-07-03.*

---

## 12. Out of scope (for now)

- Raw/direct Stripe integration (we use RevenueCat Web Billing instead).
- Native OS deep PiP / advanced offline for web.
- CMS for the marketing page (static unless requested).
- Full analytics suite beyond Meta (GA4 optional add-on later).
- Legal review of privacy wording (client/legal to confirm the tracking disclosures).
