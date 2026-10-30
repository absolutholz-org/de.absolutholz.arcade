# @arcade/bridges

Classic Hashiwokakero (Hashi / Bridges) island network puzzle web application for the Arcade monorepo. Built as a hybrid application using **Astro** for static multi-page routing and internationalized layouts, and **React** for the zero-runtime interactive game canvas island. Implemented per **ADR 0008 (Game Shell & Subsystem Contract)**.

---

## 🎯 Features

- **5 Difficulty Tiers:** `beginner` (6×6), `easy` (8×8), `medium` (10×10), `hard` (14×14), and `expert` (18×18).
- **Procedural Generation & Puzzles:** Connected planar graph generation guaranteeing a single connected component with valid single/double bridge connectivity.
- **Accessible Grid & Controls:** Direct island clicking, directional bridge raycasting, keyboard navigation (arrow keys + directional bridge building), and high-contrast styling.
- **Dual Gameplay Modes:**
  - **Standard Mode:** Ticking timer and best-time tracking.
  - **Zen Mode:** Untimed relaxed puzzle solving.
- **Visual Assistance & Toggles:**
  - Highlighting satisfied islands whose required bridge counts are fully met.
  - Highlighting overflow islands whose bridge counts exceed targets.
- **Undo / Redo / Reset:** Unlimited move history navigation.
- **State Persistence & Telemetry:**
  - `arcade::bridges::activeGame`: Preserves ongoing puzzle progress.
  - `arcade::bridges::settings`: Persists declarative settings via `@arcade/lib-storage`.
  - `arcade::bridges::stats`: Telemetry recording win rate, completion times, and moves across difficulty tiers.
  - `@arcade/lib-medals`: Tracks achievements and progressive bridge-builder badges.
- **Multilingual Support:** Fully translated into English (`en`), German (`de`), French (`fr`), and Portuguese (`pt`) via `@arcade/lib-i18n`. Zero hardcoded UI strings.

---

## 🗺️ Canonical 6-Route Architecture (ADR 0008)

| Route | Description | Template / Island |
| :--- | :--- | :--- |
| `/bridges/` | Root language redirector | Static SSG + Client redirect |
| `/bridges/[lang]/` | 1. Lobby / Landing with puzzle selector | `<GameLandingTemplate>` + `<HashiLobby client:load />` |
| `/bridges/[lang]/game` | 2. Gameplay canvas with in-game Rules & Settings modals | `<GameLayout>` + `<HashiGame client:only="react" />` projecting `<MarkdownContent slot="rulesContent">` |
| `/bridges/[lang]/rules` | 3. Standalone How-to-Play Rules guide | `<MarkdownPageTemplate>` rendering localized `rules.md` |
| `/bridges/[lang]/settings` | 4. Standalone Settings page | `<GameSubpageTemplate>` + `<GameSettingsPanel mode="detailed" client:load />` |
| `/bridges/[lang]/stats` | 5. Standalone Statistics dashboard | `<GameSubpageTemplate>` + `<GameStatsDashboard client:load />` |
| `/bridges/[lang]/medals` | 6. Standalone Medal Showcase | `<GameSubpageTemplate>` + `<GameMedalGrid client:load />` |

---

## 💻 Development Commands

```bash
# Start Bridges dev server
pnpm dev:bridges

# Typecheck TypeScript code
pnpm --filter @arcade/bridges typecheck

# Check formatting and lint rules with Biome
pnpm biome check apps/bridges
```
