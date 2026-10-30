# @arcade/tents

Tents and Trees campsite logic puzzle web application for the Arcade monorepo. Built as a hybrid application using **Astro** for static multi-page routing and internationalized layouts, and **React** for the zero-runtime interactive game canvas island. Implemented per **ADR 0008 (Game Shell & Subsystem Contract)**.

---

## 🎯 Features

- **4 Difficulty Tiers:** `easy`, `medium`, `hard`, and `expert`.
- **Unique Solution Guarantee:** Bipartite matching solver verifies unique solution campsite layouts.
- **Accessible Grid & Controls:** WAI-ARIA grid navigation, row/col clue auto-grassing, and keyboard shortcuts.
- **Auto-Grass Helper:** Automatically surrounds placed tents with grass tiles and auto-fills satisfied lines (configurable in Settings).
- **Violation Highlighting:** Highlights adjacent tents, clue overflows, and unpaired trees (configurable in Settings).
- **Undo / Redo / Reset:** Full history navigation and hints.
- **State Persistence & Telemetry:**
  - `arcade::tents::activeGame`: Preserves ongoing puzzle progress.
  - `arcade::tents::settings`: Persists declarative settings via `@arcade/lib-storage`.
  - `arcade::tents::stats`: Tracks overall and per-difficulty games played, win rate, best streaks, and best times.
  - `@arcade/lib-medals`: Tracks achievements and progressive campsite badges.
- **Multilingual Support:** Fully translated into English (`en`), German (`de`), French (`fr`), and Portuguese (`pt`) via `@arcade/lib-i18n`. Zero hardcoded UI strings.

---

## 🗺️ Canonical 6-Route Architecture (ADR 0008)

| Route | Description | Template / Island |
| :--- | :--- | :--- |
| `/tents/` | Root language redirector | Static SSG + Client redirect |
| `/tents/[lang]/` | 1. Lobby / Landing with campsite level selector | `<GameLandingTemplate>` + `<TentsLobby client:load />` |
| `/tents/[lang]/game` | 2. Gameplay canvas with in-game Rules & Settings modals | `<GameLayout>` + `<TentsGame client:only="react" />` projecting `<MarkdownContent slot="rulesContent">` |
| `/tents/[lang]/rules` | 3. Standalone How-to-Play Rules guide | `<MarkdownPageTemplate>` rendering localized `rules.md` |
| `/tents/[lang]/settings` | 4. Standalone Settings page | `<GameSubpageTemplate>` + `<GameSettingsPanel mode="detailed" client:load />` |
| `/tents/[lang]/stats` | 5. Standalone Statistics dashboard | `<GameSubpageTemplate>` + `<GameStatsDashboard client:load />` |
| `/tents/[lang]/medals` | 6. Standalone Medal Showcase | `<GameSubpageTemplate>` + `<GameMedalGrid client:load />` |

---

## 💻 Development Commands

```bash
# Start Tents dev server
pnpm dev:tents

# Typecheck TypeScript code
pnpm --filter @arcade/tents typecheck

# Check formatting and lint rules with Biome
pnpm biome check apps/tents
```
