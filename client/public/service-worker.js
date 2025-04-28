/*
  This is the default service worker file for Create React App PWA support.
  It will be automatically replaced by the build process with a generated service worker
  that precaches assets and enables offline support.
*/

// Placeholder: CRA will generate the actual service worker at build time.
self.addEventListener('install', function(event) {
  // Skip waiting to activate the new service worker immediately
  self.skipWaiting();
});

self.addEventListener('activate', function(event) {
  // Claim clients so that the service worker starts controlling all open pages
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', function(event) {
  // Default fetch handler: let the generated service worker handle caching
});
