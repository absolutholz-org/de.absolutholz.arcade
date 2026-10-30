# @arcade/tracks

Train Tracks route logic puzzle web application for the Arcade monorepo. Built as a hybrid application using **Astro** for static multi-page routing and internationalized layouts, and **React** for the zero-runtime interactive game canvas island. Implemented per **ADR 0008 (Game Shell & Subsystem Contract)**.

---

## 🎯 Features

- **4 Difficulty Tiers:** `easy`, `medium`, `hard`, and `expert`.
- **Procedural & Handcrafted Tracks:** Path deduction connecting start gate A to end gate B matching row and column clue numbers.
- **Accessible Grid & Controls:** Drag-to-track path drawing, keyboard controls, track direction auto-orientation, and cross marker support.
- **Casual & Standard Mode:** Standard mode with heart penalties on invalid placements or Casual mode for relaxed solving.
- **Auto-Cross Helper:** Automatically fills unallocated cells with cross marks when line quotas are met (configurable in Settings).
- **Clue Highlighting:** Visually distinguishes satisfied or exceeded row and column numbers (configurable in Settings).
- **Undo / Redo / Reset:** Full history navigation and hints.
- **State Persistence & Telemetry:**
  - `arcade::tracks::activeGame`: Preserves ongoing puzzle progress.
  - `arcade::tracks::settings`: Persists declarative settings via `@arcade/lib-storage`.
  - `arcade::tracks::stats`: Tracks overall and per-difficulty games played, win rate, best streaks, and best times.
  - `@arcade/lib-medals`: Tracks achievements and progressive conductor badges.
- **Multilingual Support:** Fully translated into English (`en`), German (`de`), French (`fr`), and Portuguese (`pt`) via `@arcade/lib-i18n`. Zero hardcoded UI strings.

---

## 🗺️ Canonical 6-Route Architecture (ADR 0008)

| Route | Description | Template / Island |
| :--- | :--- | :--- |
| `/tracks/` | Root language redirector | Static SSG + Client redirect |
| `/tracks/[lang]/` | 1. Lobby / Landing with puzzle selector | `<GameLandingTemplate>` + `<TracksLobby client:load />` |
| `/tracks/[lang]/game` | 2. Gameplay canvas with in-game Rules & Settings modals | `<GameLayout>` + `<TracksGame client:only="react" />` projecting `<MarkdownContent slot="rulesContent">` |
| `/tracks/[lang]/rules` | 3. Standalone How-to-Play Rules guide | `<MarkdownPageTemplate>` rendering localized `rules.md` |
| `/tracks/[lang]/settings` | 4. Standalone Settings page | `<GameSubpageTemplate>` + `<GameSettingsPanel mode="detailed" client:load />` |
| `/tracks/[lang]/stats` | 5. Standalone Statistics dashboard | `<GameSubpageTemplate>` + `<GameStatsDashboard client:load />` |
| `/tracks/[lang]/medals` | 6. Standalone Medal Showcase | `<GameSubpageTemplate>` + `<GameMedalGrid client:load />` |

---

## 💻 Development Commands

```bash
# Start Tracks dev server
pnpm dev:tracks

# Typecheck TypeScript code
pnpm --filter @arcade/tracks typecheck

# Check formatting and lint rules with Biome
pnpm biome check apps/tracks
```
