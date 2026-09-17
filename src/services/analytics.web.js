import { Capacitor } from '@capacitor/core';

// Web-only analytics for the SPA at /app (GA4 + Meta Pixel). No-op inside the
// native app (native uses the Firebase + Meta SDKs, not the web Pixel) and on
// localhost/dev. IDs are public and safe in the client bundle.
//
// GA4_ID is the "Outstanding Web" stream of the Firebase-linked property
// (outstanding-partner-app, 546200204), so web, iOS and Android report together.
// Debugging: open any page with ?ga_debug=1 to turn on DebugView (and to allow
// localhost); ?ga_debug=0 turns it off again.
const GA4_ID = 'G-R68S6VW8R9';
const PIXEL_ID = '1110278981958912';

let started = false;

function debugFlag() {
  try {
    const q = new URLSearchParams(window.location.search).get('ga_debug');
    if (q === '1') localStorage.setItem('op_ga_debug', '1');
    if (q === '0') localStorage.removeItem('op_ga_debug');
    return localStorage.getItem('op_ga_debug') === '1';
  } catch { return false; }
}

export function initWebAnalytics() {
  if (started) return;
  if (typeof window === 'undefined') return;
  if (Capacitor?.isNativePlatform?.()) return;
  const debug = debugFlag();
  const host = window.location.hostname;
  const isDev = !host || host === 'localhost' || host === '127.0.0.1' || /\.local$/.test(host);
  if (isDev && !debug) return;
  started = true;

  // Google Analytics 4
  const g = document.createElement('script');
  g.async = true;
  g.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA4_ID;
  document.head.appendChild(g);
  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = gtag;
  gtag('js', new Date());
  // Tabs are reported as virtual page views by trackWebScreen, so skip the automatic one.
  gtag('config', GA4_ID, { send_page_view: false, ...(debug ? { debug_mode: true } : {}) });

  // Meta Pixel (production only — test traffic would pollute ad optimisation)
  if (isDev) return;
  !function (f, b, e, v, n, t, s) {
    if (f.fbq) return; n = f.fbq = function () { n.callMethod ?
      n.callMethod.apply(n, arguments) : n.queue.push(arguments); };
    if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0';
    n.queue = []; t = b.createElement(e); t.async = !0; t.src = v;
    s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s);
  }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
  window.fbq('init', PIXEL_ID);
  window.fbq('track', 'PageView');
}

// Fire a GA4 event (safe no-op if analytics didn't init, e.g. native/dev).
export function trackWeb(event, params) {
  try { if (window.gtag) window.gtag('event', event, params || {}); } catch { /* ignore */ }
}

// Fire a Meta Pixel event. standard=true → track (standard event); false → trackCustom.
export function trackWebPixel(event, params, standard = true) {
  try { if (window.fbq) window.fbq(standard ? 'track' : 'trackCustom', event, params || {}); } catch { /* ignore */ }
}

// The app's tabs aren't URLs, so each one is sent as a virtual page view under /app/.
export function trackWebScreen(screen) {
  try {
    if (!window.gtag || !screen) return;
    window.gtag('event', 'page_view', {
      page_title: screen,
      page_location: `${window.location.origin}/app/${screen}`,
    });
  } catch { /* ignore */ }
}

export function setWebUser(userId) {
  try { if (window.gtag) window.gtag('set', { user_id: userId || null }); } catch { /* ignore */ }
}

export function setWebUserProperties(props) {
  try { if (window.gtag) window.gtag('set', 'user_properties', props || {}); } catch { /* ignore */ }
}
