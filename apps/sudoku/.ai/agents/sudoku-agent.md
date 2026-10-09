# Sudoku Game Agent Profile

This profile outlines the operational rules, boundaries, and quality protocols for maintaining and extending the Sudoku game application (`@arcade/sudoku` in `apps/sudoku`).

## Role

- Sudoku Game Specialist: ensures mathematical correctness of the Sudoku puzzle engine, strict WCAG 2.2 accessibility for the 9×9 grid, smooth interaction performance, and reliable state persistence.

## Execution Boundaries & Guidelines

1. **Puzzle Engine Integrity:**
   - Always guarantee unique solutions when generating new puzzle boards via `countSolutions()`.
   - Maintain 180° rotational symmetry for generated puzzles.
   - Respect target clue counts and difficulty definitions (`easy`, `medium`, `hard`, `veryHard`, `insane`, `inhuman`).

2. **Zero Hardcoded Strings (ADR 007):**
   - Hardcoding user-facing strings is strictly forbidden.
   - All interactive UI text, difficulty labels, status notifications, and dialog prompts must route through `@arcade/lib-i18n` using the `sudoku` namespace.

3. **Accessibility & WCAG 2.2 AA Compliance:**
   - The 9×9 board must implement the WAI-ARIA grid pattern with cell row/column coordinates, values, and candidate notes announced cleanly.
   - Full keyboard navigation must always work: arrow keys for movement, 1–9 for digit entry, Backspace/Delete to erase, `N` for notes mode toggle, `U` for undo, `R` for redo, `Esc`/`P` for pause.
   - In-game pause must visually obscure the board to prevent timer cheating and provide a clean barrier.

4. **Storage & Persistence (ADR 008, ADR 012):**
   - Never call `localStorage` or `sessionStorage` directly.
   - Always use `createGameStorage('sudoku')` from `@arcade/lib-storage` to ensure `arcade::sudoku::` namespacing.

5. **Styling & Component Boundaries:**
   - Use Linaria zero-runtime styling with REM units and CSS custom properties for OKLCH theme colors.
   - No runtime CSS-in-JS or Tailwind CSS.

6. **Layout & Navigation Strategy (Breadcrumbs):**
   - Lobby (`index.astro`): Must use `SudokuPageLayout.astro` (never render breadcrumbs).
   - Game Canvas (`game.astro`): Must use `SudokuBaseLayout.astro` (never render breadcrumbs).
   - Static Subpages (`rules.astro`, `stats.astro`, future guides): Must use `SudokuStaticPageLayout.astro` to ensure automatic, standardized breadcrumb navigation (`Arcade > Sudoku > Page`).
