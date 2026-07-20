/* Outstanding Partner — shared web analytics for the marketing + legal pages.
 * Loads Google Analytics 4 (gtag) + Meta Pixel. IDs are public (safe in the client).
 * Skipped on localhost / previews so dev traffic doesn't pollute analytics. */
(function () {
  var host = location.hostname;
  if (!host || host === 'localhost' || host === '127.0.0.1' || /\.local$/.test(host)) return;

  var GA4_ID = 'G-9T0SC0L8C1';
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
  gtag('config', GA4_ID);

  /* --- Meta Pixel --- */
  !function (f, b, e, v, n, t, s) {
    if (f.fbq) return; n = f.fbq = function () { n.callMethod ?
      n.callMethod.apply(n, arguments) : n.queue.push(arguments); };
    if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0';
    n.queue = []; t = b.createElement(e); t.async = !0; t.src = v;
    s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s);
  }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
  window.fbq('init', PIXEL_ID);
  window.fbq('track', 'PageView');

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
