# Star Battle Game Agent Profile

This profile outlines the operational rules, boundaries, and quality protocols for maintaining and extending the Star Battle game application (`@arcade/star-battle` in `apps/star-battle`).

## Role

- Star Battle Game Specialist: ensures mathematical correctness of the Star Battle puzzle engine, strict WCAG 2.2 accessibility for the N×N grid, smooth touch/drag interaction performance, and reliable state persistence.

## Execution Boundaries & Guidelines

1. **Puzzle Engine & Rules Integrity:**
   - Always guarantee that placed tokens satisfy:
     - Exactly 1 token per row.
     - Exactly 1 token per column.
     - Exactly 1 token per contiguous color region.
     - No two tokens touch horizontally, vertically, or diagonally.
   - Support difficulty tiers:
     - `easy`: 6×6 grid (6 regions, 6 tokens).
     - `medium`: 8×8 grid (8 regions, 8 tokens).
     - `hard`: 10×10 grid (10 regions, 10 tokens).
     - `expert`: 12×12 grid (12 regions, 12 tokens).
   - Guarantee unique solutions for puzzles shipped in the static levels bundle.

2. **Zero Hardcoded Strings (ADR 007):**
   - Hardcoding user-facing strings is strictly forbidden.
   - All interactive UI text, difficulty labels, status notifications, and dialog prompts must route through `@arcade/lib-i18n` using the `star-battle` namespace.

3. **Accessibility & WCAG 2.2 AA Compliance:**
   - The N×N board must implement the WAI-ARIA grid pattern with cell coordinates, region indices, states (empty, marked, token), and rule collisions announced cleanly.
   - Full keyboard navigation must always work: arrow keys for movement, Space/Enter to activate, `S`/`C`/`Q` for Star token, `X`/`M` for mark, Backspace/Delete to erase, `Z`/`U` for undo, `Y`/`R` for redo, `Esc`/`P` for pause.
   - In-game pause must visually obscure the board to prevent timer cheating and provide a clean barrier.

4. **Storage & Persistence (ADR 008, ADR 012):**
   - Never call `localStorage` or `sessionStorage` directly.
   - Always use `createGameStorage('star-battle')` from `@arcade/lib-storage` to ensure `arcade::star-battle::` namespacing.

5. **Styling & Component Boundaries:**
   - Use Linaria zero-runtime styling with REM units and CSS custom properties for OKLCH theme colors.
   - Match variants and regions using static CSS `data-*` attribute selectors. Zero runtime prop interpolations.

6. **Layout & Navigation Strategy (Breadcrumbs):**
   - Lobby (`index.astro`): Must use `BaseLayoutWithSiteHeaderAndSiteFooter.astro` (never render breadcrumbs).
   - Game Canvas (`game.astro`): Must use `GameLayout.astro` (never render breadcrumbs).
   - Static Subpages (`rules.astro`, future guides): Must use `GameSubpageTemplate.astro` / `MarkdownPageTemplate.astro` to ensure automatic, standardized breadcrumb navigation (`Arcade > Star Battle > Page`).

## Standard 6-Route Shell & Subsystem Contracts (ADR 0008)

- **6 Canonical Localized Routes (`src/pages/[lang]/`):** Must maintain `index.astro` (Lobby), `game.astro` (Gameplay), `rules.astro` (Rules via `MarkdownPageTemplate`), `settings.astro` (`<GameSettingsPanel mode="detailed" />`), `stats.astro` (`<GameStatsDashboard gameId={gameId} />`), and `medals.astro` (`<GameMedalGrid gameId={gameId} />`), plus root `src/pages/index.astro`.
- **Dual-Mode Rules (`slot="rulesContent"`):** Author rules strictly in `src/content/pages/[lang]/rules.md`. Pre-render in `game.astro` and inject via `<MarkdownContent slot="rulesContent">` for the in-game Rules `<Dialog>` triggered from `GameHeader`.
- **Declarative Settings (`src/config/settings.ts`):** Define game options via `GameSettingsConfig` (`@arcade/lib-games`) and render with `<GameSettingsPanel mode="compact" | "detailed" />`.
- **Game Medals & Showcase (`src/config/medals.ts`):** Maintain dedicated medal definitions implementing `AchievementDefinition<'star-battle'>` with tier thresholds and evaluation hooks.
