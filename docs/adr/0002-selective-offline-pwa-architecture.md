# ADR 0002: Selective Offline Game Caching and PWA Architecture

## Status

Accepted

## Context

The Arcade ecosystem is organized as a monorepo consisting of an Astro SSG Hub deployed at the root domain (`/`) and multiple independent games built with React and Astro located at base-scoped sub-routes (e.g., `/[game]/[lang]/`).

While [ADR 004](file:///Users/swoo/Workspaces/de.absolutholz.arcade/docs/adr/architecture-decision-records.md#L28-L33) established a unified PWA baseline with a root-scoped Service Worker and runtime caching for downstream games, full offline gameplay across our growing catalog poses critical resource challenges:

1. **Storage Bloat:** Pre-caching all games, assets, audio files, and localizations indiscriminately during initial Hub visit would overwhelm limited client storage budgets on mobile devices.
2. **Selective Offline Availability:** Users want the ability to explicitly choose which games to make available offline (e.g., prior to travel or in low-connectivity situations) without impacting fast online page performance or caching unwanted games.
3. **Resilient Asset Fetching:** Standard `cache.addAll()` invocations are all-or-nothing (atomic). If a single non-critical chunk or media asset encounters a 404 or network hiccup, the entire game's offline cache operation fails.
4. **Navigation UX & Missing Games:** If an offline user attempts to navigate directly to a game route that has not been cached, the browser default network error page ("dinosaur screen") appears, breaking PWA immersion.
5. **State Synchronization:** Users expect offline progress and game saves to persist reliably offline, but also sync automatically across multiple open tabs and cloud profiles when back online.

## Decision

We adopt a selective, partitioned offline PWA architecture centered around granular game cache management, resilient build manifests, and decoupled persistence:

### 1. Root-Scoped Service Worker with Partitioned Cache Storage
A single root-scoped Service Worker ([`sw.js`](file:///Users/swoo/Workspaces/de.absolutholz.arcade/apps/hub/public/sw.js)) is registered at `/`. Cache Storage is partitioned into distinct semantic buckets:
- `arcade-core-v*`: Caches global shell assets, shared styling, base icons, and the offline fallback interface.
- `arcade-game-[id]-v*`: Dedicated per-game cache partitions (e.g., `arcade-game-sudoku-v1`), enabling isolated cache installation, verification, and zero-residue eviction when a user removes a game from offline storage.

### 2. Build-Time Asset Indexing via Vite Plugin & Resilient Caching
Each game generates a comprehensive list of its production assets during build time via a custom Vite plugin ([`vitePluginArcadeManifest`](file:///Users/swoo/Workspaces/de.absolutholz.arcade/libraries/astro-config/src/plugins/vitePluginArcadeManifest.ts)), emitted as `arcade-manifest.json` with base paths resolved.
- When an offline download is triggered, the Service Worker consumes this manifest.
- Rather than using atomic `cache.addAll()`, assets are cached via `Promise.allSettled()`, ensuring non-critical asset hiccups do not invalidate core game availability while logging failed assets for diagnostics.

### 3. Granular Caching Strategies (SWR vs. Online Pass-Through)
- **Stale-While-Revalidate (SWR):** Applied to active game partitions and core assets, serving immediate cached assets while background-revalidating whenever a network connection is available.
- **Online-Only Pass-Through:** If a game has not been marked or saved for offline play, network requests bypass game cache creation entirely, preventing unintended storage accumulation.

### 4. Locale-Aware Offline Navigation Interception
When navigation requests occur while offline:
- If the requested game path is cached in its partition, the Service Worker serves the cached application shell.
- If the game is not cached offline, the Service Worker intercepts navigation and redirects/rewrites to `/${lang}/offline?missing=${game}`. This provides a localized, user-friendly explanation with quick links back to the hub or to games currently available offline.

### 5. Dual-Mode Data Persistence
Data storage employs a dual-strategy conforming to [ADR 008](file:///Users/swoo/Workspaces/de.absolutholz.arcade/docs/adr/architecture-decision-records.md#L54-L60) and [ADR 012](file:///Users/swoo/Workspaces/de.absolutholz.arcade/docs/adr/architecture-decision-records.md#L78-L83):
- **Local / Offline:** An asynchronous IndexedDB driver ([`indexedDbDriver`](file:///Users/swoo/Workspaces/de.absolutholz.arcade/libraries/storage/src/drivers/indexedDbDriver.ts)) persists namespaced game state, settings, and high scores locally with zero network dependency.
- **Cloud / Multi-Tab Sync:** For authenticated sessions, Firestore with `persistentLocalCache` and multi-tab synchronization (`persistentMultipleTabManager`) ensures offline modifications are journaled locally and seamlessly reconciled upon reconnection.

### 6. Decoupled UI & Presentation Architecture
UI component libraries ([`@arcade/lib-ui`](file:///Users/swoo/Workspaces/de.absolutholz.arcade/libraries/ui)) remain pure, presentation-only, and accessible (WCAG 2.2 AA compliant).
- Presentation components (such as toggle controls and badges) receive state and callbacks via props.
- Service worker messaging, cache query hooks ([`useOfflineGame`](file:///Users/swoo/Workspaces/de.absolutholz.arcade/libraries/ui/src/hooks/useOfflineGame.ts)), and storage connectors reside in consumer application layers or dedicated bridge abstractions ([`offlineBridge`](file:///Users/swoo/Workspaces/de.absolutholz.arcade/libraries/storage/src/pwa/offlineBridge.ts)).

## Consequences

### Positive
- **Optimal Device Storage:** Storage footprint is bounded and strictly under user control; only explicitly selected games occupy persistent disk space.
- **Fault-Tolerant Installation:** Game caching resilience is maximized via `Promise.allSettled`, eliminating fragile all-or-nothing download failures.
- **Graceful Offline Degradation:** Clean localized UI redirects replace broken browser error screens when users try launching uncached games offline.
- **Unified Sync:** State persists reliably across offline gameplay, multi-tab sessions, and remote cloud accounts without race conditions.

### Negative / Trade-offs & Requirements
- **Build Configuration Mandate:** All existing and future games must adopt `createBaseConfig()` from `@arcade/astro-config` to guarantee automated generation of `arcade-manifest.json` and consistent subpath routing.
- **Cache Lifecycle Management:** The Service Worker and offline bridge must manage cache eviction and quota tracking, invalidating stale partition caches when game bundle hashes bump.
