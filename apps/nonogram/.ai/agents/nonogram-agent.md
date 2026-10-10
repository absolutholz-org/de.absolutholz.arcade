# Nonogram Game Agent Profile

This profile outlines the operational rules, boundaries, and quality protocols for maintaining and extending the Nonogram game application (`@arcade/nonogram` in `apps/nonogram`).

## Role

- Nonogram Game Specialist: ensures mathematical correctness of clue derivations, line runs, deterministic solvability of puzzles, dual-mode (fill/cross) line drawing, strict WCAG 2.2 accessibility for the grid, responsive interaction performance, and reliable state persistence.

## Execution Boundaries & Guidelines

1. **Puzzle Engine & Rules Integrity:**
   - Maintain the binary matrix model (`1` = filled, `0` = empty) and clue run derivations.
   - Every catalog puzzle must have a unique, deterministically solvable solution without guessing.
   - Line auto-dimming occurs when the sequence of filled cells in a row/column matches the line clue.
   - Win detection triggers automatically when all filled cells match the solution matrix. Extra `X` markings do not prevent victory.
   - Support progression tiers: Easy (5×5), Medium (10×10), Hard (15×15).

2. **Zero Hardcoded Strings (ADR 007):**
   - Hardcoding user-facing strings is strictly forbidden.
   - All interactive UI text, difficulty labels, status notifications, and dialog prompts must route through `@arcade/lib-i18n` using the `nonogram` namespace.

3. **Accessibility & WCAG 2.2 AA Compliance:**
   - The board must implement the WAI-ARIA grid pattern with cell row/column coordinates, state, and clue runs announced cleanly.
   - Full keyboard navigation must always work: arrow keys for movement, Space/Enter to fill, `X` to cross, Backspace/Delete to erase.
   - In-game pause must visually obscure the board to prevent timer cheating and provide a clean barrier.

4. **Storage & Persistence (ADR 008, ADR 012):**
   - Never call `localStorage` or `sessionStorage` directly.
   - Always use `createGameStorage('nonogram')` from `@arcade/lib-storage` to ensure `arcade::nonogram::` namespacing.

5. **Styling & Component Boundaries:**
   - Use Linaria zero-runtime styling with REM units and CSS custom properties for OKLCH theme colors.
   - Thicker grid lines every 5 cells (both rows and columns) for rapid visual scanning.
   - Suppress browser context menu on the grid in favor of marking `X`.

6. **Layout & Navigation Strategy (Breadcrumbs):**
   - Lobby (`index.astro`): Must use `NonogramPageLayout.astro` (never render breadcrumbs).
   - Game Canvas (`game.astro`): Must use `NonogramBaseLayout.astro` (never render breadcrumbs).
   - Static Subpages (`rules.astro`): Must use `NonogramStaticPageLayout.astro` to ensure automatic, standardized breadcrumb navigation (`Arcade > Nonogram > Page`).
