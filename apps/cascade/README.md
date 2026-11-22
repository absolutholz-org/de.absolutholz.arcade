# @arcade/cascade

**Cascade** is a classic tile-matching puzzle game built on a 15×10 grid with two-step cluster selection, gravity drops, horizontal column compaction, and quadratic cluster scoring.

## Rules & Scoring

- **Grid:** 15 columns × 10 rows (150 tiles).
- **Difficulty Tiers:** Easy (3 colors), Normal (4 colors), Hard (5 colors).
- **Two-Step Selection:** Tap/click a connected orthogonal group of 2+ matching tiles to highlight it and preview `(n - 2)²` points; tap/click the highlighted group again to clear it.
- **Board Physics:** Remaining tiles fall vertically into gaps; completely empty columns collapse by shifting columns on the right to the left.
- **End Condition:** Automatically detected when no adjacent matching pairs remain. Clearing 100% of the board awards a **+1,000 Perfect Clear** bonus.

## Engine Architecture

The headless engine lives in `src/engine/` with zero React or DOM dependencies:
- `types.ts`: Domain models (`Board`, `Tile`, `Difficulty`, `GameSnapshot`).
- `prng.ts`: Mulberry32 deterministic PRNG.
- `board.ts`: Flood-fill cluster detection, `(n - 2)²` scoring, vertical gravity + horizontal compaction, and orphan/end-of-game detection.
- `generator.ts`: Seeded 15×10 board generator guaranteeing at least one valid move.
- `history.ts`: Immutable Undo/Redo move stack.
- `storage.ts`: Scoped `@arcade/lib-storage` adapter (`arcade::cascade::*`).

## Development Commands

```bash
pnpm dev:cascade
pnpm --filter @arcade/cascade test
pnpm --filter @arcade/cascade typecheck
pnpm build:cascade
```
