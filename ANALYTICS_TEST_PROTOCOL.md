# Analytics Test Protocol — Firebase · Meta Pixel · Meta App Events (Web/iOS/Android)

Run each test, capture the **evidence** column, and send it back. I confirm pass/fail.
Tests are ordered easiest → hardest. Web needs only a browser; iOS/Android need a run + a device for the full set.

**Dashboards**
- Meta events (both web + app): `https://eventsmanager.facebook.com/events_manager2/list/dataset/1110278981958912/overview?business_id=1568025681577804` → **Test events** tab
- GA4: analytics.google.com → property `outstanding-partner`
- Firebase: console.firebase.google.com → `outstanding-partner-app`

---

## SECTION 0 — one-time debug setup

| | Do this | Purpose |
|---|---|---|
| 0a | Install the **Meta Pixel Helper** Chrome extension | See web pixel events instantly in-browser |
| 0b | Install the **Google Analytics Debugger** Chrome extension (or add `?debug_mode=1` to the URL) | Makes GA4 events show in GA4 DebugView |
| 0c | **iOS:** Xcode → Product → Scheme → Edit Scheme → Run → Arguments → add `-FIRDebugEnabled` | Firebase DebugView shows iOS events live |
| 0d | **Android:** `adb shell setprop debug.firebase.analytics.app com.outstandingpartner.app` | Firebase DebugView shows Android events live |
| 0e | Meta → dataset → **Test events** tab → for app testing, follow the on-screen device-pairing prompt | Streams app events in real time |

---

## SECTION 1 — WEB (Meta Pixel + GA4)  ·  do this now, needs only a browser

Open two tabs: Meta **Test events** and GA4 **Realtime**. Then:

| # | Action | Where to look | PASS = | Evidence to send |
|---|---|---|---|---|
| W1 | Open `https://outstandingpartner.app` | Meta Test events | `PageView` appears within seconds | Screenshot of Test events showing PageView |
| W2 | Same page — click the Pixel Helper icon | Pixel Helper popup | Shows pixel `1110278981958912`, 1 PageView, no errors | Screenshot of the Pixel Helper popup |
| W3 | Same visit | GA4 → Realtime | 1 active user shows | Screenshot of GA4 Realtime |
| W4 | Submit the **waitlist form** (fresh email) | Meta Test events + your inbox | `Lead` event appears **and** confirmation email arrives | Screenshot of `Lead` + say "email arrived: yes/no" |
| W5 | Same submit | GA4 → Realtime → event count | `generate_lead` shows | Screenshot |
| W6 | Click an **App Store / Google Play badge** | Meta Test events | `DownloadClick` appears | Screenshot |
| W7 | `https://outstandingpartner.app/app?rcsandbox=1` → subscribe with test card `4242 4242 4242 4242` | Meta Test events + GA4 | `Purchase` appears in Meta; `purchase` in GA4 | Screenshot of both (then reset with `?rcsandbox=0`) |

> If W1–W3 pass, the web Pixel + GA4 install is proven. W4–W7 prove each conversion event.

---

## SECTION 2 — iOS (Firebase + Meta App Events)

### 2A. Simulator (partial — no ATT/IDFA)
| # | Action | Where to look | PASS = | Evidence |
|---|---|---|---|---|
| I1 | `npx cap sync ios`, build & run | Xcode console on launch | `[Meta] Facebook SDK LINKED ✅ appID=1619043059848775 clientToken=set` | Paste the console line |
| I2 | Same launch | Xcode console | Meta app-event log lines (e.g. `fb_mobile_activate_app` logged) | Paste any `fb_mobile_*` lines |
| I3 | Same launch — JS console (Safari → Develop → Simulator → app WebView → Console) | JS console | `[tracking] init on ios` | Paste the line |
| I4 | Do a StoreKit test purchase | Xcode console | `To Native -> FirebaseAnalytics logEvent` (the purchase event) | Paste the line |
| I5 | Firebase → Analytics → **DebugView** (with `-FIRDebugEnabled`) | DebugView | Device appears; `purchase` / `start_trial` events show | Screenshot of DebugView |

