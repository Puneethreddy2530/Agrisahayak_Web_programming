// AgriSahayak Service Worker — network-first with cache fallback
// Handles static shell caching and serves stale assets when offline.
// API JSON responses are cached separately in IndexedDB by client.js.

const CACHE_NAME = 'agrisahayak-shell-v1'

// Static shell routes to pre-cache on install
const SHELL_URLS = ['/']

// ── Install ─────────────────────────────────────────────────────────────────
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(SHELL_URLS).catch(() => {}))
      .then(() => self.skipWaiting())
  )
})

// ── Activate ─────────────────────────────────────────────────────────────────
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) =>
        Promise.all(
          keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))
        )
      )
      .then(() => self.clients.claim())
  )
})

// ── Fetch — network-first ────────────────────────────────────────────────────
self.addEventListener('fetch', (e) => {
  const { request } = e

  // Only intercept GET requests from the same origin
  if (request.method !== 'GET') return
  if (!request.url.startsWith(self.location.origin)) return

  const url = new URL(request.url)

  // Never cache auth / login endpoints (token rotation, sensitive data)
  if (url.pathname.startsWith('/api/v1/auth')) return

  // Never cache Vite HMR and dev-server internals
  if (url.pathname.startsWith('/@') || url.pathname.startsWith('/node_modules')) return

  e.respondWith(
    fetch(request)
      .then((response) => {
        // Cache successful responses (status 200-299) for static assets and
        // public API routes (schemes list, market prices, weather, etc.)
        if (response.ok) {
          const clone = response.clone()
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone))
        }
        return response
      })
      .catch(async () => {
        // Network failed — serve from cache if available
        const cached = await caches.match(request)
        if (cached) return cached

        // For navigation requests return the cached shell
        if (request.mode === 'navigate') {
          const shell = await caches.match('/')
          if (shell) return shell
        }

        // Last-resort empty 503 so axios/fetch still gets a Response object
        return new Response(
          JSON.stringify({ error: 'offline', message: 'You are offline' }),
          {
            status: 503,
            headers: { 'Content-Type': 'application/json' },
          }
        )
      })
  )
})
