import { useState, useEffect, useCallback } from 'react';
import * as RC from '../services/revenuecat.service.js';
import * as RCWeb from '../services/revenuecatWeb.service.js';
import { setNativeAnalyticsUser, logNativePurchase } from '../services/analytics.native.js';
import { trackWeb, trackWebPixel } from '../services/analytics.web.js';

// Pull a numeric amount out of a localized price string ("$224.99" → 224.99).
function priceToNumber(s) {
  if (typeof s !== 'string') return undefined;
  const m = s.replace(/,/g, '').match(/(\d+(?:\.\d+)?)/);
  return m ? Number(m[1]) : undefined;
}

// Both SDKs expose the same entitlement fields (willRenew / periodType / expirationDate), but
// the web SDK returns Date objects and lowercase period types while the native one returns
// strings and uppercase. Normalize once so the UI never has to care which platform it is on.
function normalizeEntitlement(ent) {
  if (!ent) return null;
  const iso = (v) => (v ? (v instanceof Date ? v.toISOString() : String(v)) : null);
  const period = String(ent.periodType || '').toLowerCase();
  return {
    expiresAt: iso(ent.expirationDate),
    willRenew: !!ent.willRenew,
    isTrial: period === 'trial',
    isIntro: period === 'intro',
    store: ent.store || null,
    unsubscribedAt: iso(ent.unsubscribeDetectedAt),
  };
}

