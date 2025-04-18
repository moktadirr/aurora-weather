// Service Worker for Aurora Weather Dashboard
const CACHE_NAME = "aurora-cache-v1"
const OFFLINE_URL = "/offline.html"

// Assets to cache immediately on install
const PRECACHE_ASSETS = ["/", "/offline.html", "/favicon.ico"]

// Install event - precache critical assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_ASSETS))
      .then(() => self.skipWaiting()),
  )
})

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((cacheName) => {
              return cacheName !== CACHE_NAME
            })
            .map((cacheName) => {
              return caches.delete(cacheName)
            }),
        )
      })
      .then(() => self.clients.claim()),
  )
})

// Fetch event - network-first strategy with fallback to cache
self.addEventListener("fetch", (event) => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return
  }

  // Skip non-GET requests
  if (event.request.method !== "GET") {
    return
  }

  // For API requests, use network-first strategy
  if (event.request.url.includes("/api/")) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Clone the response to store in cache
          const responseToCache = response.clone()

          caches.open(CACHE_NAME).then((cache) => {
            // Cache the successful response
            cache.put(event.request, responseToCache)
          })

          return response
        })
        .catch(() => {
          // If network fails, try to serve from cache
          return caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse) {
              return cachedResponse
            }

            // If not in cache, serve offline page for HTML requests
            if (event.request.headers.get("accept").includes("text/html")) {
              return caches.match(OFFLINE_URL)
            }

            // For other resources, just fail
            return new Response("Network error", {
              status: 408,
              headers: { "Content-Type": "text/plain" },
            })
          })
        }),
    )
    return
  }

  // For page navigations, use cache-first strategy
  if (event.request.mode === "navigate") {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        // Return cached response if available
        if (cachedResponse) {
          return cachedResponse
        }

        // Otherwise try network
        return fetch(event.request)
          .then((response) => {
            // Cache the network response
            const responseToCache = response.clone()
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache)
            })

            return response
          })
          .catch(() => {
            // If network fails, serve offline page
            return caches.match(OFFLINE_URL)
          })
      }),
    )
    return
  }

  // For other requests (assets, etc.), use stale-while-revalidate strategy
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Use cached response immediately if available
      const fetchPromise = fetch(event.request)
        .then((networkResponse) => {
          // Update cache with fresh response
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, networkResponse.clone())
          })

          return networkResponse
        })
        .catch(() => {
          // If network fails and we don't have a cached response,
          // there's not much we can do except fail
          if (!cachedResponse) {
            return new Response("Network error", {
              status: 408,
              headers: { "Content-Type": "text/plain" },
            })
          }
        })

      return cachedResponse || fetchPromise
    }),
  )
})
