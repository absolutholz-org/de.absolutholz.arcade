# @arcade/star-battle

Star Battle logic puzzle web application for the Arcade monorepo. Built as a hybrid application using **Astro** for static multi-page routing and internationalized layouts, and **React** for the zero-runtime interactive game canvas island. Implemented per **ADR 0008 (Game Shell & Subsystem Contract)**.

---

## 🎯 Features

- **4 Difficulty Tiers:** `easy`, `medium`, `hard`, and `expert`.
- **Unique Solution Puzzles:** Procedural generator and curated puzzle sets ensuring exactly one Star per row, column, and colored region.
- **Accessible Grid & Controls:** WAI-ARIA grid navigation, pointer drag selection, and keyboard navigation.
- **Auto-Cross Helper:** Automatically places elimination marks in adjacent and orthogonal cells around placed stars (configurable in Settings).
- **Undo / Redo Stack:** Unlimited history navigation.
- **State Persistence & Telemetry:**
  - `arcade::star-battle::activeGame`: Preserves incomplete puzzle state and timer.
  - `arcade::star-battle::settings`: Persists declarative settings via `@arcade/lib-storage`.
  - `arcade::star-battle::stats`: Tracks overall and per-difficulty games played, win rate, best streaks, and best times.
  - `@arcade/lib-medals`: Tracks achievements and progressive medals.
- **Multilingual Support:** Fully translated into English (`en`), German (`de`), French (`fr`), and Portuguese (`pt`) via `@arcade/lib-i18n`. Zero hardcoded UI strings.

---

## 🗺️ Canonical 6-Route Architecture (ADR 0008)

| Route | Description | Template / Island |
| :--- | :--- | :--- |
| `/star-battle/` | Root language redirector | Static SSG + Client redirect |
| `/star-battle/[lang]/` | 1. Lobby / Landing with puzzle picker & resume | `<GameLandingTemplate>` + `<StarBattleLobby client:load />` |
| `/star-battle/[lang]/game` | 2. Gameplay canvas with in-game Rules & Settings modals | `<GameLayout>` + `<StarBattleGame client:only="react" />` projecting `<MarkdownContent slot="rulesContent">` |
| `/star-battle/[lang]/rules` | 3. Standalone How-to-Play Rules guide | `<MarkdownPageTemplate>` rendering localized `rules.md` |
| `/star-battle/[lang]/settings` | 4. Standalone Settings page | `<GameSubpageTemplate>` + `<GameSettingsPanel mode="detailed" client:load />` |
| `/star-battle/[lang]/stats` | 5. Standalone Statistics dashboard | `<GameSubpageTemplate>` + `<GameStatsDashboard client:load />` |
| `/star-battle/[lang]/medals` | 6. Standalone Medal Showcase | `<GameSubpageTemplate>` + `<GameMedalGrid client:load />` |

---

## 💻 Development Commands

```bash
# Start Star Battle dev server
pnpm dev:star-battle

# Typecheck TypeScript code
pnpm --filter @arcade/star-battle typecheck

# Check formatting and lint rules with Biome
pnpm biome check apps/star-battle
```
