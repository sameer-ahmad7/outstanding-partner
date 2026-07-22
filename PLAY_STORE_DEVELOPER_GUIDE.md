# Google Play Submission — Developer Guide

Everything after the client creates the app + adds you as Admin. Covers store assets, the app-content
questionnaires (data safety, content rating, target audience), building the signed AAB, wiring the
Play subscription to RevenueCat, and submitting for review.

> **App:** Outstanding Partner · **Package:** `com.outstandingpartner.app` (must match iOS)
> Console: play.google.com/console → app **Outstanding Partner**

Play Console groups the work into two checklists: **Store listing** (how it looks) and
**App content / Dashboard "Set up your app"** (legal + policy declarations). Both must be green to submit.

---

## 1. Store listing assets  (Grow → Store presence → Main store listing)

The client fills the text; you add the graphics. Requirements:

| Asset | Spec | Notes |
|---|---|---|
| **App icon** | 512 × 512 PNG, 32-bit, < 1 MB | Reuse the app icon from `assets/` (same as iOS). |
| **Feature graphic** | 1024 × 500 PNG/JPG | Required. Simple branded banner (logo + tagline on the warm brand bg). |
| **Phone screenshots** | 2–8 images, PNG/JPG, 16:9 or 9:16, each side 320–3840 px | Capture from a device/emulator: Today tab, a text/mission, cycle view, paywall, profile. |
| **7-inch tablet** | optional, up to 8 | Skip unless you want tablet featuring. |
| **10-inch tablet** | optional, up to 8 | Skip for v1. |

Capture screenshots: run on an emulator → `adb exec-out screencap -p > shot.png` (or Android Studio's
device screenshot button). Aim for 4–6 clean phone shots.

---

## 2. App content declarations  (Dashboard → "Set up your app" / Policy → App content)

Complete each of these — Play won't let you submit until all are done:

### 2a. Privacy policy
- URL: **`https://outstandingpartner.app/privacy`** (already live).

### 2b. Ads
- **Does your app contain ads?** → **No.** (You advertise the app externally on Meta, but the app
  shows no ads to users.)

### 2c. App access
- If any part needs login, provide **test credentials** so the reviewer can get past the sign-in
  wall (email + password of a working account, or the free-path test account). Note the app requires
  an account to use — give the reviewer working demo credentials or they'll reject it.

### 2d. Content rating (IARC questionnaire)
- Start the questionnaire → category **Reference, News, or Educational / Lifestyle** (Utility).
- Answer honestly: no violence, no sexual content (the app is relationship-advice, keep answers
  factual), no gambling. Relationship/dating-adjacent content is fine but answer the maturity
  questions truthfully — likely lands **Teen** or **Everyone**. Submitting generates the ratings.

### 2e. Target audience and content
- **Target age:** 18+ (adults). Do **not** include under-13 age bands — that triggers Families
  policy and stricter rules you don't want.
- Not designed for children → keeps you out of the Families program.

### 2f. Data safety  (Policy → App content → Data safety)
Fill this from `NATIVE_TRACKING_SETUP.md` → "Android — Data safety" table. Summary:
- **Collect or share data?** Yes · **Encrypted in transit?** Yes · **Deletion available?** Yes (in-app account deletion).
- Declare: Email, User IDs, Purchase history, App interactions, User-generated content (notes),
  Crash logs, Diagnostics, Device/advertising ID. Mark **Shared with Meta** for User IDs, Purchase
  history, App interactions, and Advertising ID (Meta ads); the rest **Collected**.

### 2g. Other declarations
- **Government app:** No · **Financial features:** No · **Health:** No (relationship wellness, not medical) ·
  **News app:** No · **COVID-19 contact tracing:** No.

---

## 3. App signing & the release build

### 3a. Play App Signing (do once)
Google manages the app signing key; you upload with an **upload key**. When you create the first
release, Play enrolls you automatically — accept **Use Play App Signing**.

### 3b. Create an upload keystore (once)
```bash
keytool -genkey -v -keystore op-upload.keystore -alias op-upload \
  -keyalg RSA -keysize 2048 -validity 10000
```
Store the keystore + passwords securely (password manager). Reference it in
`android/app/build.gradle` via a `signingConfigs { release { ... } }` block reading from
`~/.gradle/gradle.properties` (never commit the keystore or passwords).

