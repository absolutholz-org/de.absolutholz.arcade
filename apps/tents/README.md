# @arcade/tents

Tents & Trees (classic Nikoli grid logic puzzle) for the Absolutholz Arcade.

## Overview

Pitch a tent next to every tree in the forest! Each tree must be paired with exactly one tent placed in an orthogonally adjacent cell (up, down, left, right). Tents may never touch one another—neither orthogonally nor diagonally—and row and column numbers specify the exact number of tents in that line.

## Features

- **4 Difficulty Tiers & Board Sizes:**
  - **Easy:** 6×6 grid (5 trees & tents)
  - **Medium:** 8×8 grid (8 trees & tents)
  - **Hard:** 10×10 grid (12 trees & tents)
  - **Expert:** 12×12 grid (18 trees & tents)
- **Rules & Invariants Validation:**
  - 1-to-1 orthogonal bipartite matching between trees and tents.
  - Chebyshev distance rule: $D_\infty(p_1, p_2) > 1$ (no two tents touch horizontally, vertically, or diagonally).
  - Exact row and column tent counts matching clue numbers.
  - Real-time soft error collision highlighting for touching tents and line overflows.
  - One-click auto-grass helper on satisfied line clues to eliminate remaining empty tiles.
- **Interactions:**
  - Left click / tap to cycle states: `None` $\to$ `Tent` $\to$ `Grass` $\to$ `None`.
  - Right click / secondary tap to directly place or toggle `Grass`.
  - Mobile touch toolbar with dedicated mode toggle (`Tent Mode` vs `Grass Mode`).
  - Full keyboard navigation: arrow keys to move focus, `Space`/`Enter` to place tents, `G` for grass, `Backspace`/`Delete` to clear.
  - Comprehensive Undo and Redo history stack (`Ctrl`/`Cmd`+`Z`, `Ctrl`/`Cmd`+`Shift`+`Z`).
  - Reset board button and hint assistant.
- **Accessibility & i18n:**
  - WAI-ARIA grid pattern with cell coordinates, fixed trees, player marks, and line status announcements.
  - 100% localized in English, German, French, and Portuguese via `@arcade/lib-i18n`.
  - High-contrast OKLCH theme tokens supporting light, dark, and custom themes.
- **Achievements & Persistence:**
  - 8 medals (4 standalone and 4 progressive ladders) tracked via `@arcade/lib-medals`.
  - Local namespaced state storage via `@arcade/lib-storage` with `arcade::tents::*` keys.

## Architecture

- `src/engine/`: Pure headless TypeScript puzzle engine with zero DOM or UI dependencies.
  - `types.ts`: Domain models and mathematical representations.
  - `validator.ts`: Augmenting-path DFS bipartite matching, clue counters, and Chebyshev distance checkers.
  - `solver.ts`: Constraint propagation and backtracking solver confirming solution uniqueness ($S=1$).
  - `generator.ts`: Seedable Mulberry32 PRNG layout generator.
  - `history.ts`: Undo/redo stack and move metric tracker (`grassPlacedCount`).
  - `presets/`: Compact campaign puzzle bundles.
  - `storage.ts`: Persistence facade using `createGameStorage('tents')`.
- `src/components/`: Modular React components styled with zero-runtime Linaria CSS and design system primitives from `@arcade/lib-ui`.
- `src/pages/`: Pre-rendered Astro routes with SSG fallback redirection.

## Development

Run development server:
```bash
pnpm --filter @arcade/tents dev
# or from root
pnpm dev:tents
```

Run engine unit tests:
```bash
pnpm --filter @arcade/tents test
```

Typecheck:
```bash
pnpm --filter @arcade/tents typecheck
```

Build static production bundle:
```bash
pnpm --filter @arcade/tents build
# or from root
pnpm build:tents
```
