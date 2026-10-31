# Untangle Game Agent Profile

This profile outlines the operational rules, boundaries, and quality protocols for maintaining and extending the Untangle (Planarity) planar graph puzzle game application (`@arcade/untangle` in `apps/untangle`).

## Role

- Untangle Game Specialist: ensures mathematical planarity of generated graphs, exact integer cross-product segment intersection detection, strict WCAG 2.2 AA accessibility for interactive SVG vertices and edges, smooth pointer/keyboard node repositioning, and reliable state persistence.

## Execution Boundaries & Guidelines

1. **Planar Graph Engine & Intersection Integrity:**
   - Always guarantee that generated puzzles are strictly planar:
     - Construct graphs from a collision-free 2D planar embedding (`solutionPositions` in `0..1000` integer coordinate space) and verify zero edge intersections in the solved layout before scrambling vertices onto a circle.
     - Ensure initial scrambled layouts always start with at least 1 edge intersection (`intersectionCount > 0`) and a connected graph structure.
   - Use **exact integer cross-product orientation arithmetic** (`ccw` / 2D cross product on integer coordinates) to detect edge-edge intersections:
     - Adjacent edges that share an endpoint vertex must never be flagged as intersecting.
     - Collinear overlapping segments and proper crossings between non-adjacent edges must be detected deterministically without floating-point epsilon drift.
   - Support difficulty presets:
     - `easy` (Beginner): 6–8 vertices.
     - `medium` (Intermediate): 10–14 vertices.
     - `hard` (Advanced): 16–22 vertices.

2. **Zero Hardcoded Strings (ADR 007):**
   - Hardcoding user-facing strings is strictly forbidden.
   - All interactive UI text, difficulty labels, live status announcements, and dialog prompts must route through `@arcade/lib-i18n` using the `untangle` namespace.

3. **Accessibility & WCAG 2.2 AA Compliance:**
   - Every interactive SVG vertex (`<g role="button" tabIndex={0}>`) must expose an accessible `aria-label` announcing its vertex index, current coordinates, and connected intersecting edge status, plus `aria-pressed` when selected.
   - Full keyboard navigation must always work: `Tab`/`Shift+Tab` to traverse vertices, `Enter`/`Space` to toggle vertex selection, `Arrow` keys for fine movement (`10` coordinate units), `Shift + Arrow` keys for coarse movement (`40` coordinate units), `Z`/`U` for undo, `Y` for redo, `H` for hint, and `Esc`/`P` for deselect/pause.
   - Never rely on color alone to distinguish intersecting edges from resolved edges: intersecting edges must combine semantic stroke tokens with a dashed pattern (`stroke-dasharray`), while resolved edges use a solid stroke.
   - Enforce a minimum hit target equivalent to `>= 24x24` CSS pixels on vertices and obscured board rendering when paused.

4. **Storage & Persistence (ADR 008, ADR 012):**
   - Never call `localStorage` or `sessionStorage` directly.
   - Always use `createGameStorage('untangle')` from `@arcade/lib-storage` (namespaced under `arcade::untangle::`) with storage keys `untangle:save:v1` for active puzzle state and `untangle:settings:v1` for game settings.

5. **Styling & Component Boundaries:**
   - Use Linaria zero-runtime styling with REM units and CSS custom properties for OKLCH theme colors.
   - Match variants and states using static CSS `data-*` attribute selectors (`data-intersecting`, `data-selected`, `data-connected`). Zero runtime prop interpolations.

6. **Layout & Navigation Strategy (Breadcrumbs):**
   - Lobby (`index.astro`): Must use `UntanglePageLayout.astro` (never render breadcrumbs).
   - Game Canvas (`game.astro`): Must use `UntangleBaseLayout.astro` (never render breadcrumbs).
   - Static Subpages (`rules.astro`, `settings.astro`, `stats.astro`, `medals.astro`): Must use `MarkdownPageTemplate.astro` or `GameSubpageTemplate.astro` inside `UntanglePageLayout.astro`.

## Standard 6-Route Shell & Subsystem Contracts (ADR 0008)

- **6 Canonical Localized Routes (`src/pages/[lang]/`):** Must maintain `index.astro` (Lobby), `game.astro` (Gameplay), `rules.astro` (Rules via `MarkdownPageTemplate`), `settings.astro` (`<GameSettingsPanel mode="detailed" />`), `stats.astro` (`<GameStatsDashboard gameId={gameId} />`), and `medals.astro` (`<GameMedalGrid gameId={gameId} />`), plus root `src/pages/index.astro`.
- **Dual-Mode Rules (`slot="rulesContent"`):** Author rules strictly in `src/content/pages/[lang]/rules.md`. Pre-render in `game.astro` and inject via `<MarkdownContent slot="rulesContent">` for the in-game Rules `<Dialog>` triggered from `GameHeader`.
- **Declarative Settings (`src/config/settings.ts`):** Define game options via `GameSettingsConfig` (`@arcade/lib-games`) and render with `<GameSettingsPanel mode="compact" | "detailed" />`.
- **Unified Telemetry (`arcade::[gameId]::stats`):** Persist match results via `recordGameStats('untangle', roundResult)` (`@arcade/lib-storage`) alongside `recordGameResult` (`@arcade/lib-medals`).
