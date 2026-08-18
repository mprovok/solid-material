/// <reference lib="WebWorker" />

import fontRoboto from '../../../packages/material/node_modules/@fontsource-variable/roboto-flex/files/roboto-flex-latin-wght-normal.woff2';
import manifest from '../manifest.json?url&no-inline';
import fontGoogle from '../node_modules/@fontsource/google-sans-flex/files/google-sans-flex-latin-400-normal.woff2';

declare const self: ServiceWorkerGlobalScope;

const SW_CACHE_NAME = 'v1';

const NO_HASH_FILES = ['/index.html', '/assets/favicon.svg'];

const PRECACHED_FILES = [...NO_HASH_FILES, manifest, fontRoboto, fontGoogle];

const isImmutable = (request: Request) => {
  const url = new URL(request.url);
  return !NO_HASH_FILES.includes(url.pathname);
};

const precache = async () => {
  const cache = await caches.open(SW_CACHE_NAME);
  return cache.addAll(PRECACHED_FILES);
};

const upgrade = async () => {
  const keys = await caches.keys();

  return Promise.all(
    keys.map(async name => {
      if (name !== SW_CACHE_NAME) {
        return caches.delete(name);
      }
      // oxlint-disable-next-line unicorn/no-useless-undefined
      return undefined;
    })
  );
};

const cacheFirst = async (request: Request) => {
  const cache = await caches.open(SW_CACHE_NAME);
  const response = await cache.match(request);

  if (response) {
    console.info('(cache) hit', request, response);
    return response;
  }

  console.warn('(cache) miss, fetching', request, response, await cache.keys());
  const result = await fetch(request);

  if (result.ok) {
    await cache.put(request, result.clone());
  }
  return result;
};

const staleWhileRevalidate = async (request: Request) => {
  const cache = await caches.open(SW_CACHE_NAME);

  console.info('(stale) fetching', request);

  // oxlint-disable-next-line promise/prefer-await-to-then
  const fetchPromise = fetch(request).then(async result => {
    if (result.ok) {
      await cache.put(request, result.clone());
    }
    return result;
  });

  return (await cache.match(request)) ?? (await fetchPromise);
};

self.addEventListener('install', (event: ExtendableEvent) => {
  void self.skipWaiting();
  event.waitUntil(precache());
});

self.addEventListener('activate', (event: ExtendableEvent) => {
  event.waitUntil(upgrade());
});

self.addEventListener('fetch', (event: FetchEvent) => {
  if (isImmutable(event.request)) {
    event.respondWith(cacheFirst(event.request));
  } else {
    event.respondWith(staleWhileRevalidate(event.request));
  }
});
