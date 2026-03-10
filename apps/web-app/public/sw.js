const CACHE_VERSION = 'nova-v2';
const CORE_ASSETS = ['/library', '/manifest.json', '/icon-192.png', '/icon-512.png'];

self.addEventListener('install', (event) => {
  self.skipWaiting(); // 즉시 활성화
  event.waitUntil(
    caches.open(CACHE_VERSION).then((cache) => cache.addAll(CORE_ASSETS))
  );
});

self.addEventListener('activate', (event) => {
  // 구버전 캐시 강제 삭제 → 모바일에서 최신 코드 반영
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((key) => key !== CACHE_VERSION).map((key) => caches.delete(key))
      )
    ).then(() => clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  // html 요청은 항상 네트워크 우선 (최신 코드 반영)
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() =>
        caches.match('/library')
      )
    );
    return;
  }

  // 나머지 리소스는 캐시 우선
  event.respondWith(
    caches.match(event.request).then((cached) =>
      cached || fetch(event.request)
    )
  );
});