### 3c. Build the production AAB
```bash
# from repo root
source ~/.nvm/nvm.sh && nvm use 22.18.0
npm run build            # production web bundle (VITE_DEV_AUTH_BYPASS=false, no screenshot flags)
npx cap sync android
export JAVA_HOME="/Applications/Android Studio.app/Contents/jbr/Contents/Home"   # Capacitor 8 needs JDK 21
cd android && ./gradlew :app:bundleRelease
# output: android/app/build/outputs/bundle/release/app-release.aab
```
Before building, bump **`versionCode`** (integer, must increase every upload) and **`versionName`**
in `android/app/build.gradle`.

> The Crashlytics Gradle plugin (already added) uploads the deobfuscation mapping on release builds —
> good, keep it. Confirm `google-services.json` is present so Firebase initializes.

---

## 4. Subscription product + RevenueCat (Android)

The app currently logs `no current offering returned by RevenueCat` on Android because the Play
subscription + RevenueCat link don't exist yet. Set up:

1. **Play Console → Monetize → Products → Subscriptions → Create subscription:**
   - Product ID e.g. `op_monthly` / `op_annual` (match your RevenueCat product config)
   - Base plans + prices ($21.99/mo, $224.99/yr) + a **7-day free trial** offer
2. **Link RevenueCat to Play:** RevenueCat → your Android app → **Play Store credentials** → upload a
   **Google Play service account JSON** with permissions to view financial data + manage orders
   (create it in Google Cloud Console → grant it in Play Console → Users and permissions).
3. In RevenueCat, add the Play products to the **`premium`** entitlement + the current **offering**
   (same offering identifier as iOS/web).
4. Rebuild → the Android paywall should then show live prices and purchases unlock `premium`.

> First-time: you must upload at least one AAB to a track before Play activates the subscription
> products for testing.

---

## 5. Create the release & submit

Recommended path: **test internally first, then promote to production.**

### 5a. Internal testing (fast, private)
1. **Test and release → Testing → Internal testing → Create new release**
2. Upload `app-release.aab` → add **release notes** → **Save → Review → Start rollout to Internal testing**
3. Add testers (your email + client) under the Internal testing **Testers** tab → share the opt-in link
4. Install via the link, verify the app runs, purchases work (license testers get sandbox purchases),
   and Meta/Firebase events fire.

### 5b. Production release
1. **Test and release → Production → Create new release**
2. Upload the AAB (or **promote** the internal-testing build)
3. **Release notes** → set **Countries/regions** (add the markets you want; US at minimum)
4. Confirm **Free** pricing
5. **Save → Review release → Start rollout to Production**

### 5c. Submit for review
Once Store listing + App content are all green and a Production release is rolled out, Play submits
it for review automatically. First review typically **a few days to ~1 week** (longer if identity
verification is still pending). You'll get email updates.

---

## 6. Post-launch (don't forget)

- **Add the release key hash to the Facebook App** so Meta app-event attribution works on the live app:
  - Play Console → **Test and release → App integrity → App signing** → copy the **SHA-1** of the
    *App signing key certificate*
  - Convert to base64: `echo <SHA1_HEX> | xxd -r -p | openssl base64`
  - Facebook App → Settings → Android → add this as a second **Key hash** (alongside the debug one)
- **Swap the landing-page Google Play badge** from `#waitlist` to
  `https://play.google.com/store/apps/details?id=com.outstandingpartner.app` (tell me and I'll deploy it).
- **RevenueCat → Meta integration:** now that the app is live with the SDK, subscription events will
  attribute properly.
- **Data safety must stay accurate** — if tracking changes later, update the form.

---

## Submission checklist
- [ ] Store listing: icon, feature graphic, 4–6 phone screenshots, text (client)
- [ ] Privacy policy URL set
- [ ] Ads = No
- [ ] App access: reviewer test credentials provided
- [ ] Content rating questionnaire completed
- [ ] Target audience = 18+
- [ ] Data safety form completed (per NATIVE_TRACKING_SETUP.md)
- [ ] Other declarations (gov/financial/health/news) = No
- [ ] Play App Signing enrolled; upload keystore secured
- [ ] Production AAB built (versionCode bumped) + Firebase/Crashlytics present
- [ ] Subscription products created + RevenueCat Play link + offering set
- [ ] Internal test passed (app runs, purchase unlocks premium, events fire)
- [ ] Production release rolled out → submitted for review
- [ ] Post-launch: release key hash → Facebook App; Play badge swapped on landing page
