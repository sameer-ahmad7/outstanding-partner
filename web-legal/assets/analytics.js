/* Outstanding Partner — shared web analytics for the marketing + legal pages.
 * Loads Google Analytics 4 (gtag) + Meta Pixel. IDs are public (safe in the client).
 * Skipped on localhost / previews so dev traffic doesn't pollute analytics. */
(function () {
  /* ?ga_debug=1 turns on GA4 DebugView (and allows localhost); ?ga_debug=0 turns it off. */
  var debug = false;
  try {
    var q = new URLSearchParams(location.search).get('ga_debug');
    if (q === '1') localStorage.setItem('op_ga_debug', '1');
    if (q === '0') localStorage.removeItem('op_ga_debug');
    debug = localStorage.getItem('op_ga_debug') === '1';
  } catch (e) {}
  var host = location.hostname;
  var isDev = !host || host === 'localhost' || host === '127.0.0.1' || /\.local$/.test(host);
  if (isDev && !debug) return;

  /* "Outstanding Web" stream of the Firebase-linked GA4 property (546200204). */
  var GA4_ID = 'G-R68S6VW8R9';
  var PIXEL_ID = '1110278981958912';

  /* --- Google Analytics 4 --- */
  var g = document.createElement('script');
  g.async = true;
  g.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA4_ID;
  document.head.appendChild(g);
  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = gtag;
  gtag('js', new Date());
  gtag('config', GA4_ID, debug ? { debug_mode: true } : {});

  /* --- Meta Pixel (production only) --- */
  if (!isDev) {
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

  /* --- "Download clicked" conversion (fired from the store badges) --- */
  window.opTrackDownload = function (store) {
    try { if (window.gtag) window.gtag('event', 'download_click', { store: store }); } catch (e) {}
    try { if (window.fbq) window.fbq('trackCustom', 'DownloadClick', { store: store }); } catch (e) {}
  };
  document.addEventListener('DOMContentLoaded', function () {
    var ios = document.querySelector('a.appstore');
    if (ios) ios.addEventListener('click', function () { window.opTrackDownload('ios'); });
    var and = document.querySelector('a.googleplay');
    if (and) and.addEventListener('click', function () { window.opTrackDownload('android'); });
  });
})();
