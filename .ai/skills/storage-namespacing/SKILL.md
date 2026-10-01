---
id: storage-namespacing
name: Browser Storage Namespacing
description: Enforce strict key namespacing and storage wrapper usage to prevent cross-game state collision on arcade.absolutholz.de under ADR 012
targets: ['apps/**/*.ts', 'apps/**/*.tsx', 'libraries/storage/**/*.ts']
---

# Browser Storage Namespacing Skill

This skill enforces strict browser storage namespacing across the monorepo in accordance with ADR 012 (Local Storage and State Namespacing) and ADR 008 (State Management and Backend Abstraction).

## 1. Domain Collision Threat (Shared Origin Context)

All applications within this monorepo (`apps/hub`, `apps/sudoku`, `apps/minesweeper`, etc.) deploy to and operate under a single, shared static domain: `arcade.absolutholz.de`.

> [!WARNING]
> Because every game and tool shares the exact same browser origin, any un-namespaced storage key (e.g., `highScore`, `gameState`, `soundEnabled`) will directly overwrite or corrupt data from another game. Failure to namespace storage keys causes irreversible cross-game data corruption and game state destruction.

## 2. Prohibition of Raw Storage APIs

Agents are strictly forbidden from calling native browser storage APIs directly inside application code (`apps/**`):
- **Forbidden:** Direct calls to `window.localStorage.setItem('key', value)`, `localStorage.getItem()`, `localStorage.removeItem()`, or `localStorage.clear()`.
- **Forbidden:** Direct calls to `sessionStorage` methods.
- **Forbidden:** Direct, un-abstracted calls to native `window.indexedDB`.

## 3. Mandatory Centralized Storage Wrapper (`libraries/storage`)

- All state persistence and browser storage interactions must route through the unified storage library (`libraries/storage` / `@arcade/lib-storage`).
- The storage package automatically scopes requests, handles serialization, and exposes asynchronous contracts designed for future backend/sync migrations per ADR 008.
- Example application usage:
  ```ts
  import { createGameStorage } from '@arcade/lib-storage';

  const sudokuStorage = createGameStorage('sudoku');

  // Asynchronous namespaced interaction
  await sudokuStorage.set('highScore', 1250);
  const highScore = await sudokuStorage.get<number>('highScore');
  ```

## 4. Key Namespacing Schema

When configuring the storage wrapper, authoring integration tests, or implementing test mocks, all keys must strictly follow this delimiter format:

```text
arcade::[app-name]::[key]
```

- **Prefix**: `arcade::`
- **Application Scope**: `[app-name]` matching the app directory name (e.g., `sudoku`, `minesweeper`, `hub`).
- **Feature Key**: The specific camelCase state key (e.g., `highScore`, `activeSession`, `volumeLevel`).

### Examples:
- **Valid**: `arcade::sudoku::highScore`
- **Valid**: `arcade::minesweeper::bestTime`
- **Valid**: `arcade::hub::themePreference`
- **Forbidden**: `highScore` (no namespace; causes cross-game collision)
- **Forbidden**: `sudoku_highScore` (invalid delimiter format)
- **Forbidden**: `arcade:sudoku:highScore` (single colons instead of double colons `::`)

## 5. Self-Documenting Storage Code & Comments

- **Descriptive Keys and Contracts**: Storage key identifiers, schema interfaces, and wrapper methods must be self-explanatory (e.g., `hasCompletedTutorial`, `audioVolumePercent`).
- **Concise Logic Comments**: When implementing data schema migrations, serialization fallbacks, or asynchronous cache reconciliation, provide brief, clear comments explaining the underlying rationale. Avoid verbose or redundant commentary on standard getter/setter patterns.
