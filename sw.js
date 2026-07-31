const CACHE_NAME = 'iqra-v1.3-final-certificate-v4';
const CORE = [
  './', './index.html', './manifest.json', './icon.svg', './icon-192.png', './icon-512.png', './certificate-template.jpg', './certificate-qr.png',
  ...Array.from({length: 28}, (_, i) => `./${String(i + 1).padStart(2, '0')}.mp3`)
];
self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(CORE)));
});
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    fetch(event.request).then(response => {
      const copy = response.clone();
      caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
      return response;
    }).catch(() => caches.match(event.request).then(r => r || caches.match('./index.html')))
  );
});
