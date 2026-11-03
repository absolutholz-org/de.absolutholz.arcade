# Flood-It Game Agent Profile

This profile outlines the operational rules, boundaries, and quality protocols for maintaining and extending the Flood-It casual color-sorting puzzle game application (`@arcade/floodit` in `apps/floodit`).

## Role

- Flood-It Game Specialist: ensures BFS flood fill correctness, cluster tracking invariants, strict WCAG 2.2 AA accessibility (including colorblind geometric symbol overlays), keyboard navigation (`1`-`6` shortcuts), OKLCH palette compliance, and state persistence.

## Execution Boundaries & Guidelines

1. **Flood Fill & Cluster Engine:**
   - Always guarantee deterministic board generation via Mulberry32 PRNG.
   - Cluster originates at `(0, 0)`.
   - On selecting new color $C_{new} \neq C_{current}$, BFS traverses and absorbs matching adjacent orthogonal neighbors.
   - Calibrated move limits:
     - `easy` (12×12, 22 moves)
     - `medium` (14×14, 25 moves)
     - `hard` (16×16, 30 moves)

2. **Zero Hardcoded Strings (ADR 007):**
   - Hardcoding user-facing strings is strictly forbidden.
   - All interactive UI text, difficulty labels, live status announcements, and dialog prompts must route through `@arcade/lib-i18n` using the `floodit` namespace.

3. **Accessibility & WCAG 2.2 AA Compliance:**
   - The game board must adhere to the WAI-ARIA `grid` pattern: `<div role="grid">`, `<div role="row">`, and `<div role="gridcell">`.
   - Colorblind accessibility: each color has a distinct geometric symbol overlay (`●`, `▲`, `■`, `◆`, `★`, `✚`).
   - Keyboard interaction: color selector buttons support arrow keys, Tab, and direct number shortcuts `1` through `6`.
   - Live announcements via `<VisuallyHidden aria-live="polite">` announcing remaining moves and percentage flooded.

4. **Storage & Persistence (ADR 008, ADR 012):**
   - Use `createGameStorage('floodit')` from `@arcade/lib-storage` (namespaced under `arcade::floodit::`).
   - Record telemetry via `recordGameStats` and medal progress via `recordGameResult`.

5. **Styling & Units:**
   - Use Linaria zero-runtime styling with relative `rem` units throughout.
   - Root OKLCH colors defined in native CSS custom properties. Zero hex color codes.
   - Standardized left-aligned text for intro/lobby sections.

6. **Standard 6-Route Shell (ADR 0008):**
   - `src/pages/index.astro`: Language redirect.
   - `src/pages/[lang]/index.astro`: Lobby (`FloodItLobby client:load`).
   - `src/pages/[lang]/game.astro`: Gameplay (`FloodItGame client:only="react"` with server pre-rendered rules injection).
   - `src/pages/[lang]/rules.astro`: How-to-play prose via `MarkdownPageTemplate`.
   - `src/pages/[lang]/settings.astro`: Standalone explanatory settings via `<GameSettingsPanel mode="detailed" />`.
   - `src/pages/[lang]/stats.astro`: Standalone telemetry via `<GameStatsDashboard gameId="floodit" />`.
   - `src/pages/[lang]/medals.astro`: Standalone medals showcase via `<GameMedalGrid gameId="floodit" />`.
