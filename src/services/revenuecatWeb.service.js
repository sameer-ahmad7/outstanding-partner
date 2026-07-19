import { Capacitor } from '@capacitor/core';

// RevenueCat Web Billing (Stripe) integration — used only on the web build. Native
// keeps using @revenuecat/purchases-capacitor (revenuecat.service.js). The SDK is
// dynamically imported so it never loads inside the native app.
export const ENTITLEMENT_ID = 'premium';

// Production Web Billing key by default. For QA, appending `?rcsandbox=1` to the URL
// switches to the sandbox key (Stripe test mode → test cards, no real charge); the choice
// is remembered in localStorage so it survives navigation. `?rcsandbox=0` clears it.
// Normal visitors (no flag) always use the production key.
function selectWebKey() {
  const prod = import.meta.env.VITE_REVENUECAT_WEB_API_KEY;
  const sandbox = import.meta.env.VITE_REVENUECAT_WEB_SANDBOX_API_KEY;
  try {
    const flag = new URLSearchParams(window.location.search).get('rcsandbox');
    if (flag === '1') localStorage.setItem('rc_sandbox', '1');
    if (flag === '0') localStorage.removeItem('rc_sandbox');
    if (localStorage.getItem('rc_sandbox') === '1' && sandbox) {
      console.log('[RCweb] SANDBOX mode (Stripe test) — not for real purchases');
      return sandbox;
    }
  } catch (e) { /* no window/localStorage */ }
  return prod;
}
const WEB_KEY = selectWebKey();

let purchases = null;
let currentUser = null;

export function webBillingAvailable() {
  return !(Capacitor?.isNativePlatform?.()) && !!WEB_KEY;
}

async function pjs() {
  return import('@revenuecat/purchases-js');
}

// Configure once; if the signed-in user changes, switch the RevenueCat customer.
// app_user_id === Supabase user id (identical to native) → one customer across
// web + iOS + Android → entitlements sync automatically.
export async function configureWeb(appUserId) {
  if (!webBillingAvailable() || !appUserId) return null;
  try {
    const { Purchases } = await pjs();
    if (!purchases) {
      purchases = Purchases.configure({ apiKey: WEB_KEY, appUserId });
      currentUser = appUserId;
    } else if (currentUser !== appUserId) {
      await purchases.changeUser(appUserId);
      currentUser = appUserId;
    }
  } catch (e) {
    console.warn('[RCweb] configure failed:', e?.message || e);
    return null;
  }
  return purchases;
}

export async function getWebCustomerInfo() {
  if (!purchases) return null;
  try { return await purchases.getCustomerInfo(); }
  catch (e) { console.warn('[RCweb] getCustomerInfo failed:', e?.message || e); return null; }
}

export function isPremiumWeb(info) {
  return !!info?.entitlements?.active?.[ENTITLEMENT_ID];
}

export function webManagementURL(info) {
  return info?.managementURL || null;
}

export function webActiveProductId(info) {
  const ent = info?.entitlements?.active?.[ENTITLEMENT_ID];
  return ent?.productIdentifier || ent?.productPlanIdentifier || null;
}

// Open the RevenueCat Web Billing checkout (Stripe) for a package. Returns the
// updated CustomerInfo on success (or throws / returns null on cancel/failure).
export async function purchaseWebPackage(rcPackage, customerEmail) {
  if (!purchases || !rcPackage) return null;
  const params = { rcPackage };
  if (customerEmail) params.customerEmail = customerEmail;
  const res = await purchases.purchase(params);
  return res?.customerInfo || null;
}

// Parse an ISO-8601 duration ("P7D", "P1W", "P1M") into { periodUnit, periodNumberOfUnits }.
function parseTrial(freeTrialPhase) {
  if (!freeTrialPhase) return null;
  const iso = freeTrialPhase.periodDuration || freeTrialPhase.period?.iso || '';
  const m = /P(?:(\d+)Y)?(?:(\d+)M)?(?:(\d+)W)?(?:(\d+)D)?/.exec(iso);
  if (!m) return null;
  if (m[1]) return { periodUnit: 'year', periodNumberOfUnits: +m[1] };
  if (m[2]) return { periodUnit: 'month', periodNumberOfUnits: +m[2] };
  if (m[3]) return { periodUnit: 'week', periodNumberOfUnits: +m[3] };
  if (m[4]) return { periodUnit: 'day', periodNumberOfUnits: +m[4] };
  return null;
}

// Normalize the web offering into the shape the Paywall already expects for native
// (packageType 'MONTHLY'/'ANNUAL', product.priceString, product.introPrice), and keep
// the raw web package on `_web` for the purchase call.
export function normalizeWebOffering(current) {
  if (!current) return null;
  const packages = (current.availablePackages || []).map((p) => {
    const prod = p.webBillingProduct || p.rcBillingProduct || {};
    const pt = p.packageType === '$rc_monthly' ? 'MONTHLY'
      : p.packageType === '$rc_annual' ? 'ANNUAL'
      : p.packageType;
    const trial = parseTrial(prod.freeTrialPhase);
    return {
      identifier: p.identifier,
      packageType: pt,
      product: {
        identifier: prod.identifier || null,
        priceString: prod.price?.formattedPrice || prod.currentPrice?.formattedPrice || null,
        introPrice: trial ? { price: 0, ...trial } : null,
      },
      _web: p,
    };
  });
  return { identifier: current.identifier, availablePackages: packages };
}

export async function getWebOffering() {
  if (!purchases) return null;
  try {
    const offerings = await purchases.getOfferings();
    return normalizeWebOffering(offerings?.current || null);
  } catch (e) {
    console.warn('[RCweb] getOfferings failed:', e?.message || e);
    return null;
  }
}
