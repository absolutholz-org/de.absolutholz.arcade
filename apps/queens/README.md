# @arcade/queens

Queens (Star Battle) logic puzzle web application for the Arcade monorepo. Built as a hybrid application using **Astro** for static multi-page routing and internationalized layouts, and **React** for the zero-runtime interactive game canvas island. Implemented per **ADR 0008 (Game Shell & Subsystem Contract)**.

---

## 🎯 Features

- **4 Difficulty Tiers:** `easy`, `medium`, `hard`, and `expert`.
- **Unique Solution Puzzles:** Procedural generator and curated puzzle sets ensuring exactly one Queen per row, column, and colored region.
- **Accessible Grid & Controls:** WAI-ARIA grid navigation, pointer drag selection, and keyboard navigation.
- **Auto-Cross Helper:** Automatically places elimination marks in adjacent and orthogonal cells around placed crowns (configurable in Settings).
- **Undo / Redo Stack:** Unlimited history navigation.
- **State Persistence & Telemetry:**
  - `arcade::queens::activeGame`: Preserves incomplete puzzle state and timer.
  - `arcade::queens::settings`: Persists declarative settings via `@arcade/lib-storage`.
  - `arcade::queens::stats`: Tracks overall and per-difficulty games played, win rate, best streaks, and best times.
  - `@arcade/lib-medals`: Tracks achievements and progressive medals.
- **Multilingual Support:** Fully translated into English (`en`), German (`de`), French (`fr`), and Portuguese (`pt`) via `@arcade/lib-i18n`. Zero hardcoded UI strings.

---

## 🗺️ Canonical 6-Route Architecture (ADR 0008)

| Route | Description | Template / Island |
| :--- | :--- | :--- |
| `/queens/` | Root language redirector | Static SSG + Client redirect |
| `/queens/[lang]/` | 1. Lobby / Landing with puzzle picker & resume | `<GameLandingTemplate>` + `<QueensLobby client:load />` |
| `/queens/[lang]/game` | 2. Gameplay canvas with in-game Rules & Settings modals | `<GameLayout>` + `<QueensGame client:only="react" />` projecting `<MarkdownContent slot="rulesContent">` |
| `/queens/[lang]/rules` | 3. Standalone How-to-Play Rules guide | `<MarkdownPageTemplate>` rendering localized `rules.md` |
| `/queens/[lang]/settings` | 4. Standalone Settings page | `<GameSubpageTemplate>` + `<GameSettingsPanel mode="detailed" client:load />` |
| `/queens/[lang]/stats` | 5. Standalone Statistics dashboard | `<GameSubpageTemplate>` + `<GameStatsDashboard client:load />` |
| `/queens/[lang]/medals` | 6. Standalone Medal Showcase | `<GameSubpageTemplate>` + `<GameMedalGrid client:load />` |

---

## 💻 Development Commands

```bash
# Start Queens dev server
pnpm dev:queens

# Typecheck TypeScript code
pnpm --filter @arcade/queens typecheck

# Check formatting and lint rules with Biome
pnpm biome check apps/queens
```
