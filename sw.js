const CACHE_URL = 'my-test-cache-v1'

self.addEventListener('install', event => {
  console.log('trigger install event')
  event.waitUntil(
    caches.open(CACHE_URL).then(cache => {
      return cache.addAll([
        '/',
        '/index.html',
        '/assets/index.css',
        '/assets/test.js'
      ])
    })
  )
})

self.addEventListener('message', function(event) {
  const request = new Request('/assets/clone-test.js')
  caches.match(request).then(function(response) {
    if (!response) {
      fetch(request).then(response => {
        caches.open(CACHE_URL).then(cache => {
          return cache.put(request, response)
        })
      })
    }
  })
})

self.addEventListener('fetch', function(event) {
  console.log('trigger fetch event', event.request)
  event.respondWith(
    caches.match(event.request).then(function(response) {
      // Cache hit - return response
      if (response) {
        return response
      }

      // IMPORTANT:Clone the request. A request is a stream and
      // can only be consumed once. Since we are consuming this
      // once by cache and once by the browser for fetch, we need
      // to clone the response.
      var fetchRequest = event.request.clone()

      return fetch(fetchRequest).then(function(response) {
        // Check if we received a valid response
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response
        }

        // IMPORTANT:Clone the response. A response is a stream
        // and because we want the browser to consume the response
        // as well as the cache consuming the response, we need
        // to clone it so we have two streams.
        var responseToCache = response.clone()

        caches.open(CACHE_NAME).then(function(cache) {
          cache.put(event.request, responseToCache)
        })

        return response
      })
    })
  )
})
