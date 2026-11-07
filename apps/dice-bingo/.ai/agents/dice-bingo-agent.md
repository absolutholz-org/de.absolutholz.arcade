# Dice Bingo Agent Profile

This profile guides agents maintaining, testing, or modifying `@arcade/dice-bingo`.

## System Overview

* **Game ID:** `dice-bingo`
* **Route:** `/dice-bingo`
* **Category:** `card-board` / `casual-sorting`
* **Package Path:** `apps/dice-bingo`

## Core Invariants

1. **Pure Engine Isolation:** `src/engine/` contains zero React, DOM, or UI imports. Keep all math, grid evaluation, and generation logic headless and tested via native Node runner.
2. **Double Diagonal Points (×2):** Main and anti-diagonals must always evaluate with a 2× multiplier.
3. **Obstacle Preservation:** The center cell `(2, 2)` on 5×5 boards must never be blocked by obstacles to maintain accessibility of the `dead_center` achievement.
4. **Zero Production Builds Locally:** Always validate using `pnpm --filter @arcade/dice-bingo test` and `pnpm exec biome check apps/dice-bingo`.
5. **No Ad-Hoc Styling:** All styling must consume Linaria with static CSS custom variables (`light-dark()`) and `data-*` state selectors.
