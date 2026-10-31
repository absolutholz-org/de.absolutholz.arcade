# @arcade/net

Net (Netwalk / Network) connection puzzle web application for the Arcade monorepo. Built as a hybrid application using **Astro** for static multi-page routing and internationalized layouts, and **React** for the zero-runtime interactive grid island. Implemented per **ADR 0008 (Game Shell & Subsystem Contract)**.

---

## 🎯 Features

- **4 Difficulty Presets:**
  - `easy` (Beginner): **5×5 grid** (25 tiles)
  - `medium` (Intermediate): **7×7 grid** (49 tiles)
  - `hard` (Advanced): **9×9 grid** (81 tiles)
  - `expert` (Backbone): **11×11 grid** (121 tiles)
- **Spanning Tree Engine:** Generates guaranteed-solvable networks via randomized Prim's algorithm from the central root server with zero initial cycles and 100% reachability.
- **Pure Bitwise Direction Arithmetic:** Direction masks (N=1, E=2, S=4, W=8) rotated via pure bitwise shifts (`rotateCW`, `rotateCCW`) and verified via BFS connectivity traversal.
- **Accessible Grid & Keyboard Controls:**
  - WAI-ARIA grid pattern (`role="grid"`, `role="row"`, `role="gridcell"`).
  - Roving tabindex for effortless keyboard navigation across large grids.
  - Arrow keys to navigate, Space/Enter to rotate CW, Shift+Space/Enter to rotate CCW, L to lock/unlock.
  - Non-color visual cues: glowing pulse for energized wires, lock badges for pinned tiles, distinct SVG wire paths for terminals, corners, lines, T-junctions, and crosses.
- **Undo / Redo / Session Persistence:**
  - Full undo/redo move history stack.
  - Active game snapshots auto-saved to scoped storage (`createGameStorage('net')`).
  - Standardized stats telemetry recorded via `recordGameStats('net', roundResult)`.
  - Achievement unlocking and progressive medals via `@arcade/lib-medals`.
- **Multilingual Support:** Fully translated into English (`en`), German (`de`), French (`fr`), and Portuguese (`pt`) via `@arcade/lib-i18n`. Zero hardcoded UI strings.

---

## 🗺️ Canonical 6-Route Architecture (ADR 0008)

| Route | Description | Template / Island |
| :--- | :--- | :--- |
| `/net/` | Root language redirector | Static SSG + Client redirect |
| `/net/[lang]/` | 1. Lobby / Landing with difficulty selector | `<GameLandingTemplate>` + `<NetLobby client:load />` |
| `/net/[lang]/game` | 2. Gameplay canvas with in-game Rules & Settings modals | `<GameLayout>` + `<NetGame client:only="react" />` projecting `<MarkdownContent slot="rulesContent">` |
| `/net/[lang]/rules` | 3. Standalone How-to-Play Rules guide | `<MarkdownPageTemplate>` rendering localized `rules.md` |
| `/net/[lang]/settings` | 4. Standalone Settings page | `<GameSubpageTemplate>` + `<GameSettingsPanel mode="detailed" client:load />` |
| `/net/[lang]/stats` | 5. Standalone Statistics dashboard | `<GameSubpageTemplate>` + `<GameStatsDashboard client:load />` |
| `/net/[lang]/medals` | 6. Standalone Medal Showcase | `<GameSubpageTemplate>` + `<GameMedalGrid client:load />` |

---

## 💻 Development Commands

```bash
# Start Net dev server
pnpm dev:net

# Run unit tests for Net engine & generator
pnpm --filter @arcade/net test

# Typecheck Net application
pnpm --filter @arcade/net typecheck
```
