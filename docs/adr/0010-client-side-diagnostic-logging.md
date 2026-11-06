# ADR 0010: Client-Side Diagnostic Logging

## Status

Accepted

## Context

Players report bugs in games we cannot reproduce, and we need runtime diagnostics. [ADR 0003](./0003-consent-manager.md) forbids telemetry leaving the client without explicit consent, and [ADR 0002](./0002-selective-offline-pwa-architecture.md) requires the arcade to work offline. Remote error-reporting services and third-party scripts are therefore not acceptable. Logging must also not degrade game-loop performance.

## Decision

We introduce `@arcade/lib-logger` (`libraries/logger`), a local-only logging library.

1. **Local and private:** logs are written only to the player's browser. There are no network calls, no third-party scripts, no remote endpoints. Logs leave the device only when the player manually downloads a JSON file.
2. **Raw IndexedDB:** database `arcade_diagnostics`, store `logs`. No wrapper libraries. Writes are asynchronous and fire-and-forget so the main thread and game loop are not blocked. Because all apps share one origin, the database is shared and every entry carries a `source` field identifying the app.
3. **Retention:** 7 days maximum. Stale entries are pruned lazily whenever the database connection is first opened; there is no background timer.
4. **Fail-safe:** if IndexedDB is unavailable, all operations resolve without throwing. Logging must never break a game.
5. **UI placement:** download (by time range) and clear controls live in `DiagnosticsSettingsSection`, shown on the hub settings page reachable from the site footer. The in-game `GameSettingsDialog` only shows a "More settings" link to that page, keeping per-game dialogs light.

## Consequences

- Games and shared libraries obtain a logger via `createLogger('<source>')`; they must not use ad-hoc `console` logging for diagnostics worth keeping.
- Do not log personal data or secrets in `message` or `context`; exports are shared by players with maintainers.
- Logging is not governed by the cloud-sync consent tiers of ADR 0003 because data never leaves the device; any future remote upload would require a new ADR and explicit opt-in.
- Logs are lost when the player clears site data; this is acceptable for diagnostics.
