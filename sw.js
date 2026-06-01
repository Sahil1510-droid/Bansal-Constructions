const CACHE_NAME = 'construction-offline-v1';
const OFFLINE_URL = 'offline.html';

// 1. Install Service Worker and cache the offline page
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.add(new Request(OFFLINE_URL, { cache: 'reload' }));
        })
    );
    self.skipWaiting();
});

// 2. Activate Service Worker
self.addEventListener('activate', (event) => {
    event.waitUntil(self.clients.claim());
});

// 3. Intercept network requests
self.addEventListener('fetch', (event) => {
    // Only check navigate requests (actual page loads, not image assets)
    if (event.request.mode === 'navigate') {
        event.respondWith(
            fetch(event.request).catch(() => {
                // If the fetch fails (offline), return our cached page
                return caches.open(CACHE_NAME).then((cache) => {
                    return cache.match(OFFLINE_URL);
                });
            })
        );
    }
});

