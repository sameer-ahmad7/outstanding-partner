# Native Tracking Setup (iOS + Android)

Firebase Analytics + Crashlytics, Meta (Facebook) App Events, and iOS App Tracking
Transparency for the native apps. Companion to `META_AND_ANALYTICS_SETUP.md` (the
account/console side) — this covers what's in the **codebase** and the few steps that
still need **Xcode / the store consoles** before shipping.

> **IDs used:** Meta App ID `1619043059848775`, Client Token in `.env`
> (`VITE_FACEBOOK_*`). Firebase project `outstanding-partner-app`.
> GA4 property `outstanding-partner` (`G-9T0SC0L8C1`) — app + web data land together.

---

## What's already wired in the repo ✅

**Cross-platform (via Capacitor plugins — `cap sync` installs them on both):**
- `@capacitor-firebase/analytics` + `@capacitor-firebase/crashlytics` (v8.3.0).
- `capacitor-plugin-app-tracking-transparency` (iOS ATT).
- `src/services/analytics.native.js` — `initNativeTracking()` (ATT prompt on iOS →
  enable Analytics + Crashlytics), `setNativeAnalyticsUser()`, `logNativeEvent()`,
  `logNativePurchase()`. All **no-op on web** (web uses `analytics.web.js` = GA4 + Pixel).
- Wired into `src/main.jsx` (init) and `src/hooks/useSubscription.js` (sets the analytics
  user on login; logs a `purchase`/`start_trial` event on a successful purchase).
- `vite.config.js` externalizes `firebase/*` (we never use the plugins' web path; native
  uses the native bridge) so the bundle builds without the `firebase` JS SDK.

**Android (config in repo):**
- `android/app/google-services.json` (Firebase) + google-services plugin already applied.
- Facebook SDK dependency `com.facebook.android:facebook-android-sdk:17.0.2`.
- Manifest: Meta meta-data (ApplicationId / ClientToken / AutoLogAppEventsEnabled /
  AdvertiserIDCollectionEnabled) + `AD_ID` permission. Strings: `facebook_app_id` etc.
- **Android is complete** — auto-logs installs/sessions once built; no manual step.

**iOS (config in repo):**
- `ios/App/App/GoogleService-Info.plist` (Firebase).
- `Info.plist`: Facebook keys, `NSUserTrackingUsageDescription` (ATT copy), `fb…` URL
  scheme, `LSApplicationQueriesSchemes`, Meta `SKAdNetworkItems`.
- `AppDelegate.swift`: Facebook init + `activateApp`, guarded by
  `#if canImport(FBSDKCoreKit)` — **compiles fine even before the SDK is added**; the Meta
  code activates automatically once the package is present (next step).

---

## iOS — two manual Xcode steps before building ⚠️

The iOS project uses **Swift Package Manager**. The Firebase plugins are added automatically
by `cap sync`, but two things need Xcode once:

### 1. Add **and link** the Facebook SDK (FBSDKCoreKit)
Two parts — adding the package is **not** enough on its own:

**a) Add the package:** **File → Add Package Dependencies…** → paste
`https://github.com/facebook/facebook-ios-sdk` → **Dependency Rule: Up to Next Major 17.0.0**
(don't leave it on `main`) → **Add Package** → tick **FacebookCore** for the **App** target (SPM names the product `FacebookCore`; `FBSDKCoreKit` is the CocoaPods name).

**b) Verify it's LINKED to the target** ← the step that's easy to miss:
App project → **App target → General → Frameworks, Libraries, and Embedded Content** → **＋** →
add **FacebookCore**. If it isn't listed there, the `#if canImport(FBSDKCoreKit)` guard compiles
all Meta code out and **the SDK silently does nothing** (app still builds fine).

**Confirm it worked:** run the app and check the Xcode console for
`[Meta] Facebook SDK LINKED ✅ appID=1619043059848775`.
If you see `[Meta] Facebook SDK NOT LINKED ❌`, step (b) didn't take.
Quick CLI check: `grep -c FacebookCore ios/App/App.xcodeproj/project.pbxproj` — must be > 0.

### 2. Confirm GoogleService-Info.plist is in the app target
In Xcode, select `GoogleService-Info.plist` (already in `ios/App/App/`) → File Inspector →
**Target Membership → check "App"**. (Also confirm it appears under **Build Phases → Copy
Bundle Resources**.) Firebase can't initialize on iOS without it bundled.

Then: `npx cap sync ios` → build/run.

---

## RevenueCat → Meta integration (purchase/trial/subscribe events)

App-install + session events flow from the **Meta SDK**. Subscription events
(**trial start / subscribe / renewal**) are best sent to Meta **server-side via RevenueCat**,
so they're accurate and deduped — no fragile in-app purchase bridge.

In the **RevenueCat dashboard** → your project → **Integrations → Facebook** (Meta):
1. Enter the **Meta App ID** `1619043059848775` (and, if requested, the app's system-user /
   Conversions API token from Meta).
2. Map RC events → Meta events (e.g. `INITIAL_PURCHASE`/`TRIAL_START` → `StartTrial`,
   `RENEWAL` → `Subscribe`, `NON_RENEWING_PURCHASE` → `Purchase`).
