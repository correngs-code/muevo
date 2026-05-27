// Muevo Service Worker — versioned cache + offline shell
// Bump CACHE_VERSION to invalidate old caches on deploy.
const CACHE_VERSION = 'v1';
const STATIC_CACHE = `muevo-static-${CACHE_VERSION}`;
const RUNTIME_CACHE = `muevo-runtime-${CACHE_VERSION}`;

// Resolve URLs relative to the SW location so it works regardless of base path
// (root on Vercel, /muevo/ on GitHub Pages).
const BASE = new URL('.', self.location).pathname;
const PRECACHE = [
  BASE,
  `${BASE}index.html`,
  `${BASE}manifest.webmanifest`,
  `${BASE}icon-192.png`,
  `${BASE}icon-512.png`,
  `${BASE}apple-touch-icon.png`,
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) =>
      // Use addAll-with-Request to avoid one missing file failing the whole install
      Promise.allSettled(PRECACHE.map((url) => cache.add(url)))
    ).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((k) => k.startsWith('muevo-') && k !== STATIC_CACHE && k !== RUNTIME_CACHE)
          .map((k) => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

// Don't intercept non-GET, cross-origin POSTs to Supabase, or Chrome extensions
function shouldHandle(request) {
  if (request.method !== 'GET') return false;
  const url = new URL(request.url);
  if (url.protocol !== 'http:' && url.protocol !== 'https:') return false;
  if (url.origin !== self.location.origin && !url.hostname.includes('googleapis.com')) {
    // Allow same-origin + Google Fonts; skip Supabase API (handled by app)
    return false;
  }
  return true;
}

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (!shouldHandle(request)) return;

  const url = new URL(request.url);

  // Navigation requests → network-first, fallback to cached shell
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((res) => {
          const copy = res.clone();
          caches.open(RUNTIME_CACHE).then((c) => c.put(request, copy));
          return res;
        })
        .catch(() => caches.match(`${BASE}index.html`).then((r) => r || caches.match(BASE)))
    );
    return;
  }

  // Hashed asset bundles (Vite) → cache-first (immutable)
  if (url.pathname.includes('/assets/') && /-[A-Za-z0-9_-]{6,}\.(js|css|woff2?)$/.test(url.pathname)) {
    event.respondWith(
      caches.match(request).then((cached) =>
        cached || fetch(request).then((res) => {
          if (res.ok) {
            const copy = res.clone();
            caches.open(STATIC_CACHE).then((c) => c.put(request, copy));
          }
          return res;
        })
      )
    );
    return;
  }

  // Everything else → stale-while-revalidate
  event.respondWith(
    caches.match(request).then((cached) => {
      const fetchPromise = fetch(request).then((res) => {
        if (res.ok) {
          const copy = res.clone();
          caches.open(RUNTIME_CACHE).then((c) => c.put(request, copy));
        }
        return res;
      }).catch(() => cached);
      return cached || fetchPromise;
    })
  );
});

// Allow page to trigger immediate activation after update
self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING') self.skipWaiting();
});
