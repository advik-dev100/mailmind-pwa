/* ============================================================
   MailMind Service Worker
   HOW TO BUST THE CACHE: change CACHE_VERSION below, then
   also change APP_VERSION in index.html to match.
   GitHub Pages will serve the new SW, which creates a new
   cache and deletes all old ones automatically.
============================================================ */
const CACHE_VERSION = 'mailmind-v4';

// Files to cache for offline use
const STATIC_ASSETS = [
  '/mailmind-pwa/',
  '/mailmind-pwa/index.html',
  '/mailmind-pwa/manifest.json',
  '/mailmind-pwa/icons/icon-192.png',
  '/mailmind-pwa/icons/icon-512.png'
];

/* ---- INSTALL: cache static shell ---- */
self.addEventListener('install', event => {
  console.log(`[SW ${CACHE_VERSION}] Installing…`);
  event.waitUntil(
    caches.open(CACHE_VERSION)
      .then(cache => cache.addAll(STATIC_ASSETS))
      .then(() => {
        console.log(`[SW ${CACHE_VERSION}] Static assets cached.`);
        // Take over immediately — don't wait for old SW to die
        return self.skipWaiting();
      })
  );
});

/* ---- ACTIVATE: delete all old caches ---- */
self.addEventListener('activate', event => {
  console.log(`[SW ${CACHE_VERSION}] Activating…`);
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_VERSION)
          .map(key => {
            console.log(`[SW] Deleting old cache: ${key}`);
            return caches.delete(key);
          })
      )
    ).then(() => {
      console.log(`[SW ${CACHE_VERSION}] Old caches cleared. Claiming clients.`);
      return self.clients.claim(); // Take over all open tabs immediately
    })
  );
});

/* ---- FETCH: Network-first for API calls, Cache-first for assets ---- */
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // Never intercept Google API calls or OAuth — always go to network
  if (
    url.hostname.includes('googleapis.com') ||
    url.hostname.includes('accounts.google.com') ||
    url.hostname.includes('fonts.google') ||
    event.request.method !== 'GET'
  ) {
    event.respondWith(fetch(event.request));
    return;
  }

  // For app shell files: cache-first, fall back to network
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;

      return fetch(event.request).then(response => {
        // Cache successful GET responses for app files
        if (response.ok) {
          const clone = response.clone();
          caches.open(CACHE_VERSION).then(cache => cache.put(event.request, clone));
        }
        return response;
      }).catch(() => {
        // Offline fallback: return cached index.html for navigation requests
        if (event.request.mode === 'navigate') {
          return caches.match('/mailmind-pwa/index.html');
        }
      });
    })
  );
});