### 2B. Real device (required for the rest)
| # | Action | Where to look | PASS = | Evidence |
|---|---|---|---|---|
| I6 | Fresh install → launch | The device screen | **ATT prompt appears** with our copy | Photo/screenshot of the prompt |
| I7 | Tap **Allow** | JS console | `[ATT] status after request: authorized` | Paste the line |
| I8 | Relaunch app | Meta → dataset → **Test events** | `fb_mobile_activate_app` arrives, Integration = **Facebook SDK** | Screenshot |
| I9 | Check the app data source (`1619043059848775`) in Events Manager | Overview header | ⚠️ "Inactive / Never received event" is **gone** → shows **Active** | Screenshot |
| I10 | Force a test crash, relaunch | Firebase → **Crashlytics** | Crash appears within ~5 min | Screenshot |

---

## SECTION 3 — ANDROID (Firebase + Meta App Events)

| # | Action | Where to look | PASS = | Evidence |
|---|---|---|---|---|
| A1 | Build & install: `export JAVA_HOME="/Applications/Android Studio.app/Contents/jbr/Contents/Home"` then run from Android Studio | Device/emulator | App launches, no crash | Say "launched: yes/no" |
| A2 | `adb logcat -s FacebookSDK AppEvents` while launching | Terminal | Facebook SDK log lines appear | Paste a few lines |
| A3 | Launch the app | Meta → dataset → **Test events** | Activate-app event arrives, Integration = **Facebook SDK** | Screenshot |
| A4 | With `adb setprop` (0d) set, use the app | Firebase → **DebugView** | Android device appears with events | Screenshot |
| A5 | Do a Play-sandbox / RC test purchase | Firebase DebugView | `purchase` event shows | Screenshot |
| A6 | Force a crash, relaunch | Firebase → **Crashlytics** | Crash appears | Screenshot |
| A7 | `adb shell dumpsys package com.outstandingpartner.app \| grep AD_ID` | Terminal | Shows `com.google.android.gms.permission.AD_ID` granted | Paste the line |

---

## SECTION 4 — RevenueCat → Meta (server-side, at real launch)

| # | Action | Where to look | PASS = | Evidence |
|---|---|---|---|---|
| R1 | Make a **production** (non-sandbox) purchase | Meta → dataset → Test events / Overview | Event with Integration = **Conversions API** | Screenshot |
| R2 | RevenueCat → Integrations → Meta Ads | Status | Shows active/connected | Screenshot |

> Blocked until real purchases happen (you left the sandbox fields empty by design).

---

## REPORT-BACK TEMPLATE (paste this filled in)

```
WEB
W1 PageView: PASS/FAIL  (evidence: …)
W2 Pixel Helper: PASS/FAIL
W3 GA4 Realtime: PASS/FAIL
W4 Lead + email: PASS/FAIL
W5 GA4 generate_lead: PASS/FAIL
W6 DownloadClick: PASS/FAIL
W7 Purchase (web): PASS/FAIL

iOS
I1 Meta LINKED line: <paste>
I2 fb_mobile_* logs: <paste>
I3 [tracking] init: <paste>
I4 Firebase logEvent: <paste>
I5 DebugView: PASS/FAIL
I6 ATT prompt: PASS/FAIL
I7 ATT authorized: <paste>
I8 activate_app in Test Events: PASS/FAIL
I9 app source Active: PASS/FAIL
I10 Crashlytics: PASS/FAIL

ANDROID
A1 launch: PASS/FAIL
A2 FacebookSDK logcat: <paste>
A3 activate_app Test Events: PASS/FAIL
A4 DebugView: PASS/FAIL
A5 purchase: PASS/FAIL
A6 Crashlytics: PASS/FAIL
A7 AD_ID: <paste>
```
