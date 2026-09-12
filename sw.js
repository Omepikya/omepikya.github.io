const CACHE_NAME = "omepikya-v4";

const APP_ASSETS = [
  "/",
  "/index.html",
  "/styles.css",
  "/script.js",
  "/manifest.json"
];


/* =========================================================
   INSTALL
========================================================= */

self.addEventListener(
  "install",
  event => {

    event.waitUntil(

      caches
        .open(CACHE_NAME)
        .then(cache => {

          return cache.addAll(
            APP_ASSETS
          );

        })

    );

    self.skipWaiting();

  }
);



/* =========================================================
   ACTIVATE
========================================================= */

self.addEventListener(
  "activate",
  event => {

    event.waitUntil(

      caches
        .keys()
        .then(cacheNames => {

          return Promise.all(

            cacheNames
              .filter(
                name =>
                  name !== CACHE_NAME
              )
              .map(
                name =>
                  caches.delete(name)
              )

          );

        })
        .then(() =>
          self.clients.claim()
        )

    );

  }
);



/* =========================================================
   FETCH
========================================================= */

self.addEventListener(
  "fetch",
  event => {


    /*
     * Only handle GET requests.
     */

    if (
      event.request.method !== "GET"
    ) {
      return;
    }



    /*
     * Navigation requests:
     * Network first.
     */

    if (
      event.request.mode === "navigate"
    ) {

      event.respondWith(

        fetch(event.request)
          .then(response => {


            if (
              response &&
              response.ok
            ) {

              const responseClone =
                response.clone();


              caches
                .open(CACHE_NAME)
                .then(cache => {

                  cache.put(
                    "/index.html",
                    responseClone
                  );

                });

            }


            return response;

          })


          .catch(() => {

            return caches.match(
              "/index.html"
            );

          })

      );


      return;
    }



    /*
     * Static assets:
     * Cache first,
     * network fallback.
     */

    event.respondWith(

      caches
        .match(event.request)
        .then(
          cachedResponse => {


            if (cachedResponse) {
              return cachedResponse;
            }


            return fetch(event.request)
              .then(response => {


                if (
                  response &&
                  response.ok &&
                  new URL(
                    event.request.url
                  ).origin ===
                  self.location.origin
                ) {

                  const responseClone =
                    response.clone();


                  caches
                    .open(CACHE_NAME)
                    .then(cache => {

                      cache.put(
                        event.request,
                        responseClone
                      );

                    });

                }


                return response;

              });

          }
        )

    );

  }
);