// This is the service worker code that lives at the root (sw.js)

// You have to supply a name for your cache, this will
// allow us to remove an old one to avoid hitting disk
// space limits and displaying old resources
var cacheName = 'v2';

// Assets to cache
var assetsToCache = [
    './',
    './manifest.json',
    './index.html',
    './dist/css/style.css',
    './dist/images/icons/icon-168.png',
    './dist/js/jquery-1.11.1.min.js',
    './dist/js/jquery.mobile-1.4.5.min.js',
    './dist/js/entrydb.js',
    './src/themes/jquery.mobile-1.4.5.min.css',
    './src/themes/jquery.mobile.icons.min.css',
    './src/themes/balanced-body.min.css',

];
self.addEventListener('install', function(event) {
    console.log('[ServiceWorker] Installed');
    // waitUntil() ensures that the Service Worker will not
    // install until the code inside has successfully occurred
    event.waitUntil(
        caches.open(cacheName).then(function(cache) {
            console.log('[ServiceWorker] Caching assets');
            return cache.addAll(assetsToCache);
        })
    );
});

// Activate event
// Be sure to call self.clients.claim()
self.addEventListener('activate', function(event) {
    console.log('[ServiceWorker] Activated');
    event.waitUntil(
        caches.keys().then(function (cacheNames) {
            return Promise.all(cacheNames.map(function (thisCacheName) {
                if(thisCacheName !== cacheName){
                    console.log("[ServiceWorker] Removing Cached Files from", thisCacheName);
                    return caches.delete(thisCacheName);
                }
            }))
        })
    )
    // `claim()` sets this worker as the active worker for all clients that
    // match the workers scope and triggers an `oncontrollerchange` event for
    // the clients.
    // return self.clients.claim();
});

self.addEventListener('fetch', function(event) {
    console.log('[ServiceWorker] Fetch', event.request.url);
    // e.respondWidth Responds to the fetch event
    event.respondWith(
        // Check in cache for the request being made
        caches.match(event.request)
            .then(function(response) {
                // If the request is in the cache
                if ( response ) {
                    console.log("[ServiceWorker] Found in Cache", event.request.url, response);
                    // Return the cached version
                    return response;
                }
                // If the request is NOT in the cache, fetch and cache
                var requestClone = event.request.clone();
                return fetch(requestClone)
                    .then(function(response) {
                        if ( !response ) {
                            console.log("[ServiceWorker] No response from fetch ");
                            return response;
                        }
                        var responseClone = response.clone();
                        //  Open the cache
                        caches.open(cacheName).then(function(cache) {
                            // Put the fetched response in the cache
                            cache.put(event.request, responseClone);
                            console.log('[ServiceWorker] New Data Cached', event.request.url);
                            // Return the response
                            return response;
                        }); // end caches.open
                    })
                    .catch(function(err) {
                        console.log('[ServiceWorker] Error Fetching & Caching New Data', err);
                    });
            }) // end caches.match(e.request)
    ); // end e.respondWith

    /*
    // Ignore non-get request like when accessing the admin panel
    if (event.request.method !== 'GET') { return; }
    // Don't try to handle non-secure assets because fetch will fail
    if (/http:/.test(event.request.url)) { return; }

    // Here's where we cache all the things!
    event.respondWith(
        // Open the cache created when install
        caches.open(cacheName).then(function(cache) {
            // Go to the network to ask for that resource
            return fetch(event.request).then(function(networkResponse) {
                // Add a copy of the response to the cache (updating the old version)
                cache.put(event.request, networkResponse.clone());
                // Respond with it
                return networkResponse;
            }).catch(function() {
                // If there is no internet connection, try to match the request
                // to some of our cached resources
                return cache.match(event.request);
            })
        })
    );*/
});
