/// <reference lib="webworker" />
declare let self: ServiceWorkerGlobalScope;

import { registerRoute } from 'workbox-routing';
import { CacheFirst, NetworkFirst } from 'workbox-strategies';
import { ExpirationPlugin } from 'workbox-expiration';

// Precache static assets
// precacheAndRoute(self.__WB_MANIFEST);

// Cache UN/LOCODE API responses
registerRoute(
  ({ url }) => url.pathname.includes('/trade/locode'),
  new NetworkFirst({
    cacheName: 'unlocode-cache',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 24 * 60 * 60, // 24 hours
      }),
    ],
  })
);

// Cache map tiles
registerRoute(
  ({ url }) => url.hostname.includes('mapbox.com'),
  new CacheFirst({
    cacheName: 'mapbox-cache',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 100,
        maxAgeSeconds: 7 * 24 * 60 * 60, // 7 days
      }),
    ],
  })
); 