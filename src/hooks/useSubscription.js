import { useState, useEffect, useCallback } from 'react';
import * as RC from '../services/revenuecat.service.js';

// Owns RevenueCat config + entitlement state. On web, stays inert (isSubscribed=false,
// no offering) so the app can fall back to the dev bypass for local testing.
export function useSubscription(userId) {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [activeProductId, setActiveProductId] = useState(null);
  const [offering, setOffering] = useState(null);
  const [ready, setReady] = useState(!RC.rcAvailable()); // web is "ready" immediately
  const [busy, setBusy] = useState(false);

  const applyInfo = useCallback((info) => {
    setIsSubscribed(RC.isPremiumInfo(info));
    setActiveProductId(RC.activeProductId(info));
  }, []);

  const refresh = useCallback(async () => {
    const info = await RC.getCustomerInfo();
    if (info) applyInfo(info);
    const off = await RC.getCurrentOffering();
    if (off) {
      setOffering(off);
      const n = off.availablePackages?.length || 0;
      console.log('[subscription] offering "' + off.identifier + '" loaded with ' + n + ' purchasable package(s)');
      if (n === 0) console.warn('[subscription] 0 packages — App Store products not loadable (check Paid Apps Agreement / product status / sandbox account).');
    } else {
      console.warn('[subscription] no current offering returned by RevenueCat');
    }
  }, [applyInfo]);

  // Configure once on mount (native only).
  useEffect(() => {
    if (!RC.rcAvailable()) return;
    let mounted = true;
    (async () => {
      const ok = await RC.configureRC();
      if (!ok) { if (mounted) setReady(true); return; }
      await RC.addCustomerInfoListener((info) => { if (mounted) applyInfo(info); });
      if (userId) await RC.rcLogIn(userId);
      await refresh();
      if (mounted) setReady(true);
    })();
    return () => { mounted = false; };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Re-login + refresh when the signed-in user changes.
  useEffect(() => {
    if (!RC.rcAvailable() || !userId) return;
    RC.rcLogIn(userId).then(refresh);
  }, [userId, refresh]);

  const purchase = useCallback(async (pkg) => {
    setBusy(true);
    try { const ok = await RC.purchasePackage(pkg); setIsSubscribed(ok); return ok; }
    finally { setBusy(false); }
  }, []);

  const restore = useCallback(async () => {
    setBusy(true);
    try { const ok = await RC.restorePurchases(); setIsSubscribed(ok); return ok; }
    finally { setBusy(false); }
  }, []);

  // Derive the active plan (monthly/annual + localized price) by matching the
  // entitlement's product id against the offering packages.
  const plan = (() => {
    if (!isSubscribed || !activeProductId) return null;
    const pkgs = (offering && offering.availablePackages) || [];
    const pkg = pkgs.find(p => p?.product?.identifier === activeProductId);
    let type = null;
    let priceString = null;
    if (pkg) {
      priceString = pkg.product?.priceString || null;
      type = pkg.packageType === 'ANNUAL' ? 'annual'
        : pkg.packageType === 'MONTHLY' ? 'monthly'
        : /(annual|year)/i.test(pkg.identifier || '') ? 'annual'
        : /month/i.test(pkg.identifier || '') ? 'monthly' : null;
    }
    if (!type) {
      type = /(annual|year)/i.test(activeProductId) ? 'annual'
        : /month/i.test(activeProductId) ? 'monthly' : null;
    }
    return { type, priceString, productId: activeProductId };
  })();

  return { isSubscribed, plan, offering, ready, busy, purchase, restore, refresh, available: RC.rcAvailable() };
}
