const APP_PREFIX = 'BudgetTracker-';     
const VERSION = 'version_01';
const CACHE_NAME = APP_PREFIX + VERSION;

const FILES_TO_CACHE = [
    "./index.html",
    "./css/styles.css",
    "./js/index.js",
    "./js/idb.js",
    "../routes/api.js"
];

// install every file in FILES_TO_CACHE array
self.addEventListener('install', function (e) {
    e.waitUntil(
        caches.open(CACHE_NAME).then(function (cache) {
            console.log('installing cache : ' + CACHE_NAME)
            return cache.addAll(FILES_TO_CACHE)
        })
    )
})

// clear out old data and manage cache
self.addEventListener('activate', function (e) {
    e.waitUntil(
        // .keys to return an array of all cache names, called keyList
        caches.keys().then(function (keyList) {
            // store caches that have the app prefix 
            let cacheKeeplist = keyList.filter(function (key) {
                return key.indexOf(APP_PREFIX);
            })

            // add current CACHE_NAME to cacheKeepList array
            cacheKeeplist.push(CACHE_NAME);
            
            // returns Promise that resolves once all old versions of cache are deleted
            return Promise.all(
                keyList.map(function(key, i) {
                    // item will return with a value of -1 if not found keyList, so delete it from the cache
                    if (cacheKeeplist.indexOf(key) === -1) {
                        console.log('deleting cache : ' + keyList[i]);
                        return caches.delete(keyList[i]);
                    }
                })
            );
        })
    );
});

// return information to the cache
self.addEventListener('fetch', function (e) {
    console.log('fetch request : ' + e.request.url)
    e.respondWith(
        caches.match(e.request).then(function (request) {
            if (request) { // if cache is available, respond with cache
                console.log('responding with cache : ' + e.request.url)
                return request
            } else {       // if there are no cache, try fetching request
                console.log('file is not cached, fetching : ' + e.request.url)
                return fetch(e.request)
            }
        })
    )
})