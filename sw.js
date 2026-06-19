/* 서비스워커: 오프라인 캐싱 (앱 쉘) */
var CACHE = "tokyo-trip-v26";
var ASSETS = [
  "./",
  "./index.html",
  "./styles.css",
  "./data.js",
  "./app.js",
  "./firebase-config.js",
  "./manifest.webmanifest",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/apple-touch-icon.png",
  "./icons/favicon-32.png",
  "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css",
  "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js",
  "https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js",
  "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth-compat.js",
  "https://www.gstatic.com/firebasejs/10.12.2/firebase-database-compat.js"
];

self.addEventListener("install", function (e) {
  e.waitUntil(
    caches.open(CACHE).then(function (c) {
      return Promise.all(ASSETS.map(function (u) {
        return c.add(u).catch(function () {}); // 일부 실패해도 설치 진행
      }));
    }).then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener("activate", function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.map(function (k) { if (k !== CACHE) return caches.delete(k); }));
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener("fetch", function (e) {
  var req = e.request;
  if (req.method !== "GET") return; // DB 쓰기/웹소켓은 통과
  var url = new URL(req.url);
  // Firebase DB 실시간 트래픽은 캐싱하지 않고 네트워크로
  if (url.hostname.indexOf("firebaseio.com") !== -1 || url.hostname.indexOf("googleapis.com") !== -1) return;

  var sameOrigin = url.origin === self.location.origin;
  // 앱 코드/문서는 "네트워크 우선"(온라인이면 항상 최신) → 캐시 stale 방지
  var isShell = req.mode === "navigate" ||
    (sameOrigin && /\.(html|js|css|webmanifest)$/.test(url.pathname));

  if (isShell) {
    e.respondWith(
      fetch(req).then(function (res) {
        if (res && res.status === 200) { var copy = res.clone(); caches.open(CACHE).then(function (c) { c.put(req, copy); }); }
        return res;
      }).catch(function () {
        return caches.match(req).then(function (hit) { return hit || caches.match("./index.html"); });
      })
    );
    return;
  }

  // 이미지/폰트/CDN 라이브러리 등은 "캐시 우선"(빠르고 오프라인 OK)
  e.respondWith(
    caches.match(req).then(function (hit) {
      if (hit) return hit;
      return fetch(req).then(function (res) {
        if (res && res.status === 200 && sameOrigin) { var copy = res.clone(); caches.open(CACHE).then(function (c) { c.put(req, copy); }); }
        return res;
      }).catch(function () { return undefined; });
    })
  );
});
