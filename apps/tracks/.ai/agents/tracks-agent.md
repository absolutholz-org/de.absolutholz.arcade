# Tracks Game Agent Profile

This profile outlines the operational rules, boundaries, and quality protocols for maintaining and extending the Tracks (Train Tracks) puzzle game application (`@arcade/tracks` in `apps/tracks`).

## Role

- Tracks Game Specialist: ensures mathematical correctness of the Train Tracks puzzle engine, strict WCAG 2.2 accessibility for the N×N grid and row/column clues, smooth pointer/drag track-laying interaction performance, and reliable state persistence.

## Execution Boundaries & Guidelines

1. **Puzzle Engine & Rules Integrity:**
   - Always guarantee that completed boards satisfy:
     - A single continuous, non-branching, non-crossing track connects the entry gate (`start`) to the exit gate (`end`).
     - The number of track segments in each row and column matches `rowClues[r]` and `colClues[c]` exactly.
     - All pre-placed `fixedCells` retain their exact assigned `TrackType` and are visited by the continuous path.
     - Zero extra or disconnected track segments exist outside the main path.
   - Support difficulty tiers:
     - `easy`: 6×6 grid.
     - `medium`: 8×8 grid.
     - `hard`: 8×8 grid.
     - `expert`: 10×10 grid.
   - Guarantee unique solutions for puzzles shipped in the static levels bundle and generated dynamically.

2. **Zero Hardcoded Strings (ADR 007):**
   - Hardcoding user-facing strings is strictly forbidden.
   - All interactive UI text, difficulty labels, status notifications, and dialog prompts must route through `@arcade/lib-i18n` using the `tracks` namespace.

3. **Accessibility & WCAG 2.2 AA Compliance:**
   - The N×N board must implement the WAI-ARIA grid pattern with cell coordinates, fixed states, track orientations, cross markers, and error states announced cleanly.
   - Full keyboard navigation must always work: arrow keys for movement, Space/Enter to place or cycle track pieces, `X`/`M` for cross mark, Backspace/Delete to clear, `Z`/`U` for undo, `Y`/`R` for redo, `Esc`/`P` for pause.
   - In-game pause must visually obscure the board and clues to prevent timer cheating and provide a clean barrier.

4. **Storage & Persistence (ADR 008, ADR 012):**
   - Never call `localStorage` or `sessionStorage` directly.
   - Always use `createGameStorage('tracks')` from `@arcade/lib-storage` to ensure `arcade::tracks::` namespacing.

5. **Styling & Component Boundaries:**
   - Use Linaria zero-runtime styling with REM units and CSS custom properties for OKLCH theme colors.
   - Match variants and states using static CSS `data-*` attribute selectors. Zero runtime prop interpolations.

6. **Layout & Navigation Strategy (Breadcrumbs):**
   - Lobby (`index.astro`): Must use `TracksPageLayout.astro` (never render breadcrumbs).
   - Game Canvas (`game.astro`): Must use `TracksBaseLayout.astro` (never render breadcrumbs).
   - Static Subpages (`rules.astro`, future guides): Must use `TracksStaticPageLayout.astro` to ensure automatic, standardized breadcrumb navigation (`Arcade > Tracks > Page`).

## Standard 6-Route Shell & Subsystem Contracts (ADR 0008)

- **6 Canonical Localized Routes (`src/pages/[lang]/`):** Must maintain `index.astro` (Lobby), `game.astro` (Gameplay), `rules.astro` (Rules via `MarkdownPageTemplate`), `settings.astro` (`<GameSettingsPanel mode="detailed" />`), `stats.astro` (`<GameStatsDashboard gameId={gameId} />`), and `medals.astro` (`<GameMedalGrid gameId={gameId} />`), plus root `src/pages/index.astro`.
- **Dual-Mode Rules (`slot="rulesContent"`):** Author rules strictly in `src/content/pages/[lang]/rules.md`. Pre-render in `game.astro` and inject via `<MarkdownContent slot="rulesContent">` for the in-game Rules `<Dialog>` triggered from `GameHeader`.
- **Declarative Settings (`src/config/settings.ts`):** Define game options via `GameSettingsConfig` (`@arcade/lib-games`) and render with `<GameSettingsPanel mode="compact" | "detailed" />`.
- **Unified Telemetry (`arcade::[gameId]::stats`):** Persist match results via `recordGameStats(gameId, roundResult)` (`@arcade/lib-storage`) alongside `recordGameResult` (`@arcade/lib-medals`).
