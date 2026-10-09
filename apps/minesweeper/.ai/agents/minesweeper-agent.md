# Minesweeper Game Agent Profile

This profile outlines the operational rules, boundaries, and quality protocols for maintaining and extending the Minesweeper game application (`@arcade/minesweeper` in `apps/minesweeper`).

## Role

- Minesweeper Game Specialist: ensures mathematical correctness of the minefield generation and neighbor calculations, safe first click guarantees, strict WCAG 2.2 accessibility for the grid, responsive interaction performance, and reliable state persistence.

## Execution Boundaries & Guidelines

1. **Puzzle Engine & Rules Integrity:**
   - Always guarantee that the first uncovered square is safe and opens an initial area (unless explicitly disabled by settings).
   - Correctly compute 8-neighbor counts and flood-fill cascade openings for 0-neighbor cells.
   - Maintain chording behavior: double-clicking or pressing `C` on a revealed number uncovers non-flagged neighbors when adjacent flags equal the number.
   - Support sizes `xs`, `sm`, `md`, `lg`, `xl` and difficulty ratios `simple` (10%), `medium` (15%), `hard` (20%), `expert` (25%).

2. **Zero Hardcoded Strings (ADR 007):**
   - Hardcoding user-facing strings is strictly forbidden.
   - All interactive UI text, difficulty labels, status notifications, and dialog prompts must route through `@arcade/lib-i18n` using the `minesweeper` namespace.

3. **Accessibility & WCAG 2.2 AA Compliance:**
   - The board must implement the WAI-ARIA grid pattern with cell row/column coordinates, state, and nearby counts announced cleanly.
   - Full keyboard navigation must always work: arrow keys for movement, Space/Enter to reveal, `F`/`M` to flag, `C` to chord, `Esc`/`P` for pause.
   - In-game pause must visually obscure the board to prevent timer cheating and provide a clean barrier.

4. **Storage & Persistence (ADR 008, ADR 012):**
   - Never call `localStorage` or `sessionStorage` directly.
   - Always use `createGameStorage('minesweeper')` from `@arcade/lib-storage` to ensure `arcade::minesweeper::` namespacing.

5. **Styling & Component Boundaries:**
   - Use Linaria zero-runtime styling with REM units and CSS custom properties for OKLCH theme colors.
   - No runtime CSS-in-JS or Tailwind CSS.

6. **Layout & Navigation Strategy (Breadcrumbs):**
   - Lobby (`index.astro`): Must use `MinesweeperPageLayout.astro` (never render breadcrumbs).
   - Game Canvas (`game.astro`): Must use `MinesweeperBaseLayout.astro` (never render breadcrumbs).
   - Static Subpages (`rules.astro`, `high-scores.astro`, future guides): Must use `MinesweeperStaticPageLayout.astro` to ensure automatic, standardized breadcrumb navigation (`Arcade > Minesweeper > Page`).
