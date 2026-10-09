# @arcade/lib-storage

Unified asynchronous storage library for the Arcade Web App monorepo. Enforces strict key namespacing and pluggable storage backends in accordance with [ADR 008](../../docs/adr/architecture-decision-records.md#adr-008-state-management-and-backend-abstraction) and [ADR 012](../../docs/adr/architecture-decision-records.md#adr-012-local-storage-and-state-namespacing).

---

## 💡 Why This Package Exists

All applications in this monorepo (`apps/hub`, `apps/sudoku`, etc.) are hosted under a single static domain origin: `arcade.absolutholz.de`.

Because every application shares the exact same browser storage origin:

- Direct, un-namespaced calls to `localStorage.setItem('highScore', ...)` or `localStorage.clear()` cause **irreversible cross-game data collisions and corruption**.
- Calling `localStorage.clear()` from one game would erase the saved states of all other arcade games.
- Direct synchronous calls to `window.localStorage` make future migrations to cloud backends (Firebase, remote leaderboards) painful and leak low-level implementation details into game components.

`@arcade/lib-storage` eliminates these issues by providing a **centralized, asynchronous, scoped storage client with pluggable drivers**.

---

## 📦 Features

- **Strict Key Namespacing ([ADR 012](../../docs/adr/architecture-decision-records.md#adr-012-local-storage-and-state-namespacing)):** Automatically enforces keys formatted as `arcade::[appName]::[key]`.
- **Asynchronous Contracts ([ADR 008](../../docs/adr/architecture-decision-records.md#adr-008-state-management-and-backend-abstraction)):** Designed asynchronously from day one (`Promise`-based) so local storage can be swapped or synced with IndexedDB or Firebase without touching game code.
- **Pluggable Drivers:** Includes `LocalStorageDriver`, `SessionStorageDriver`, and an in-memory `MemoryStorageDriver`.
- **Scoped Isolation:** Calling `.clear()` removes **only** the keys belonging to that specific application scope, leaving other arcade games completely intact.
- **SSR & Privacy Safe:** Gracefully falls back to in-memory storage if storage APIs are unavailable (Node.js/SSR static pre-rendering, private browsing, or quota limits).
- **Zero Barrel Files:** Conforms strictly to the monorepo codebase structure and subpath export rules.

---

## 🚀 Usage

### 1. Basic Persistent Storage (Default)

```ts
import { createGameStorage } from "@arcade/lib-storage";

// Initialize a scoped storage client for Sudoku
const sudokuStorage = createGameStorage("sudoku");

// Persist state (automatically serialized as JSON under 'arcade::sudoku::activeGame')
await sudokuStorage.set("activeGame", {
	difficulty: "medium",
	elapsedSeconds: 142,
	board: [[1, 2, 3] /* ... */],
});

// Retrieve state with full TypeScript type-safety
interface ActiveGameState {
	difficulty: string;
	elapsedSeconds: number;
}
const savedGame = await sudokuStorage.get<ActiveGameState>("activeGame");

// Remove a single key
await sudokuStorage.remove("activeGame");

// Clear ONLY Sudoku data (other arcade games are not affected)
await sudokuStorage.clear();
```

### 2. Using an Alternative Driver (e.g. Session Storage)

For temporary, tab-scoped data that should reset when the browser tab closes:

```ts
import { createGameStorage } from "@arcade/lib-storage";
import { sessionStorageDriver } from "@arcade/lib-storage/drivers/sessionStorageDriver.js";

const draftStorage = createGameStorage("sudoku", {
	driver: sessionStorageDriver,
});

await draftStorage.set("inputHistory", [
	/* ... */
]);
```

---

## 🔌 Creating a Custom Driver

To add a new storage medium (such as IndexedDB or a Firebase sync adapter), implement the `StorageDriver` interface:

```ts
import type { StorageDriver } from "@arcade/lib-storage/types/storage.types.js";

export class IndexedDbDriver implements StorageDriver {
	readonly name = "indexed-db";

	isAvailable(): boolean {
		return typeof window !== "undefined" && "indexedDB" in window;
	}

	async getItem(key: string): Promise<string | null> {
		// Read from IndexedDB store
	}

	async setItem(key: string, value: string): Promise<void> {
		// Write to IndexedDB store
	}

	async removeItem(key: string): Promise<void> {
		// Delete from IndexedDB store
	}

	async getAllKeys(): Promise<string[]> {
		// Return all keys in object store
	}
}
```

---

## 🛡️ Architecture & Boundaries

- **Never call native `window.localStorage` directly** in application code (`apps/*`).
- Always consume `@arcade/lib-storage` via `createGameStorage(appName)`.
- Keys are validated at runtime and must be non-empty strings.
