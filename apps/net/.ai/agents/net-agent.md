# Net Game Agent Profile

This profile outlines the operational rules, boundaries, and quality protocols for maintaining and extending the Net (Netwalk / Network) connection puzzle game application (`@arcade/net` in `apps/net`).

## Role

- Net Game Specialist: ensures mathematical connectivity and solvability of generated spanning trees, pure bitwise rotation arithmetic, strict WCAG 2.2 AA accessibility for interactive grid cells and wire SVG graphics, smooth keyboard roving tabindex navigation, and reliable state persistence.

## Execution Boundaries & Guidelines

1. **Spanning Tree & Connectivity Engine:**
   - Always guarantee that generated puzzles are strictly connected and solvable:
     - Construct graphs via randomized Prim's algorithm from the central root server (`(rootRow, rootCol)`), guaranteeing 100% cell reachability with zero initial loops.
     - Ensure initial scrambled layouts have tiles rotated away from their solution orientations to require genuine routing.
   - Use **pure bitwise direction arithmetic** (N=1, E=2, S=4, W=8):
     - Clockwise: `((mask << 1) | (mask >> 3)) & 0b1111`
     - Counter-Clockwise: `((mask >> 1) | ((mask & 1) << 3)) & 0b1111`
     - Perform BFS connectivity from the root node to compute powered states and detect open/leaking ports.
   - Support difficulty presets:
     - `easy` (5×5, 25 cells)
     - `medium` (7×7, 49 cells)
     - `hard` (9×9, 81 cells)
     - `expert` (11×11, 121 cells)

2. **Zero Hardcoded Strings (ADR 007):**
   - Hardcoding user-facing strings is strictly forbidden.
   - All interactive UI text, difficulty labels, live status announcements, and dialog prompts must route through `@arcade/lib-i18n` using the `net` namespace.

3. **Accessibility & WCAG 2.2 AA Compliance:**
   - The game board must adhere to the WAI-ARIA `grid` pattern: `<div role="grid">`, `<div role="row">`, and `<button role="gridcell">` with roving `tabIndex`.
   - Full keyboard navigation: `Arrow` keys to traverse the grid, `Space`/`Enter` to rotate clockwise, `Shift+Space`/`Shift+Enter` to rotate counter-clockwise, `L` to toggle tile lock, `Z`/`U` for undo, `Y` for redo, and `P` for pause.
   - Provide an ARIA live region (`aria-live="polite"`) announcing connection milestones and solved states.
   - Non-color visual cues: glowing pulse for energized wires, distinct wire paths for terminals, corners, straight lines, T-junctions, crosses, and root server.
   - Enforce a minimum hit target equivalent to `>= 24x24` CSS pixels.

4. **Storage & Persistence (ADR 008, ADR 012):**
   - Never call `localStorage` or `sessionStorage` directly.
   - Always use `createGameStorage('net')` from `@arcade/lib-storage` (namespaced under `arcade::net::`).

5. **Styling & Component Boundaries:**
   - Use Linaria zero-runtime styling with REM units and CSS custom properties for OKLCH theme colors.
   - Dynamic rotation angles and grid dimensions must be set via CSS custom properties on style attributes (e.g. `style={{ '--tile-angle': `${rotation}deg` }}`) and consumed by static Linaria class rules. Zero runtime prop interpolation functions.

6. **Layout & Navigation Strategy (Breadcrumbs):**
   - Interactive Game Canvas (`game.astro`): Must use `GameLayout` (never render breadcrumbs).
   - Lobby (`index.astro`): Must use `BaseLayoutWithSiteHeaderAndSiteFooter` (never render breadcrumbs).
   - Static Subpages (`rules.astro`, `settings.astro`, `stats.astro`, `medals.astro`): Must use `MarkdownPageTemplate.astro` or `GameSubpageTemplate.astro`.

## Standard 6-Route Shell & Subsystem Contracts (ADR 0008)

- **6 Canonical Localized Routes (`src/pages/[lang]/`):** Must maintain `index.astro` (Lobby), `game.astro` (Gameplay), `rules.astro` (Rules via `MarkdownPageTemplate`), `settings.astro` (`<GameSettingsPanel mode="detailed" />`), `stats.astro` (`<GameStatsDashboard gameId={gameId} />`), and `medals.astro` (`<GameMedalGrid gameId={gameId} />`), plus root `src/pages/index.astro`.
- **Dual-Mode Rules (`slot="rulesContent"`):** Author rules strictly in `src/content/pages/[lang]/rules.md`. Pre-render in `game.astro` and inject via `<MarkdownContent slot="rulesContent">` for the in-game Rules `<Dialog>`.
- **Declarative Settings (`src/config/settings.ts`):** Define game options via `GameSettingsConfig` (`@arcade/lib-games`) and render with `<GameSettingsPanel mode="compact" | "detailed" />`.
- **Unified Telemetry (`arcade::[gameId]::stats`):** Persist match results via `recordGameStats('net', roundResult)` (`@arcade/lib-storage`) alongside `recordGameResult` (`@arcade/lib-medals`).
