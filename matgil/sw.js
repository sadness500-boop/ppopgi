/* 팔도 제철맛길 — 오프라인 저장(웹 설치용). 화면 파일을 저장해 두고, 새 버전이 있으면 다음 실행 때 바꿉니다. */
const CACHE = "jecheol-matgil-v2.9.1";
const FILES = ["./", "./index.html", "./app.js", "./lib/three.min.js", "./lib/qrcode.js", "./fonts/great-vibes.woff2", "./fonts/parisienne.woff2", "./manifest.webmanifest", "./icons/icon-192.png", "./icons/icon-512.png", "./icons/apple-touch-icon.png"];
self.addEventListener("install", e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting())); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", e => {
  const u = new URL(e.request.url);
  if (e.request.method !== "GET" || u.origin !== location.origin) return; // 지도 검색·외부 자료는 그대로
  e.respondWith(caches.match(e.request).then(hit => {
    const net = fetch(e.request).then(r => { if (r.ok) caches.open(CACHE).then(c => c.put(e.request, r.clone())); return r; }).catch(() => hit);
    return hit || net;
  }));
});
