# Queens Game Agent Profile

This profile outlines the operational rules, boundaries, and quality protocols for maintaining and extending the Queens / Star Battle game application (`@arcade/queens` in `apps/queens`).

## Role

- Queens Game Specialist: ensures mathematical correctness of the Star Battle / Queens puzzle engine, strict WCAG 2.2 accessibility for the N×N grid, smooth touch/drag interaction performance, and reliable state persistence.

## Execution Boundaries & Guidelines

1. **Puzzle Engine & Rules Integrity:**
   - Always guarantee that placed tokens satisfy:
     - Exactly 1 token per row.
     - Exactly 1 token per column.
     - Exactly 1 token per contiguous color region.
     - No two tokens touch horizontally, vertically, or diagonally (King's move distance rule).
   - Support difficulty tiers:
     - `easy`: 6×6 grid (6 regions, 6 tokens).
     - `medium`: 8×8 grid (8 regions, 8 tokens).
     - `hard`: 10×10 grid (10 regions, 10 tokens).
     - `expert`: 12×12 grid (12 regions, 12 tokens).
   - Guarantee unique solutions for puzzles shipped in the static levels bundle.

2. **Zero Hardcoded Strings (ADR 007):**
   - Hardcoding user-facing strings is strictly forbidden.
   - All interactive UI text, difficulty labels, status notifications, and dialog prompts must route through `@arcade/lib-i18n` using the `queens` namespace.

3. **Accessibility & WCAG 2.2 AA Compliance:**
   - The N×N board must implement the WAI-ARIA grid pattern with cell coordinates, region indices, states (empty, marked, token), and rule collisions announced cleanly.
   - Full keyboard navigation must always work: arrow keys for movement, Space/Enter to activate, `C`/`Q` for Crown token, `X`/`M` for mark, Backspace/Delete to erase, `Z`/`U` for undo, `Y`/`R` for redo, `Esc`/`P` for pause.
   - In-game pause must visually obscure the board to prevent timer cheating and provide a clean barrier.

4. **Storage & Persistence (ADR 008, ADR 012):**
   - Never call `localStorage` or `sessionStorage` directly.
   - Always use `createGameStorage('queens')` from `@arcade/lib-storage` to ensure `arcade::queens::` namespacing.

5. **Styling & Component Boundaries:**
   - Use Linaria zero-runtime styling with REM units and CSS custom properties for OKLCH theme colors.
   - Match variants and regions using static CSS `data-*` attribute selectors. Zero runtime prop interpolations.

6. **Layout & Navigation Strategy (Breadcrumbs):**
   - Lobby (`index.astro`): Must use `QueensPageLayout.astro` (never render breadcrumbs).
   - Game Canvas (`game.astro`): Must use `QueensBaseLayout.astro` (never render breadcrumbs).
   - Static Subpages (`rules.astro`, future guides): Must use `QueensStaticPageLayout.astro` to ensure automatic, standardized breadcrumb navigation (`Arcade > Queens > Page`).
