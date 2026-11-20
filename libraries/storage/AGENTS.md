# @arcade/lib-storage — Local Agent Invariants

- **Domain & Namespacing (`BASE-12` / `ADR 0008`):** All apps share origin `arcade.absolutholz.de`. Enforce `arcade::[app-name]::[key]` prefixing programmatically; never allow un-prefixed keys or raw `localStorage.clear()`.
- **Pluggable `StorageDriver` Contract:**
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
- **Driver Rules:** Guard browser globals (`typeof window !== 'undefined'`) inside `try / catch` for SSR safety; degrade gracefully to in-memory fallback on `QuotaExceededError` or `SecurityError`; export drivers cleanly via subpaths without root barrel files.
- **Verification:** Run `pnpm --filter @arcade/lib-storage typecheck`, `pnpm biome check libraries/storage`, and isolate tests using `memoryStorageDriver`.
