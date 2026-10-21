# Tents & Trees Game Agent Profile

This profile outlines the operational rules, boundaries, and quality protocols for maintaining and extending the Tents & Trees puzzle game application (`@arcade/tents` in `apps/tents`).

## Role

- Tents Game Specialist: ensures mathematical correctness of the Tents & Trees puzzle engine, strict WCAG 2.2 Level AA accessibility for the N×N grid and line clues, responsive touch and keyboard interactions, and reliable state persistence.

## Execution Boundaries & Guidelines

1. **Puzzle Engine & Rules Integrity:**
   - Always guarantee that completed boards satisfy:
     - 1-to-1 orthogonal pairing between every tree and exactly one tent (tested via maximum bipartite matching).
     - Chebyshev non-touching constraint: no two tents touch horizontally, vertically, or diagonally ($D_\infty > 1$).
     - The number of tents in each row and column matches `rowClues[r]` and `colClues[c]` exactly.
     - All pre-placed trees are immutable and cannot be overwritten.
   - Support difficulty tiers:
     - `easy`: 6×6 grid (5 trees).
     - `medium`: 8×8 grid (8 trees).
     - `hard`: 10×10 grid (12 trees).
     - `expert`: 12×12 grid (18 trees).
   - Guarantee unique solutions for all puzzles generated or bundled as static presets.

2. **Zero Hardcoded Strings (ADR 007):**
   - Hardcoding user-facing strings is strictly forbidden.
   - All interactive UI text, difficulty labels, status notifications, and dialog prompts must route through `@arcade/lib-i18n` using the `tents` namespace.

3. **Accessibility & WCAG 2.2 AA Compliance:**
   - The N×N board must implement the WAI-ARIA grid pattern (`role="grid"`, `role="gridcell"`, `aria-selected`, `aria-readonly`) with cell coordinates, fixed tree states, player marks, and line status announcements.
   - Full keyboard navigation must always work: arrow keys for movement, `Space`/`Enter` to place tents, `G` for grass marks, `Backspace`/`Delete` to clear, `Ctrl`/`Cmd`+`Z` for undo, `Esc`/`P` for pause.
   - In-game pause must visually obscure the board and clues to prevent timer cheating.

4. **Storage & Persistence (ADR 008, ADR 012):**
   - Never call `localStorage` or `sessionStorage` directly.
   - Always use `createGameStorage('tents')` from `@arcade/lib-storage` to ensure `arcade::tents::*` namespacing.

5. **Styling & Component Boundaries:**
   - Use Linaria zero-runtime styling with REM units and CSS custom properties for OKLCH theme colors.
   - Match variants and states using static CSS `data-*` attribute selectors. Zero runtime prop interpolations.
   - Re-use primitives from `@arcade/lib-ui` (`Button`, `SegmentedControl`, `Switch`, `Dialog`, `PauseOverlay`, `VictoryDialog`, `MedalCard`, `GameContainer`).

6. **Layout & Navigation Strategy (Breadcrumbs):**
   - Lobby (`index.astro`): Must use `TentsPageLayout.astro` (never render breadcrumbs).
   - Game Canvas (`game.astro`): Must use `TentsBaseLayout.astro` (never render breadcrumbs).
   - Static Subpages (`rules.astro`, `medals.astro`): Must use `TentsStaticPageLayout.astro` to ensure automatic, standardized breadcrumb navigation (`Arcade > Tents & Trees > Page`).
