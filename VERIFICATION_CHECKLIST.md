# End-to-End Verification Checklist — Web · iOS · Android

Work top to bottom. Each row says **what to do** and **what proves it worked**. Anything that
can't be verified yet has the blocker noted.

**Key surfaces**
- Meta events → `https://eventsmanager.facebook.com/events_manager2/list/dataset/1110278981958912/overview?business_id=1568025681577804`
  (**Test events** tab = real-time; **Overview** = aggregated, 20min–hours delay)
- GA4 → analytics.google.com → **Reports → Realtime**
- Firebase → console.firebase.google.com → project `outstanding-partner-app`

---

## A. WEB — verifiable right now ✅

| # | Do this | Proof |
|---|---|---|
| A1 | Open `https://outstandingpartner.app` | Meta **Test events** shows `PageView`; GA4 Realtime shows 1 active user |
| A2 | Install **Meta Pixel Helper** (Chrome ext), reload the site | Shows pixel `1110278981958912` firing, no warnings |
| A3 | Submit the **waitlist form** with a fresh email | Meta shows **`Lead`**; GA4 shows `generate_lead`; **confirmation email arrives** (Resend) |
| A4 | Submit the **same email again** | UI says you're on the list; **no second email** (dedupe works) |
| A5 | Click the **App Store** / **Google Play** badge | Meta shows **`DownloadClick`**; GA4 shows `download_click` |
| A6 | Visit `/privacy`, `/support`, `/terms` | Each loads, warm theme, footer links work; GA4 counts the pageviews |
| A7 | Open `/app`, sign in | App loads in the phone-width frame; no console errors |
| A8 | `/app?rcsandbox=1` → subscribe with test card `4242 4242 4242 4242` | Console logs `[RCweb] SANDBOX mode`; checkout completes; **premium unlocks**; Meta shows **`Purchase`**, GA4 shows `purchase` |
| A9 | Meta → Business Settings → Brand safety → **Domains** | `outstandingpartner.app` shows **Verified** |
| A10 | Profile → **Manage subscription** | Opens the Stripe customer portal |

> ⚠️ After A8, remember `?rcsandbox=0` to exit sandbox mode.

---

## B. iOS

### B1 — Simulator (partial)
| # | Do this | Proof |
|---|---|---|
| B1.1 | `npx cap sync ios` → build & run in Xcode | Builds clean |
| B1.2 | Watch the **Xcode console** on launch | `[Meta] Facebook SDK LINKED ✅ appID=1619043059848775 clientToken=set` |
| B1.3 | Safari → Develop → Simulator → app WebView → Console | `[tracking] init on ios` and `[ATT] status before request: …` |
| B1.4 | Sign in, reach Today tab | All 7 tabs render; cloud sync writes to Supabase |
| B1.5 | Buy via StoreKit config | Premium unlocks; Xcode console shows `FirebaseAnalytics logEvent` |

### B2 — Real device (required for the rest)
| # | Do this | Proof |
|---|---|---|
| B2.1 | Fresh install → launch | **ATT prompt appears** with your copy ("This lets us measure our ads…") |
| B2.2 | Tap **Allow** | JS console: `[ATT] status after request: authorized` |
| B2.3 | Meta → dataset → **Test events**, relaunch app | **`fb_mobile_activate_app`** arrives, Integration = **Facebook SDK** |
| B2.4 | Check the app data source in Events Manager | ⚠️ "Inactive / Never received event" is **gone**; shows **Active** |
| B2.5 | Xcode scheme → Arguments → add `-FIRDebugEnabled`, relaunch | Firebase Console → Analytics → **DebugView** shows live events |
| B2.6 | Sandbox purchase | DebugView shows `purchase` / `start_trial` |
| B2.7 | Force a test crash, relaunch | Crash appears in Firebase **Crashlytics** within ~5 min |
| B2.8 | Re-test ATT: delete app → reinstall (or Settings → Privacy → Tracking) | Prompt shows again |

---

## C. ANDROID

| # | Do this | Proof |
|---|---|---|
| C1 | `export JAVA_HOME="/Applications/Android Studio.app/Contents/jbr/Contents/Home"` then `./gradlew :app:assembleDebug` | **BUILD SUCCESSFUL** (already verified ✅) |
| C2 | Install on emulator/device, launch | App runs; no crash on start |
| C3 | Meta → dataset → **Test events** | Activate-app event arrives, Integration = **Facebook SDK** |
| C4 | `adb shell setprop debug.firebase.analytics.app com.outstandingpartner.app`, relaunch | Firebase **DebugView** shows events |
| C5 | Purchase via Play sandbox / RC test | Premium unlocks; DebugView shows `purchase` |
| C6 | Force a crash, relaunch | Appears in **Crashlytics** |
| C7 | `adb shell dumpsys package com.outstandingpartner.app \| grep AD_ID` | `AD_ID` permission granted |

---

## D. SERVER-SIDE / INTEGRATIONS

| # | Do this | Proof | Blocker |
|---|---|---|---|
| D1 | RevenueCat → Integrations → **Meta Ads** | Shows configured/active; Dataset `1110278981958912` | — |
| D2 | Make a **production** purchase | Meta dataset shows event with Integration = **Conversions API** | Sandbox fields left empty by design → needs a real purchase |
| D3 | RevenueCat → **Customer** view | Purchase attributed; entitlement `premium` active | — |
| D4 | Waitlist broadcast (dry run) | See `WAITLIST_BROADCAST.md`; dryRun returns recipient count | — |

---

## E. CROSS-PLATFORM (the important one)

| # | Do this | Proof |
|---|---|---|
| E1 | Subscribe on **web**, then sign in with the same account on **iOS** | Premium is active on iOS (no second purchase) |
| E2 | Subscribe on **iOS**, sign in on **web** `/app` | Premium active on web |
| E3 | Change data on one platform (e.g. mark a mission done) | Appears on the other after reload (Supabase cloud sync) |
| E4 | Sign out / sign in | Onboarding does **not** replay; lands on Today |

*This works because `app_user_id` = Supabase user id on every platform.*

---

## F. PRIVACY / COMPLIANCE (pre-submission)

- [ ] ATT prompt shows **before** any advertiser-ID tracking (iOS)
- [ ] Denying ATT still lets the app work fully (no gating on consent)
- [ ] iOS **App Privacy** labels filled per `NATIVE_TRACKING_SETUP.md`
- [ ] Play **Data safety** form filled per the same doc
- [ ] In-app **account deletion** works (required by both stores)
- [ ] No Stripe/web-payment link anywhere inside the native apps (Apple 3.1.1)

---

## Known-blocked until launch
- **App install attribution** in Ads Manager → needs the apps live on the stores
- **AEM** (8-event ranking) → configure right before the first web Sales campaign
- **Real CAPI purchase events** → needs a production purchase (D2)
- **Release Android key hash** → add to the Facebook App from Play Console's app-signing SHA-1
