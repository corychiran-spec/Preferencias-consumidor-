const VERSION='menu-v1';
const ARCHIVOS=['./','index.html','manifest.json','icon-192.png','icon-512.png','apple-touch-icon.png'];
self.addEventListener('install',e=>{
  e.waitUntil(caches.open(VERSION).then(c=>c.addAll(ARCHIVOS)));
  self.skipWaiting();
});
self.addEventListener('activate',e=>{
  e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==VERSION).map(k=>caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  // Primero la red (menú siempre actualizado); si no hay conexión, usa la copia guardada.
  e.respondWith(
    fetch(e.request).then(r=>{
      const copia=r.clone();
      caches.open(VERSION).then(c=>c.put(e.request,copia));
      return r;
    }).catch(()=>caches.match(e.request).then(r=>r||caches.match('index.html')))
  );
});
