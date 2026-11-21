# @arcade/undead

Single-player optical deduction puzzle game (**Undead**) for [arcade.absolutholz.de](https://arcade.absolutholz.de/undead).

## Rules Summary

Populate every empty slot in an $N \times N$ hall of diagonal mirrors (`/` and `\`) with a **Ghost**, **Vampire**, or **Zombie** so that:

1. The total counts of ghosts, vampires, and zombies match the puzzle inventory.
2. Every perimeter clue equals the exact number of visible monsters along the ray entering from that edge:
   - **Vampire (`V`):** Visible only before the ray reflects off a mirror.
   - **Ghost (`G`):** Visible only after the ray has reflected off at least one mirror.
   - **Zombie (`Z`):** Always visible, both directly and in reflections.
   - A monster crossed twice by the same ray is counted on each pass where it is visible.

## Difficulty Matrix

| Tier | Grid Size | Mirrors | Uniqueness Guarantee |
| :--- | :--- | :--- | :--- |
| Easy | 4×4 | 4–6 | Strictly 1 unique solution (`countSolutions === 1`) |
| Medium | 5×5 | 7–10 | Strictly 1 unique solution (`countSolutions === 1`) |
| Hard | 6×6 | 10–14 | Strictly 1 unique solution (`countSolutions === 1`) |
| Expert | 7×7 | 15–20 | Strictly 1 unique solution (`countSolutions === 1`) |

## Engine Architecture (`src/engine/`)

- `types.ts`: Domain models for grids, mirrors, rays, clues, validation, and snapshots. Zero DOM/React imports.
- `raycast.ts`: Pure raycasting engine handling `/` (`N ↔ E`, `S ↔ W`) and `\` (`N ↔ W`, `S ↔ E`) reflections, `hasReflected` tracking, and per-step visibility counting.
- `solver.ts`: Deterministic constraint-propagation + MRV backtracking solver verifying unique solvability.
- `generator.ts`: Seedable procedural generator producing verified unique boards across all 4 tiers.
- `validator.ts`: Live inventory over-limit checks, per-clue bounds evaluation, and victory detection.
- `history.ts`: Immutable undo/redo stack.
- `storage.ts`: Namespaced `@arcade/lib-storage` adapter (`arcade::undead::*`).

## Development Commands

```bash
pnpm dev:undead
pnpm --filter @arcade/undead test
pnpm --filter @arcade/undead typecheck
pnpm exec biome check apps/undead
```
