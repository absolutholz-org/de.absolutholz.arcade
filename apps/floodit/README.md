# Flood-It (`@arcade/floodit`)

Flood-It is a casual color-sorting single-player puzzle game built for the Arcade monorepo.

## Gameplay & Rules

1. **Origin:** The player controls the cluster starting from the top-left cell `(0, 0)`.
2. **Flooding:** Choose one of 6 accessible OKLCH colors on each turn.
3. **Absorption:** All cells in the controlled cluster change to the chosen color, instantly absorbing any adjacent orthogonally connected matching neighbors.
4. **Victory:** Flood 100% of the grid with a single color before reaching the move limit!

## Difficulty Tiers

- **Beginner (8×8):** 4 colors, 18 moves cap — Perfect for young and casual players.
- **Easy (10×10):** 5 colors, 22 moves cap — Relaxed warm-up challenge.
- **Medium (14×14):** 6 colors, 26 moves cap — The standard puzzle challenge.
- **Hard (18×18):** 6 colors, 32 moves cap — An expansive, demanding board.

## Architecture

- **Engine:** Headless TypeScript engine located in `src/engine/` (`types.ts`, `generator.ts`, `validator.ts`, `history.ts`, `storage.ts`).
- **Styling:** Linaria CSS-in-JS with native OKLCH root variables in `src/styles/floodit.css`.
- **Accessibility:** Full WCAG 2.2 AA and BITV 2.0 compliance, colorblind geometric shape overlays, keyboard controls (`1`-`6` shortcuts), persistent focus rings, and ARIA live status announcements.
- **Subsystems (ADR 0008):** 6 canonical routes (`/`, `/[lang]/`, `/[lang]/game`, `/[lang]/rules`, `/[lang]/settings`, `/[lang]/stats`, `/[lang]/medals`).