// Owns subscription state. Native (iOS/Android) uses RevenueCat's Capacitor SDK;
// web uses RevenueCat Web Billing (Stripe) via purchases-js. When neither is
// available (e.g. web without a web key), it stays inert so the dev bypass /
// lifetime path can still drive access.
export function useSubscription(userId) {
  const web = RCWeb.webBillingAvailable();
  const native = RC.rcAvailable();

  const [isSubscribed, setIsSubscribed] = useState(false);
  const [activeProductId, setActiveProductId] = useState(null);
  const [offering, setOffering] = useState(null);
  const [managementURL, setManagementURL] = useState(null);
  const [entitlement, setEntitlement] = useState(null);
  const [ready, setReady] = useState(!native && !web); // ready immediately if no billing
  const [busy, setBusy] = useState(false);

  // ---- Native (RevenueCat Capacitor) ----
  const applyInfo = useCallback((info) => {
    setIsSubscribed(RC.isPremiumInfo(info));
    setActiveProductId(RC.activeProductId(info));
    setManagementURL(info?.managementURL || null);
    setEntitlement(normalizeEntitlement(info?.entitlements?.active?.[RC.ENTITLEMENT_ID]));
  }, []);

  const refreshNative = useCallback(async () => {
    const info = await RC.getCustomerInfo();
    if (info) applyInfo(info);
    const off = await RC.getCurrentOffering();
    if (off) {
      setOffering(off);
      const n = off.availablePackages?.length || 0;
      console.log('[subscription] offering "' + off.identifier + '" loaded with ' + n + ' package(s)');
      if (n === 0) console.warn('[subscription] 0 packages — check App Store product status.');
    } else {
      console.warn('[subscription] no current offering returned by RevenueCat');
    }
  }, [applyInfo]);

  // ---- Web (RevenueCat Web Billing / Stripe) ----
  const refreshWeb = useCallback(async () => {
    let premium = false;
    const info = await RCWeb.getWebCustomerInfo();
    if (info) {
      premium = RCWeb.isPremiumWeb(info);
      setIsSubscribed(premium);
      setManagementURL(RCWeb.webManagementURL(info));
      setActiveProductId(RCWeb.webActiveProductId(info));
      setEntitlement(normalizeEntitlement(info?.entitlements?.active?.[RCWeb.ENTITLEMENT_ID]));
    }
    const off = await RCWeb.getWebOffering();
    setOffering(off);
    if (off) {
      const n = off.availablePackages?.length || 0;
      console.log('[subscription:web] offering "' + off.identifier + '" loaded with ' + n + ' package(s)');
    } else {
      console.warn('[subscription:web] no current offering returned');
    }
    return premium;
  }, []);

  // Configure + initial load. Re-runs when the signed-in user changes (web changeUser).
  useEffect(() => {
    let mounted = true;

    if (web) {
      (async () => {
        const ok = await RCWeb.configureWeb(userId);
        if (!ok) { if (mounted) setReady(true); return; }
        await refreshWeb();
        if (mounted) setReady(true);
      })();
      return () => { mounted = false; };
    }

    if (native) {
      (async () => {
        const ok = await RC.configureRC();
        if (!ok) { if (mounted) setReady(true); return; }
        await RC.addCustomerInfoListener((info) => { if (mounted) applyInfo(info); });
        if (userId) { await RC.rcLogIn(userId); setNativeAnalyticsUser(userId); }
        await refreshNative();
        if (mounted) setReady(true);
      })();
      return () => { mounted = false; };
    }

    return () => { mounted = false; };
  }, [userId, web, native]); // eslint-disable-line react-hooks/exhaustive-deps

  const refresh = useCallback(async () => {
    if (web) return refreshWeb();
    if (native) return refreshNative();
  }, [web, native, refreshWeb, refreshNative]);

  const purchase = useCallback(async (pkg, customerEmail) => {
    setBusy(true);
    try {
      if (web) {
        const info = await RCWeb.purchaseWebPackage(pkg?._web || pkg, customerEmail);
        const ok = RCWeb.isPremiumWeb(info);
        if (ok) {
          setIsSubscribed(true); setManagementURL(RCWeb.webManagementURL(info)); setActiveProductId(RCWeb.webActiveProductId(info));
          const value = priceToNumber(pkg?.product?.priceString);
          trackWeb('purchase', { value, currency: 'USD', product_id: pkg?.product?.identifier || null });
          trackWebPixel('Purchase', { value, currency: 'USD' });
        }
        return ok;
      }
      const ok = await RC.purchasePackage(pkg);
      setIsSubscribed(ok);
      if (ok) {
        logNativePurchase({
          value: pkg?.product?.price,
          currency: pkg?.product?.currencyCode || 'USD',
          productId: pkg?.product?.identifier,
          isTrial: !!pkg?.product?.introPrice,
        });
      }
      return ok;
    } finally { setBusy(false); }
  }, [web]);

  const restore = useCallback(async () => {
    setBusy(true);
    try {
      // Web purchases are tied to the app_user_id (Supabase id) — "restore" is just a
      // re-fetch of the customer's entitlements.
      if (web) return await refreshWeb();
      const ok = await RC.restorePurchases();
      setIsSubscribed(ok);
      return ok;
    } finally { setBusy(false); }
  }, [web, refreshWeb]);

  // Derive the active plan (monthly/annual + localized price) by matching the
  // entitlement's product id against the offering packages.
  const plan = (() => {
    if (!isSubscribed) return null;
    const pkgs = (offering && offering.availablePackages) || [];
    const pkg = pkgs.find(p => p?.product?.identifier && p.product.identifier === activeProductId);
    let type = null;
    let priceString = null;
    if (pkg) {
      priceString = pkg.product?.priceString || null;
      type = pkg.packageType === 'ANNUAL' ? 'annual'
        : pkg.packageType === 'MONTHLY' ? 'monthly'
        : /(annual|year)/i.test(pkg.identifier || '') ? 'annual'
        : /month/i.test(pkg.identifier || '') ? 'monthly' : null;
    }
    if (!type && activeProductId) {
      type = /(annual|year)/i.test(activeProductId) ? 'annual'
        : /month/i.test(activeProductId) ? 'monthly' : null;
    }
    return { type, priceString, productId: activeProductId };
  })();

  return { isSubscribed, plan, entitlement, offering, ready, busy, managementURL, purchase, restore, refresh, available: native || web };
}