3. RC needs the device's Facebook anonymous ID to match — the Meta SDK in the app collects
   it; RC's SDK forwards it automatically once both are configured.

*(Firebase Analytics `purchase`/`start_trial` events are also logged in-app for GA4 — that's
independent of the Meta path.)*

---

## Store privacy declarations (do at submission)

> Based on the SDKs/services in the app: **Supabase** (account + app data), **RevenueCat**
> (subscriptions), **Firebase Analytics + Crashlytics**, **Meta App Events** (advertising ID +
> events). Confirm against your actual data practices — this is a starting point, not legal advice.

### iOS — App Store Connect → your app → **App Privacy → Edit**
Answer "Yes, we collect data," then for each type set **purposes**, **linked to the user's
identity? (yes)**, and **used for tracking? (yes/no)**. "Tracking" = anything shared with Meta
for advertising or that uses the advertising identifier.

| Data type | Collected via | Purpose | Linked | **Used to Track You** |
|---|---|---|---|---|
| **Contact Info → Email Address** | Supabase account | App Functionality | Yes | No |
| **Identifiers → User ID** | Supabase / RevenueCat | App Functionality, Analytics | Yes | No |
| **Identifiers → Device ID** (advertising ID) | Meta SDK | Third-Party Advertising, Analytics | Yes | **YES** |
| **Purchases → Purchase History** | RevenueCat, Meta, Firebase | App Functionality, Analytics, Advertising | Yes | **YES** |
| **Usage Data → Product Interaction** | Firebase, Meta | Analytics, Advertising | Yes | **YES** |
| **User Content** (relationship notes, etc.) | Supabase | App Functionality | Yes | No |
| **Diagnostics → Crash Data** | Crashlytics | App Functionality, Analytics | No | No |
| **Diagnostics → Performance Data** | Firebase/Crashlytics | Analytics | No | No |

Because some types are **"Used to Track You,"** the **ATT prompt is required** — it's implemented
(`NSUserTrackingUsageDescription` in `Info.plist`). Advertising-ID/tracking data is only used
when the user **allows** tracking in that prompt.

### Android — Play Console → **App content → Data safety**
- **Does your app collect or share user data?** → **Yes**.
- **Is all data encrypted in transit?** → **Yes** (HTTPS everywhere).
- **Do you provide a way to request data deletion?** → **Yes** (in-app account deletion exists) —
  give the deletion path / URL.
- Then, per data type, mark **Collected** and/or **Shared** (Shared = sent to a third party like
  Meta for advertising), plus purpose:

| Data type (Play category) | Collected | Shared (Meta) | Purpose |
|---|---|---|---|
| Personal info → **Email address** | ✅ | — | Account management, App functionality |
| Personal info → **User IDs** | ✅ | ✅ | Analytics, Advertising |
| Personal info → **Name** (if collected) | ✅ | — | App functionality |
| Financial info → **Purchase history** | ✅ | ✅ | Analytics, Advertising |
| App activity → **App interactions** | ✅ | ✅ | Analytics, Advertising |
| App activity → **Other user-generated content** (notes) | ✅ | — | App functionality |
| App info & performance → **Crash logs** | ✅ | — | Analytics |
| App info & performance → **Diagnostics** | ✅ | — | Analytics |
| Device or other IDs → **Device or other IDs** (advertising ID) | ✅ | ✅ | Advertising |

"Shared with Meta" reflects the Meta App Events SDK + advertising-ID collection. Firebase/RC data
is processed on your behalf (service providers) → mark **Collected** (not necessarily Shared),
per Play's definitions.

---

## Verify on a real device (after the rebuild)

1. **Build & run** on a device (Analytics/ATT don't fully work on simulators).
2. **iOS:** confirm the **ATT prompt** appears on first launch; the tracking usage string reads correctly.
3. **Meta App Events:** **Events Manager → your App data source → Test Events** (or the
   Facebook **Events Manager** app-events tester) → launch the app → see `fb_mobile_activate_app`.
4. **Firebase Analytics:** enable DebugView (`adb shell setprop debug.firebase.analytics.app com.outstandingpartner.app`
   on Android, or `-FIRDebugEnabled` launch arg on iOS) → **Firebase Console → Analytics →
   DebugView** → see events (`purchase`/`start_trial` after a sandbox purchase).
5. **GA4:** Realtime → app stream shows the session.
6. **Crashlytics:** force a test crash (or `FirebaseCrashlytics.crash()`), relaunch → the crash
   appears in **Firebase Console → Crashlytics** within minutes.

---

## Notes
- **Meta purchase events for ads** = RevenueCat integration above (not the in-app Firebase
  event). The in-app Meta SDK is for **install/session attribution + advertiser ID matching**.
- The Android **debug** key hash is registered in the Facebook App; add the **release** key
  hash (from Play Console → App integrity → App signing key SHA-1 → base64) before the Play launch.
- `SKAdNetworkItems` in `Info.plist` currently lists Meta's core IDs — Meta occasionally adds
  more; refresh from Meta's docs at ad-campaign time if needed.
