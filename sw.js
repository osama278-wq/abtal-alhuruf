/* أبطال الحروف — offline support. Network first (always the newest version when online),
   cached copy when offline. Requests to other sites (the Google Sheet record) are never cached. */
var CACHE = 'abtal-alhuruf-2026-11-02-3';
var FILES = ["./", "index.html", "config.js", "favicon.ico", "manifest.webmanifest", "icons/icon.svg", "icons/icon-192.png", "icons/icon-512.png", "letters/alif.html", "letters/ayn.html", "letters/baa.html", "letters/daad.html", "letters/daal.html", "letters/dhaal.html", "letters/faa.html", "letters/ghayn.html", "letters/haa.html", "letters/heh.html", "letters/jeem.html", "letters/kaaf.html", "letters/khaa.html", "letters/laam.html", "letters/meem.html", "letters/noon.html", "letters/qaaf.html", "letters/raa.html", "letters/saad.html", "letters/seen.html", "letters/sheen.html", "letters/taa.html", "letters/thaa.html", "letters/ttaa.html", "letters/waw.html", "letters/yaa.html", "letters/zaay.html", "letters/zhaa.html"];
self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(FILES); }).then(function () { return self.skipWaiting(); }));
});
self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});
self.addEventListener('fetch', function (e) {
  var req = e.request, url = new URL(req.url);
  if (req.method !== 'GET' || url.origin !== self.location.origin) return;
  e.respondWith(fetch(req).then(function (res) {
    if (res && res.ok) { var copy = res.clone(); caches.open(CACHE).then(function (c) { c.put(req, copy); }); }
    return res;
  }).catch(function () {
    return caches.match(req, { ignoreSearch: true }).then(function (r) { return r || caches.match('index.html'); });
  }));
});
