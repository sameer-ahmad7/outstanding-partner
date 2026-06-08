import { Capacitor } from '@capacitor/core';

// RevenueCat integration. Native (iOS/Android) only — on web every call is a safe no-op.
export const ENTITLEMENT_ID = 'premium';
let configured = false;

export function rcAvailable() {
  return Capacitor.isNativePlatform?.() || false;
}

async function rc() {
  return import('@revenuecat/purchases-capacitor');
}

export async function configureRC() {
  if (!rcAvailable() || configured) return configured;
  const platform = Capacitor.getPlatform();
  const apiKey =
    platform === 'ios'
      ? import.meta.env.VITE_REVENUECAT_IOS_API_KEY
      : import.meta.env.VITE_REVENUECAT_ANDROID_API_KEY;
  if (!apiKey) return false; // keys not set yet
  try {
    const { Purchases, LOG_LEVEL } = await rc();
    await Purchases.setLogLevel({ level: LOG_LEVEL.WARN });
    await Purchases.configure({ apiKey });
    configured = true;
  } catch (e) {
    console.warn('[RC] configure failed:', e?.message || e);
  }
  return configured;
}

export function isPremiumInfo(customerInfo) {
  return !!customerInfo?.entitlements?.active?.[ENTITLEMENT_ID];
}

export async function rcLogIn(userId) {
  if (!configured || !userId) return;
  try { const { Purchases } = await rc(); await Purchases.logIn({ appUserID: userId }); }
  catch (e) { console.warn('[RC] logIn failed:', e?.message || e); }
}

export async function rcLogOut() {
  if (!configured) return;
  try { const { Purchases } = await rc(); await Purchases.logOut(); }
  catch (e) { /* anonymous already */ }
}

export async function getCustomerInfo() {
  if (!configured) return null;
  try { const { Purchases } = await rc(); const { customerInfo } = await Purchases.getCustomerInfo(); return customerInfo; }
  catch (e) { return null; }
}

export async function getCurrentOffering() {
  if (!configured) return null;
  try { const { Purchases } = await rc(); const offerings = await Purchases.getOfferings(); return offerings?.current || null; }
  catch (e) { console.warn('[RC] getOfferings failed:', e?.message || e); return null; }
}

export async function purchasePackage(pkg) {
  if (!configured) return false;
  const { Purchases } = await rc();
  const res = await Purchases.purchasePackage({ aPackage: pkg });
  return isPremiumInfo(res.customerInfo);
}

export async function restorePurchases() {
  if (!configured) return false;
  const { Purchases } = await rc();
  const { customerInfo } = await Purchases.restorePurchases();
  return isPremiumInfo(customerInfo);
}

export async function addCustomerInfoListener(cb) {
  if (!configured) return;
  try {
    const { Purchases } = await rc();
    await Purchases.addCustomerInfoUpdateListener((info) => cb(isPremiumInfo(info)));
  } catch (e) { /* ignore */ }
}
