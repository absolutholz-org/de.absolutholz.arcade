# @arcade/untangle

Untangle (Planarity) planar graph puzzle web application for the Arcade monorepo. Built as a hybrid application using **Astro** for static multi-page routing and internationalized layouts, and **React** for the zero-runtime interactive SVG graph canvas island. Implemented per **ADR 0008 (Game Shell & Subsystem Contract)**.

---

## 🎯 Features

- **3 Difficulty Presets:**
  - `easy` (Beginner): **6–8 vertices**
  - `medium` (Intermediate): **10–14 vertices**
  - `hard` (Advanced): **16–22 vertices**
- **Planar Graph Engine:** Generates guaranteed-solvable planar graphs from hidden 2D planar vertex embeddings and scrambles vertices onto a circle so every puzzle has a zero-crossing solution.
- **Exact Integer Cross-Product Intersection Detection:** Uses orientation cross products on integer canvas coordinates (`0..1000`) to detect strict segment crossings while ignoring shared endpoints.
- **Accessible SVG Canvas & Keyboard Controls:**
  - Pointer/touch dragging via `setPointerCapture` for smooth real-time edge crossing updates.
  - Non-color visual cues: dashed strokes (`stroke-dasharray`) for intersecting edges vs. solid strokes for resolved edges.
  - Full keyboard operability: `Tab` to focus `<g role="button" tabIndex={0}>` vertex nodes, `Enter`/`Space` to toggle selection, and `Arrow` keys (`+ Shift` for coarse steps) to reposition vertices.
- **Undo / Redo / Hints / Reset:** Complete move history stack and planar solution hints.
- **State Persistence & Telemetry (`@arcade/lib-storage`):**
  - `untangle:save:v1` (via `createGameStorage('untangle')` under `arcade::untangle::`): Preserves active graph vertices, edges, solution coordinates, move count, and timer state.
  - `untangle:settings:v1` (via `createGameStorage('untangle')` under `arcade::untangle::`): Persists declarative game settings (`difficulty`, `highlightIntersectingEdges`, `showGrid`, `snapToGrid`).
  - `arcade::untangle::stats`: Tracks overall and per-difficulty games played, win rate, best streaks, and best times via `recordGameStats('untangle', roundResult)`.
  - `@arcade/lib-medals`: Awards progressive Untangle achievements and badges.
- **Multilingual Support:** Fully translated into English (`en`), German (`de`), French (`fr`), and Portuguese (`pt`) via `@arcade/lib-i18n`. Zero hardcoded UI strings.

---

## 🗺️ Canonical 6-Route Architecture (ADR 0008)

| Route | Description | Template / Island |
| :--- | :--- | :--- |
| `/untangle/` | Root language redirector | Static SSG + Client redirect |
| `/untangle/[lang]/` | 1. Lobby / Landing with difficulty selector | `<GameLandingTemplate>` + `<UntangleLobby client:load />` |
| `/untangle/[lang]/game` | 2. Gameplay SVG canvas with in-game Rules & Settings modals | `<GameLayout>` + `<UntangleGame client:only="react" />` projecting `<MarkdownContent slot="rulesContent">` |
| `/untangle/[lang]/rules` | 3. Standalone How-to-Play Rules guide | `<MarkdownPageTemplate>` rendering localized `rules.md` |
| `/untangle/[lang]/settings` | 4. Standalone Settings page | `<GameSubpageTemplate>` + `<GameSettingsPanel mode="detailed" client:load />` |
| `/untangle/[lang]/stats` | 5. Standalone Statistics dashboard | `<GameSubpageTemplate>` + `<GameStatsDashboard client:load />` |
| `/untangle/[lang]/medals` | 6. Standalone Medal Showcase | `<GameSubpageTemplate>` + `<GameMedalGrid client:load />` |

---

## 💻 Development Commands

```bash
# Start Untangle dev server
pnpm dev:untangle

# Run unit tests for planar graph engine & intersection logic
pnpm --filter @arcade/untangle test

# Typecheck TypeScript code
pnpm --filter @arcade/untangle typecheck

# Check formatting and lint rules with Biome
pnpm biome check apps/untangle
```
