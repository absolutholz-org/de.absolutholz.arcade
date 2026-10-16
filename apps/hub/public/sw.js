// Root Service Worker for Arcade Monorepo
const CORE_CACHE_NAME = 'arcade-core-v1';
const GAME_CACHE_PREFIX = 'arcade-game-';
const SUPPORTED_LOCALES = ['en', 'de', 'fr', 'pt'];
const KNOWN_GAMES = ['sudoku', 'minesweeper', 'nonogram', 'queens', 'bridges', 'tracks'];

const CORE_ASSETS = [
	'/',
	'/site.webmanifest',
	'/favicon.svg',
	'/favicon.ico',
	'/favicon-96x96.png',
	'/apple-touch-icon.png',
	'/wood-grain.jpg',
	// Localized Hub entry points
	...SUPPORTED_LOCALES.map((lang) => `/${lang}/`),
	// Localized offline fallback routes
	...SUPPORTED_LOCALES.map((lang) => `/${lang}/offline`),
];

// Helper: Extract locale from path
function extractLocale(pathname) {
	const segments = pathname.split('/').filter(Boolean);
	for (const segment of segments) {
		if (SUPPORTED_LOCALES.includes(segment)) {
			return segment;
		}
	}
	return 'en';
}

// Helper: Extract game id from path
function extractGame(pathname) {
	const segments = pathname.split('/').filter(Boolean);
	if (segments.length > 0 && KNOWN_GAMES.includes(segments[0])) {
		return segments[0];
	}
	return null;
}

// Installation: Pre-cache core Hub shell and offline fallback
self.addEventListener('install', (event) => {
	self.skipWaiting();
	event.waitUntil(
		caches.open(CORE_CACHE_NAME).then((cache) => {
			return cache.addAll(CORE_ASSETS).catch((err) => {
				console.warn('[SW] Core precache partial failure:', err);
			});
		}),
	);
});

// Activation: Clean up old core caches and claim clients
self.addEventListener('activate', (event) => {
	event.waitUntil(
		Promise.all([
			self.clients.claim(),
			caches.keys().then((keys) => {
				return Promise.all(
					keys
						.filter((key) => key.startsWith('arcade-core-') && key !== CORE_CACHE_NAME)
						.map((key) => caches.delete(key)),
				);
			}),
		]),
	);
});

// Fetch: Stale-While-Revalidate & Offline Routing Interceptor
self.addEventListener('fetch', (event) => {
	const request = event.request;
	if (request.method !== 'GET') {
		return;
	}

	const url = new URL(request.url);

	// Only handle same-origin requests
	if (url.origin !== self.location.origin) {
		return;
	}

	// 1. Navigation requests (HTML pages)
	if (request.mode === 'navigate') {
		event.respondWith(
			fetch(request)
				.then((response) => {
					// Clone response to cache if belonging to an installed partition or core
					const pathname = url.pathname;
					const game = extractGame(pathname);
					if (!game) {
						// Hub route: update core cache silently in background
						const resClone = response.clone();
						caches.open(CORE_CACHE_NAME).then((cache) => {
							cache.put(request, resClone);
						});
					}
					return response;
				})
				.catch(async () => {
					// Network failed -> user is offline
					const pathname = url.pathname;
					const lang = extractLocale(pathname);
					const game = extractGame(pathname);

					if (game) {
						// Check if the game has an active cache partition
						const allCaches = await caches.keys();
						const gameCacheName = allCaches.find((c) => c.startsWith(`${GAME_CACHE_PREFIX}${game}-`));

						if (gameCacheName) {
							const gameCache = await caches.open(gameCacheName);
							const matched = await gameCache.match(request);
							if (matched) {
								return matched;
							}
							// Try matching index route for this game/lang
							const fallbackGameRoute = `/${game}/${lang}/`;
							const matchedFallback = await gameCache.match(fallbackGameRoute);
							if (matchedFallback) {
								return matchedFallback;
							}
						}

						// Game not installed or missing chunk: redirect to Offline Manager
						const offlineTarget = `/${lang}/offline?missing=${encodeURIComponent(game)}`;
						const coreCache = await caches.open(CORE_CACHE_NAME);
						const offlinePage =
							(await coreCache.match(`/${lang}/offline`)) || (await coreCache.match('/en/offline'));

						if (offlinePage) {
							return offlinePage;
						}
						return Response.redirect(offlineTarget, 302);
					}

					// Hub navigation offline fallback
					const coreCache = await caches.open(CORE_CACHE_NAME);
					const hubMatch =
						(await coreCache.match(request)) ||
						(await coreCache.match(`/${lang}/`)) ||
						(await coreCache.match('/en/'));

					if (hubMatch) {
						return hubMatch;
					}

					const offlinePage =
						(await coreCache.match(`/${lang}/offline`)) || (await coreCache.match('/en/offline'));
					return offlinePage || new Response('Offline', { status: 503 });
				}),
		);
		return;
	}

	// 2. Non-navigation requests (static assets, split chunks, CSS, images)
	event.respondWith(
		caches.match(request).then((cachedResponse) => {
			if (cachedResponse) {
				// SWR: serve cached immediately, silently revalidate in background
				fetch(request)
					.then((networkResponse) => {
						if (networkResponse && networkResponse.status === 200) {
							// Update whichever cache currently holds the asset
							caches.keys().then((cacheNames) => {
								for (const name of cacheNames) {
									caches.open(name).then((cache) => {
										cache.match(request).then((match) => {
											if (match) {
												cache.put(request, networkResponse);
											}
										});
									});
								}
							});
						}
					})
					.catch(() => {});
				return cachedResponse;
			}

			// Not in CacheStorage -> standard network fetch (relying on browser HTTP cache)
			return fetch(request);
		}),
	);
});

