# @arcade/lib-logger

Local-only diagnostic logging for the Arcade monorepo. Entries are stored in the player's own browser (IndexedDB) and are never sent anywhere. Players can download them from the arcade settings page to attach to a bug report. See [ADR 0010](../../docs/adr/0010-client-side-diagnostic-logging.md).

## Guarantees

- **Private:** no network requests, no third-party scripts, no remote endpoints.
- **Non-blocking:** raw native IndexedDB, fire-and-forget writes.
- **Bounded:** entries older than 7 days are pruned lazily when the database connection opens.
- **Fail-safe:** if IndexedDB is unavailable (private browsing, blocked), every function resolves quietly (`[]`, `0` or `undefined`) and never throws.

## Usage

```ts
import { createLogger, initGlobalErrorHandlers } from '@arcade/lib-logger';

const log = createLogger('color-flood');
log.info('Game started', { size: 14 });
log.error('Failed to load puzzle', new Error('boom'), { seed: 42 });

// Once per page: capture uncaught errors and unhandled rejections.
const teardown = initGlobalErrorHandlers('arcade-runtime');
```

In non-production builds (`NODE_ENV !== 'production'`) entries are also mirrored to `console[level]` with a `[source]` prefix. `error` accepts `Error` instances, strings or any thrown value, and serializes it to `{ name, message, stack? }`.

## API

| Export | Description |
| :-- | :-- |
| `createLogger(source)` | Scoped `debug` / `info` / `warn` / `error` helpers. |
| `initGlobalErrorHandlers(source?)` | Logs `window` `error` and `unhandledrejection` events; returns a teardown function. |
| `getLogsByTimeRange(range)` | Entries for `'1h' \| '12h' \| '24h' \| '3d' \| 'all'`. |
| `exportLogsAsJson(range)` | Downloads `arcade-logs-[range]-[YYYY-MM-DD-HHmmss].json`; resolves `{ count, filename }`. |
| `clearAllLogs()` | Deletes every entry. |
| `pruneStaleLogs(retentionDays = 7)` | Deletes older entries; resolves the number removed. |
| `serializeError(error)` | Safe error → plain object conversion. |

## Storage layout

Database `arcade_diagnostics` (v1), object store `logs` (`id`, auto-increment) with indexes `by_timestamp`, `by_source`, `by_level`.

## UI

The download and clear controls live in `DiagnosticsSettingsSection` (`@arcade/lib-ui`), rendered on the hub settings page (`/[lang]/settings`, linked from the site footer). The in-game settings dialog only links to that page ("More settings").

## Scripts

```bash
pnpm --filter @arcade/lib-logger test
pnpm --filter @arcade/lib-logger typecheck
```
