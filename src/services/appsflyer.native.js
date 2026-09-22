import { Capacitor } from '@capacitor/core';

// AppsFlyer install attribution (iOS + Android). Tells us which ad network — Meta, Reddit,
// organic — each install came from, and forwards the funnel events to those networks
// through AppsFlyer's partner integrations. No-op on web and when no dev key is set.
//
// SDK 7 is manual-start: init() → wait for the session-ready callback → start(). On iOS the
// ATT prompt must already be answered before start() so the IDFA can be read; the caller
// (initNativeTracking) only calls startAppsFlyer() after that prompt resolves.
const DEV_KEY = import.meta.env.VITE_APPSFLYER_DEV_KEY || '';
const IOS_APP_ID = import.meta.env.VITE_APPSFLYER_IOS_APP_ID || '';

const isNative = () => Capacitor?.isNativePlatform?.() || false;

let sdk = null;         // resolved AppsFlyer instance once started
let starting = null;    // start promise (dedupes concurrent callers)
let pendingUserId;      // customer id set before start
const queue = [];       // events logged before start

async function load() {
  const mod = await import('appsflyer-capacitor-plugin');
  return mod.AppsFlyer || mod.default;
}

export function startAppsFlyer() {
  if (!isNative() || !DEV_KEY) return Promise.resolve();
  if (starting) return starting;
  starting = (async () => {
    try {
      const af = await load();
      await af.init({ devKey: DEV_KEY, ...(Capacitor.getPlatform() === 'ios' ? { appId: IOS_APP_ID } : {}) });
      if (import.meta.env.DEV) await af.enableDebug({ enabled: true });
      await new Promise((resolve) => {
        let done = false;
        const go = async () => {
          if (done) return;
          done = true;
          try {
            if (pendingUserId) await af.setCustomerUserId({ customerId: pendingUserId });
            await af.start();
          } catch (e) { console.warn('[appsflyer] start', e?.message || e); }
          resolve();
        };
        af.registerSessionReadyListener(go);
        // Guard against a missed callback (e.g. the session was already ready).
        af.isSessionReady().then((ready) => { if (ready) go(); }).catch(() => {});
      });
      sdk = af;
      console.log('[appsflyer] started');
      while (queue.length) {
        const { eventName, eventValues } = queue.shift();
        af.logEvent({ eventName, eventValues }).catch(() => {});
      }
    } catch (e) {
      console.warn('[appsflyer] init', e?.message || e);
    }
  })();
  return starting;
}

// Same Supabase id as Firebase and RevenueCat, so the three can be joined.
export function setAppsFlyerUser(userId) {
  if (!isNative() || !DEV_KEY || !userId) return;
  pendingUserId = String(userId);
  if (sdk) sdk.setCustomerUserId({ customerId: pendingUserId }).catch(() => {});
}

export function logAppsFlyerEvent(eventName, eventValues) {
  if (!isNative() || !DEV_KEY || !eventName) return;
  if (!sdk) { if (queue.length < 50) queue.push({ eventName, eventValues }); return; }
  sdk.logEvent({ eventName, eventValues: eventValues || {} }).catch(() => {});
}
