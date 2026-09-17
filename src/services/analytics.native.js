import { Capacitor } from '@capacitor/core';

// Native (iOS/Android) analytics + crash reporting. Every export is a safe no-op
// on web (the web build uses analytics.web.js — GA4 + Meta Pixel — instead).
//
// Stack on native:
//  - Firebase Analytics (→ same GA4 property as the web) + Crashlytics, via the
//    @capacitor-firebase plugins (Firebase is auto-configured from the bundled
//    GoogleService-Info.plist / google-services.json).
//  - Meta App Events via the Facebook SDK: installs/sessions are auto-logged
//    natively (see the iOS Info.plist / Android manifest config). Purchase/trial
//    events reach Meta through the RevenueCat → Meta integration (server-side),
//    so there is no fragile JS→native purchase bridge here.
//  - iOS App Tracking Transparency prompt (required before Meta advertiser tracking).

const isNative = () => Capacitor?.isNativePlatform?.() || false;
let inited = false;

// iOS refuses to show the ATT prompt unless the app is in the *active* state, so a
// cold-start call silently no-ops behind the splash screen. Wait for active first.
async function whenAppActive() {
  try {
    const { App } = await import('@capacitor/app');
    const { isActive } = await App.getState();
    if (isActive) return;
    await new Promise((resolve) => {
      let done = false;
      const finish = () => { if (!done) { done = true; resolve(); } };
      App.addListener('appStateChange', ({ isActive: active }) => { if (active) finish(); });
      setTimeout(finish, 5000); // don't hang forever
    });
  } catch { /* @capacitor/app unavailable — fall through */ }
}

export async function initNativeTracking() {
  if (inited || !isNative()) return;
  inited = true;
  console.log('[tracking] init on', Capacitor.getPlatform());

  // iOS: ask for tracking permission once (must be active + after the splash).
  try {
    if (Capacitor.getPlatform() === 'ios') {
      await whenAppActive();
      await new Promise((r) => setTimeout(r, 800)); // let the splash dismiss
      const { AppTrackingTransparency } = await import('capacitor-plugin-app-tracking-transparency');
      const res = await AppTrackingTransparency.getStatus();
      console.log('[ATT] status before request:', res?.status);
      if (res?.status === 'notDetermined') {
        const after = await AppTrackingTransparency.requestPermission();
        console.log('[ATT] status after request:', after?.status);
      }
    }
  } catch (e) { console.warn('[ATT]', e?.message || e); }

  // Firebase Analytics — enable collection.
  try {
    const { FirebaseAnalytics } = await import('@capacitor-firebase/analytics');
    await FirebaseAnalytics.setEnabled({ enabled: true });
  } catch (e) { console.warn('[analytics.native] FBA init', e?.message || e); }

  // Crashlytics — enable collection.
  try {
    const { FirebaseCrashlytics } = await import('@capacitor-firebase/crashlytics');
    await FirebaseCrashlytics.setEnabled({ enabled: true });
  } catch (e) { console.warn('[analytics.native] Crashlytics init', e?.message || e); }
}

// Associate analytics/crash reports with the signed-in user (Supabase id — not PII).
// Passing null on sign-out detaches later events from the previous user.
export async function setNativeAnalyticsUser(userId) {
  if (!isNative()) return;
  const id = userId ? String(userId) : null;
  try {
    const { FirebaseAnalytics } = await import('@capacitor-firebase/analytics');
    await FirebaseAnalytics.setUserId({ userId: id });
  } catch (e) { /* ignore */ }
  try {
    const { FirebaseCrashlytics } = await import('@capacitor-firebase/crashlytics');
    await FirebaseCrashlytics.setUserId({ userId: id || '' });
  } catch (e) { /* ignore */ }
}

export async function setNativeUserProperties(props) {
  if (!isNative() || !props) return;
  try {
    const { FirebaseAnalytics } = await import('@capacitor-firebase/analytics');
    for (const [key, value] of Object.entries(props)) {
      await FirebaseAnalytics.setUserProperty({ key, value: value == null ? null : String(value) });
    }
  } catch (e) { /* ignore */ }
}

// The whole app is one WebView, so Firebase's automatic screen reporting only ever sees
// the host view controller/activity. Tabs are reported by hand instead.
export async function logNativeScreen(screen) {
  if (!isNative() || !screen) return;
  try {
    const { FirebaseAnalytics } = await import('@capacitor-firebase/analytics');
    await FirebaseAnalytics.setCurrentScreen({ screenName: screen, screenClassOverride: screen });
  } catch (e) { /* ignore */ }
}

// Log a custom event to Firebase Analytics (rolls into the shared GA4 property).
export async function logNativeEvent(name, params) {
  if (!isNative() || !name) return;
  try {
    const { FirebaseAnalytics } = await import('@capacitor-firebase/analytics');
    await FirebaseAnalytics.logEvent({ name, params: params || {} });
  } catch (e) { /* ignore */ }
}
