---
id: storage-architecture
name: Storage Architecture and Pluggable Drivers
description: Standards and guidelines for state persistence, storage driver development, and namespaced storage consumption in @arcade/lib-storage
targets: ['libraries/storage/**/*.ts']
---

# Storage Architecture & Pluggable Drivers Skill

This skill defines the technical standards, driver interfaces, and usage constraints for state persistence across the Arcade monorepo.

## 1. Domain Collision & Shared Origin Boundary

All games in this monorepo share the production origin `arcade.absolutholz.de`.

- Native `window.localStorage` and `window.sessionStorage` share an origin-wide key pool.
- Never allow un-prefixed keys in application storage.
- Never call native `localStorage.clear()`—doing so destroys state across all games.

## 2. Pluggable Storage Driver Pattern

All underlying storage mechanisms must implement the canonical `StorageDriver` contract:

```ts
export interface StorageDriver {
  readonly name: string;
  isAvailable(): boolean;
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
  removeItem(key: string): Promise<void>;
  getAllKeys(): Promise<string[]>;
}
```

### Driver Guidelines

1. **SSR Safety First:** Always guard browser global accesses with `typeof window !== 'undefined'` and check availability safely inside a `try / catch` block.
2. **Graceful Memory Fallback:** If browser storage throws a `QuotaExceededError`, `SecurityError`, or if cookies/storage are disabled by user privacy settings, drivers must degrade gracefully to the in-memory fallback without throwing unhandled exceptions.
3. **Subpath Exports:** Drivers must be exported cleanly without root barrel files to support optimal tree-shaking across consumer applications.

## 3. High-Level Game Storage Consumption

Applications must only interact with storage via `createGameStorage(appName)`:

```ts
import { createGameStorage } from '@arcade/lib-storage';

const sudokuStorage = createGameStorage('sudoku');

// Always await storage operations
await sudokuStorage.set('activeGame', gameState);
const savedState = await sudokuStorage.get<GameState>('activeGame');
```

## 4. Testing & Verification

- Verify type-safety with `pnpm --filter @arcade/lib-storage typecheck`.
- Validate code formatting and linting with `pnpm biome check libraries/storage`.
- Test suites must leverage `memoryStorageDriver` or instantiate storage with isolated scopes to prevent test pollution.
