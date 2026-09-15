const CACHE_NAME = "omepikya-v9";

const APP_ASSETS = [
  "/",
  "/index.html",
  "/styles.css",
  "/phase2.css",
  "/script.js",
  "/manifest.json",
  "/assets/omepikya-icon.svg"
];

const GALLERY_LIGHTBOX_FIX = `

/* Omepikya gallery safety fix: controls stay hidden until activated. */
.app-gallery-lightbox[aria-hidden="true"] {
  display: none !important;
}
`;

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(APP_ASSETS))
  );
  self.skipWaiting();
});

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

self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;

  const requestUrl = new URL(event.request.url);
  if (requestUrl.origin !== self.location.origin) return;

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

  const isAppAsset =
    requestUrl.pathname.endsWith(".css") ||
    requestUrl.pathname.endsWith(".js") ||
    requestUrl.pathname.endsWith(".json");

  if (isAppAsset) {
    event.respondWith(
      fetch(event.request)
        .then(async response => {
          if (!response || !response.ok) return response;

          let responseToServe = response;

          if (requestUrl.pathname === "/phase2.css") {
            const css = await response.text();
            responseToServe = new Response(css + GALLERY_LIGHTBOX_FIX, {
              status: response.status,
              statusText: response.statusText,
              headers: response.headers
            });
          }

          const responseClone = responseToServe.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseClone);
          });

          return responseToServe;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

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
