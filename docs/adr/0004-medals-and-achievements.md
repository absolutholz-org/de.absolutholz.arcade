# ADR 0004: Game Aggregated Stats, Custom Game State, and Achievement System

## Status

Accepted

## Context

Our online arcade features diverse game types (puzzle, arcade, level-based) requiring a unified medal and progression system across our four privacy tiers (ADR 0003).

Different games track different metrics: some track high scores, others track difficulty tiers, and others track personal bests on specific static puzzles (e.g., Nonogram). To respect data minimization (GDPR), we avoid invasive chronological session logging while providing each game the flexibility to track level-specific personal records and evaluate achievements.

## Decision

We will implement an aggregate and state-based progression architecture (`@arcade/lib-medals` / domain storage):

### 1. Data Model: Common Base + Game-Specific State

Each game persists a single document/entry per user containing:

- **Base Stats:** Common counters (`gamesPlayed`, `gamesWon`, `totalPlayTimeSeconds`).
- **Custom State (`customStats`):** Game-defined state for level-specific bests (e.g., `{ puzzle_12: { bestTime: 45 } }`), streak counts, or special counters.
- **Medal Progress & Unlocks:** Array/map of unlocked achievement IDs with timestamps and current milestone progress.

No raw chronological session logs are retained. All comparisons (e.g., "did this time beat the previous best?") happen in memory during game completion before writing state.

### 2. Four-Tier Storage Integration

- **Tiers 1 & 2 (Local Only):** Stats and custom state live exclusively in browser IndexedDB via `@arcade/lib-storage`[cite: 1].
- **Tier 3 (Cloud-Synced Private):** Stats and medals sync to Firestore under `/users/{uid}/gameStats/{gameId}`. Kept private; not exposed to leaderboards.
- **Tier 4 (Cloud-Synced Public):** Select stats (e.g., high scores, total medals) can be exposed to public leaderboards.
- **Downgrade Purge:** Downgrading from Tier 3/4 to Tier 2/1 deletes the remote documents in Firestore while preserving local device state.

### 3. Decoupled Game Interface

Games interact through a clean domain facade:
`recordGameResult(gameId, resultPayload)`
The domain layer updates base counters, merges `customStats`, evaluates achievement criteria locally, and delegates to the appropriate storage adapter based on the active user tier.

## Consequences

### Positive

- **Data Minimization:** No personal usage routines or invasive match timestamps are collected.
- **Extensible per Game:** Puzzle games can track 60 individual puzzle times without requiring database schema updates.
- **Small Storage Footprint:** A single small record per game, enabling instant sync and minimal Firestore usage.

### Negative / Trade-offs

- **No Match History:** Players cannot inspect a chronological list of games played in the past, only their current bests and totals.
