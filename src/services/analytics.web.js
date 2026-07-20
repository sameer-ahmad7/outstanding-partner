import { Capacitor } from '@capacitor/core';

// Web-only analytics for the SPA at /app (GA4 + Meta Pixel). No-op inside the
// native app (native uses the Firebase + Meta SDKs, not the web Pixel) and on
// localhost/dev. IDs are public and safe in the client bundle.
const GA4_ID = 'G-9T0SC0L8C1';
const PIXEL_ID = '1110278981958912';

let started = false;

export function initWebAnalytics() {
  if (started) return;
  if (typeof window === 'undefined') return;
  if (Capacitor?.isNativePlatform?.()) return;
  const host = window.location.hostname;
  if (!host || host === 'localhost' || host === '127.0.0.1' || /\.local$/.test(host)) return;
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
  gtag('config', GA4_ID);

  // Meta Pixel
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
