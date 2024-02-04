const assets = [
    "/",
    "/index.html",
    "/style.css",
    "/skeli.css",
    "/scripts/refrence.js",
    "/scripts/additional.js",
    "/scripts/script.js",
    "/classes/3/B/odd.json",
]

self.addEventListener("install", installEvent => {
    installEvent.waitUntil(caches.open("v1").then(cache => { cache.addAll(assets) }))
})

self.addEventListener("fetch", fetchEvent => {
    console.log(fetchEvent);
    fetchEvent.respondWith(
        caches.match(fetchEvent.request).then(res => {
            return res || fetch(fetchEvent.request)
        })
    )
})