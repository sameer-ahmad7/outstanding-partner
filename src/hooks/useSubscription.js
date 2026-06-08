import { useState, useEffect, useCallback } from 'react';
import * as RC from '../services/revenuecat.service.js';

// Owns RevenueCat config + entitlement state. On web, stays inert (isSubscribed=false,
// no offering) so the app can fall back to the dev bypass for local testing.
export function useSubscription(userId) {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [offering, setOffering] = useState(null);
  const [ready, setReady] = useState(!RC.rcAvailable()); // web is "ready" immediately
  const [busy, setBusy] = useState(false);

  const refresh = useCallback(async () => {
    const info = await RC.getCustomerInfo();
    if (info) setIsSubscribed(RC.isPremiumInfo(info));
    const off = await RC.getCurrentOffering();
    if (off) setOffering(off);
  }, []);

  // Configure once on mount (native only).
  useEffect(() => {
    if (!RC.rcAvailable()) return;
    let mounted = true;
    (async () => {
      const ok = await RC.configureRC();
      if (!ok) { if (mounted) setReady(true); return; }
      await RC.addCustomerInfoListener((active) => { if (mounted) setIsSubscribed(active); });
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

  return { isSubscribed, offering, ready, busy, purchase, restore, refresh, available: RC.rcAvailable() };
}