// Client Communication Message Bridge
self.addEventListener('message', (event) => {
	const data = event.data;
	if (!data || typeof data !== 'object') return;

	const { type, gameId, manifestUrl } = data;

	if (type === 'CACHE_GAME') {
		event.waitUntil(
			(async () => {
				try {
					const manifestRes = await fetch(manifestUrl);
					if (!manifestRes.ok) throw new Error(`Manifest fetch failed: ${manifestRes.status}`);
					const manifest = await manifestRes.json();

					const targetCacheName = `${GAME_CACHE_PREFIX}${gameId}-v${manifest.version || '1'}`;
					const gameCache = await caches.open(targetCacheName);

					const rawUrls = [...(manifest.routes || []), ...(manifest.assets || []).map((a) => a.url)];
					const urlsToCache = Array.from(new Set(rawUrls));

					let successCount = 0;
					let failCount = 0;

					await Promise.allSettled(
						urlsToCache.map(async (url) => {
							try {
								const response = await fetch(url);
								if (response.ok) {
									await gameCache.put(url, response);
									successCount += 1;
								} else {
									failCount += 1;
									console.warn(`[SW] Failed to cache ${url}: HTTP ${response.status}`);
								}
							} catch (err) {
								failCount += 1;
								console.warn(`[SW] Error fetching ${url} for cache:`, err);
							}
						}),
					);

					// Consider operation successful if at least one asset was cached
					const isSuccess = successCount > 0;

					if (isSuccess) {
						// Delete older cache versions of this game
						const allCaches = await caches.keys();
						const oldGameCaches = allCaches.filter(
							(c) => c.startsWith(`${GAME_CACHE_PREFIX}${gameId}-`) && c !== targetCacheName,
						);
						await Promise.all(oldGameCaches.map((c) => caches.delete(c)));
					}

					if (event.ports?.[0]) {
						event.ports[0].postMessage({
							success: isSuccess,
							gameId,
							cachedItems: successCount,
							failedItems: failCount,
						});
					}
				} catch (err) {
					if (event.ports?.[0]) {
						event.ports[0].postMessage({
							success: false,
							gameId,
							error: err.message,
						});
					}
				}
			})(),
		);
	} else if (type === 'EVICT_GAME') {
		event.waitUntil(
			(async () => {
				try {
					const allCaches = await caches.keys();
					const gameCaches = allCaches.filter((c) => c.startsWith(`${GAME_CACHE_PREFIX}${gameId}-`));
					await Promise.all(gameCaches.map((c) => caches.delete(c)));

					if (event.ports?.[0]) {
						event.ports[0].postMessage({ success: true, gameId });
					}
				} catch (err) {
					if (event.ports?.[0]) {
						event.ports[0].postMessage({ success: false, gameId, error: err.message });
					}
				}
			})(),
		);
	} else if (type === 'GET_GAME_STATUS') {
		event.waitUntil(
			(async () => {
				const allCaches = await caches.keys();
				const installed = allCaches.some((c) => c.startsWith(`${GAME_CACHE_PREFIX}${gameId}-`));
				if (event.ports?.[0]) {
					event.ports[0].postMessage({ installed, gameId });
				}
			})(),
		);
	}
});
