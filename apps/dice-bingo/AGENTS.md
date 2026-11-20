# @arcade/dice-bingo — Local Agent Invariants

- **Engine (`src/engine/`):** 100% framework-free. Main and anti-diagonals must always evaluate with a `2×` multiplier. Never block the center cell `(2, 2)` on 5×5 boards with obstacles (preserves `dead_center` achievement).
- **Testing:** Run `pnpm --filter @arcade/dice-bingo test` (native Node runner) and `pnpm exec biome check apps/dice-bingo`.
- **Namespaces:** i18n `dice-bingo`; storage `createGameStorage('dice-bingo')`.
