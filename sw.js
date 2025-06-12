self.addEventListener('install', e => {
  console.log('[ServiceWorker] Installed');
});

self.addEventListener('activate', e => {
  console.log('[ServiceWorker] Activated');
});

self.addEventListener('fetch', e => {
  // No caching for now
});
