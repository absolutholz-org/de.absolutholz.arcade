# @arcade/color-map

Single-player Four Color Theorem logic & spatial puzzle game for **absolutholz Arcade** (`arcade.absolutholz.de/color-map`).

## Rules Summary

Color every irregular region on the map using **4 colors** (`●` Coral, `▲` Amber, `■` Emerald, `◆` Cobalt) so that no two regions sharing an orthogonal border edge have the same color. Regions touching only at a single diagonal corner are not adjacent.

## Difficulty Matrix

| Tier | Grid | Regions | Target Clues |
| :--- | :---: | :---: | :---: |
| **Easy** | 12×12 | 10–12 | ~40–45% |
| **Medium** | 16×16 | 16–18 | ~35% |
| **Hard** | 24×24 | 28–32 | ~25–30% |
| **Expert** | 32×32 | 45–50 | ~20–25% |

## Engine Architecture (`src/engine/`)

- `prng.ts`: Deterministic Mulberry32 seeded PRNG.
- `adjacency.ts`: Organic flood-fill region generation, orthogonal-only adjacency graph builder, pole-of-inaccessibility label anchor calculation, and SVG path builders.
- `solver.ts`: Backtracking 4-coloring solver (MRV + degree heuristic + bitmask forward checking) and unit-propagating unique-solution counter (`countSolutions`, early stop at `count > 1`).
- `generator.ts`: Seeded procedural puzzle generator with iterative clue sculpting guaranteeing a unique solution.
- `validator.ts`: Border conflict detection and completion verification.
- `history.ts`: Immutable undo/redo stack.
- `storage.ts`: Namespaced `@arcade/lib-storage` adapter (`arcade::color-map::*`).

## Commands

```bash
pnpm --filter @arcade/color-map dev
pnpm --filter @arcade/color-map test
pnpm --filter @arcade/color-map typecheck
```
