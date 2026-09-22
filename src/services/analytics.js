import { Capacitor } from '@capacitor/core';
import { trackWeb, trackWebPixel, trackWebReddit, trackWebScreen, setWebUser, setWebUserProperties } from './analytics.web.js';
import { logAppsFlyerEvent, setAppsFlyerUser } from './appsflyer.native.js';
import { logNativeEvent, logNativeScreen, setNativeAnalyticsUser, setNativeUserProperties } from './analytics.native.js';

// One tracking API for the whole app. Native → Firebase Analytics, web → GA4 (gtag).
// Both land in the same GA4 property, so every event must be named identically on
// every platform — call these helpers, never gtag/FirebaseAnalytics directly.
//
// Event catalogue (keep in sync with the GA4 key events):
//   funnel      sign_up, login, email_verified, tutorial_complete, sign_up_prompt_view,
//               premium_gate_view, paywall_view, begin_checkout, start_trial, purchase,
//               checkout_cancelled, restore_purchases
//   engagement  mission_complete, text_copied, text_sent, activity_done, date_idea_done,
//               content_shuffle, she_said_saved, cycle_start_set, guide_day_complete,
//               ai_text_generated, ai_activity_generated
// Subscription renewals/cancellations come server-side from RevenueCat (rc_* events).
// The funnel events are also mirrored to the ad networks (see mirrorToAdNetworks):
// AppsFlyer on iOS/Android, the Reddit Pixel on web.

const isNative = () => Capacitor?.isNativePlatform?.() || false;

// Firebase limits: event/param names ≤ 40 chars, string values ≤ 100 chars.
function clean(params) {
  const out = {};
  for (const [k, v] of Object.entries(params || {})) {
    if (v === undefined || v === null || v === '') continue;
    out[k.slice(0, 40)] = typeof v === 'string' ? v.slice(0, 100) : v;
  }
  return out;
}

export function track(name, params) {
  if (!name) return;
  const p = clean(params);
  if (isNative()) logNativeEvent(name, p);
  else trackWeb(name, p);
  mirrorToAdNetworks(name, p);
}

// AppsFlyer passes these on to Meta/Reddit through its partner integrations, so only the
// events an ad network can optimise for are sent — engagement stays in GA4. Trials carry
// no revenue: the free month bills nothing, and the paid conversion arrives server-side.
function mirrorToAdNetworks(name, p) {
  const native = isNative();
  const af = (event, values) => native && logAppsFlyerEvent(event, clean(values));
  const reddit = (event, values) => !native && trackWebReddit(event, clean(values));
  const money = { currency: p.currency || 'USD', value: p.value, itemCount: 1 };
  switch (name) {
    case 'sign_up':
      af('af_complete_registration', { af_registration_method: p.method });
      reddit('SignUp');
      break;
    case 'login':
      af('af_login');
      break;
    case 'tutorial_complete':
      af('af_tutorial_completion', { af_success: true });
      break;
    case 'paywall_view':
      af('af_content_view', { af_content_type: 'paywall', af_content_id: p.trigger });
      reddit('ViewContent');
      break;
    case 'begin_checkout':
      af('af_initiated_checkout', { af_price: p.value, af_currency: money.currency, af_content_id: p.product_id });
      reddit('AddToCart', money);
      break;
    case 'start_trial':
      af('af_start_trial', { af_currency: money.currency, af_content_id: p.product_id });
      reddit('Lead');
      break;
    case 'purchase':
      af('af_subscribe', { af_revenue: p.value, af_currency: money.currency, af_content_id: p.product_id });
      reddit('Purchase', money);
      break;
    default:
  }
}

// Meta Pixel on web only; native Meta events come from the SDK / RevenueCat.
export function trackPixel(name, params, standard = true) {
  if (!isNative()) trackWebPixel(name, clean(params), standard);
}

// Internal tab ids predate the current labels ('home' is Activities, 'coach' is the Guide).
const SCREEN_NAMES = { home: 'activities', coach: 'guide', reminders: 'remind' };
export const screenName = (tab) => SCREEN_NAMES[tab] || tab;

