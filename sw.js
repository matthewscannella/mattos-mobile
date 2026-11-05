/* Lets MattOS open with no signal. Every request goes to the network first, so a new version always wins;
   the copy kept from the last successful load is used only when the network fails. Data comes from the GitHub API and is not kept here.
   Opening a page asks the server whether it changed, because GitHub Pages otherwise lets the phone reuse its copy for 10 minutes. */
const CACHE = "mattos-shell-v1";
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", e => e.waitUntil(self.clients.claim()));
self.addEventListener("fetch", e => {
  const host = new URL(e.request.url).hostname;
  if (e.request.method !== "GET" || (host !== location.hostname && !/^fonts\.(googleapis|gstatic)\.com$/.test(host))) return;
  e.respondWith((e.request.mode === "navigate" ? fetch(e.request.url, { cache: "no-cache" }) : fetch(e.request)).then(r => {
    if (r.ok || r.type === "opaque") { const copy = r.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); }
    return r;
  }).catch(() => caches.match(e.request)));
});
