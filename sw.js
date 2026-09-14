const CACHE_NAME = "omepikya-v6";

const APP_ASSETS = [
  "/",
  "/index.html",
  "/styles.css",
  "/phase2.css",
  "/script.js",
  "/manifest.json",
  "/assets/omepikya-icon.svg"
];

/* =========================================================
   INSTALL
========================================================= */
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(APP_ASSETS))
  );

  self.skipWaiting();
});

/* =========================================================
   ACTIVATE
========================================================= */
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys()
      .then(cacheNames =>
        Promise.all(
          cacheNames
            .filter(name => name !== CACHE_NAME)
            .map(name => caches.delete(name))
        )
      )
      .then(() => self.clients.claim())
  );
});

/* =========================================================
   FETCH
========================================================= */
self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;

  const requestUrl = new URL(event.request.url);

  if (requestUrl.origin !== self.location.origin) return;

  /* HTML navigation: network first, cached fallback. */
  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          if (response && response.ok) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then(cache => {
              cache.put("/index.html", responseClone);
            });
          }
          return response;
        })
        .catch(() => caches.match("/index.html"))
    );
    return;
  }

  /* CSS / JS / manifest: network first so deployments are not
     trapped behind stale cached application code. */
  const isAppAsset =
    requestUrl.pathname.endsWith(".css") ||
    requestUrl.pathname.endsWith(".js") ||
    requestUrl.pathname.endsWith(".json");

  if (isAppAsset) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          if (response && response.ok) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, responseClone);
            });
          }
          return response;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  /* Images, fonts and other static assets: cache first with network
     fallback, then cache successful network responses. */
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      if (cachedResponse) return cachedResponse;

      return fetch(event.request).then(response => {
        if (response && response.ok) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseClone);
          });
        }
        return response;
      });
    })
  );
});