let lastScreen = null;
export function trackScreen(screen) {
  if (!screen || screen === lastScreen) return;
  lastScreen = screen;
  if (isNative()) logNativeScreen(screen);
  else trackWebScreen(screen);
}

export function identify(userId) {
  if (isNative()) { setNativeAnalyticsUser(userId || null); setAppsFlyerUser(userId); }
  else setWebUser(userId || null);
}

export function setUserProps(props) {
  const p = {};
  for (const [k, v] of Object.entries(props || {})) p[k.slice(0, 24)] = v == null ? null : String(v).slice(0, 36);
  if (isNative()) setNativeUserProperties(p);
  else setWebUserProperties(p);
}

// ── Upsell attribution ────────────────────────────────────────────────────────
// A locked feature records what was tapped just before it opens the sign-up or the
// paywall, so paywall_view / sign_up_prompt_view can say which feature sold it.
let trigger = null;
let triggerAt = 0;
export function setUpsellTrigger(feature) {
  if (!feature) return;
  trigger = normaliseFeature(feature);
  triggerAt = Date.now();
}
export function takeUpsellTrigger() {
  const t = trigger && Date.now() - triggerAt < 15000 ? trigger : 'other';
  trigger = null;
  return t;
}

// Gate titles carry live counts ("5 moves that work — 3 that backfire"); strip them so
// the same gate reports under one name.
export function normaliseFeature(s) {
  return String(s || '').replace(/\d+/g, '#').replace(/\s+/g, ' ').trim().toLowerCase().slice(0, 100);
}

const seenGates = new Set();
export function trackGateView(feature, gateType) {
  const f = normaliseFeature(feature);
  if (!f || seenGates.has(f)) return; // once per feature per session
  seenGates.add(f);
  track('premium_gate_view', { feature: f, gate_type: gateType });
}

// ── Sign-in attribution ───────────────────────────────────────────────────────
// Social sign-in on web redirects away, so the chosen provider is parked in
// sessionStorage and read back when the session lands.
export function rememberAuthMethod(method) {
  try {
    if (method) sessionStorage.setItem('op_auth_method', method);
    else sessionStorage.removeItem('op_auth_method');
  } catch { /* ignore */ }
}

const MIN = 60 * 1000;
// Called whenever a Supabase user becomes available (launch restore, sign-in, OAuth return).
// Fires sign_up / login / email_verified once per actual sign-in: the marker is the user's
// last_sign_in_at, and sessions restored long after the sign-in are ignored.
export function trackAuthSession(user) {
  if (!user?.id || !user.last_sign_in_at) return;
  const signedInAt = new Date(user.last_sign_in_at).getTime();
  if (!signedInAt || Date.now() - signedInAt > 10 * MIN) return;
  const marker = `${user.id}|${user.last_sign_in_at}`;
  try {
    if (localStorage.getItem('op_auth_marker') === marker) return;
    localStorage.setItem('op_auth_marker', marker);
  } catch { /* ignore */ }

  let method = user.app_metadata?.provider || 'email';
  try {
    const parked = sessionStorage.getItem('op_auth_method');
    if (parked) { method = parked; sessionStorage.removeItem('op_auth_method'); }
  } catch { /* ignore */ }

  const createdAt = new Date(user.created_at).getTime();
  const confirmedAt = user.email_confirmed_at ? new Date(user.email_confirmed_at).getTime() : 0;
  setUserProps({ sign_in_method: method });

  if (method !== 'email' && Math.abs(signedInAt - createdAt) < 2 * MIN) {
    track('sign_up', { method });
    trackPixel('CompleteRegistration', { status: 'social', content_name: method });
  } else if (method === 'email' && confirmedAt && Math.abs(signedInAt - confirmedAt) < 2 * MIN
    && signedInAt - createdAt < 7 * 24 * 60 * MIN) {
    // First sign-in is the verification link itself; sign_up was already sent at signup.
    track('email_verified', { method });
  } else {
    track('login', { method });
  }
}
