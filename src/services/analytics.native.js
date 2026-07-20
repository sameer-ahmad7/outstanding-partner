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

export async function initNativeTracking() {
  if (inited || !isNative()) return;
  inited = true;

  // iOS: ask for tracking permission once. Meta's advertiser tracking + Firebase
  // stay privacy-compliant based on the answer.
  try {
    if (Capacitor.getPlatform() === 'ios') {
      const { AppTrackingTransparency } = await import('capacitor-plugin-app-tracking-transparency');
      const res = await AppTrackingTransparency.getStatus();
      if (res?.status === 'notDetermined') {
        await AppTrackingTransparency.requestPermission();
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
export async function setNativeAnalyticsUser(userId) {
  if (!isNative() || !userId) return;
  try {
    const { FirebaseAnalytics } = await import('@capacitor-firebase/analytics');
    await FirebaseAnalytics.setUserId({ userId: String(userId) });
  } catch (e) { /* ignore */ }
  try {
    const { FirebaseCrashlytics } = await import('@capacitor-firebase/crashlytics');
    await FirebaseCrashlytics.setUserId({ userId: String(userId) });
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

// Fire a purchase (or trial-start) event to Firebase Analytics. Meta receives the
// equivalent via the RevenueCat → Meta integration, so we don't double-log it here.
export async function logNativePurchase({ value, currency = 'USD', productId, isTrial } = {}) {
  await logNativeEvent(isTrial ? 'start_trial' : 'purchase', {
    ...(value != null ? { value: Number(value) } : {}),
    currency,
    ...(productId ? { product_id: productId } : {}),
  });
}
