# @arcade/liquid-sort

Liquid color sorting puzzle web application for the Arcade monorepo. Built as a hybrid application using **Astro** for static multi-page routing and internationalized layouts, and **React** for the zero-runtime interactive game canvas island. Implemented per **ADR 0008 (Game Shell & Subsystem Contract)** as the monorepo pilot game.

---

## 🎯 Features

- **4 Difficulty Tiers:** `easy`, `medium`, `hard`, and `expert`.
- **Procedural Generation & Preset Levels:** Guaranteed solvable test tube configurations with par move benchmarks.
- **Accessible Tubes & Layers:** Fully navigable via keyboard, mouse, or touch with screen reader announcements.
- **Pattern Overlay:** Optional geometric patterns on liquid layers for enhanced accessibility and colorblind friendliness.
- **Fluid Pour Animations:** Smooth pouring and fill-level animations (configurable via Settings).
- **Undo / Redo Stack:** Step-by-step history reversal.
- **State Persistence & Telemetry:**
  - `arcade::liquid-sort::activeGame`: Preserves ongoing puzzle state and timer.
  - `arcade::liquid-sort::settings`: Persists declarative settings via `@arcade/lib-storage`.
  - `arcade::liquid-sort::stats`: Tracks overall and per-difficulty games played, win rate, best streaks, and best times.
  - `@arcade/lib-medals`: Tracks achievements and ladder medals.
- **Multilingual Support:** Fully translated into English (`en`), German (`de`), French (`fr`), and Portuguese (`pt`) via `@arcade/lib-i18n`. Zero hardcoded UI strings.

---

## 🗺️ Canonical 6-Route Architecture (ADR 0008)

| Route | Description | Template / Island |
| :--- | :--- | :--- |
| `/liquid-sort/` | Root language redirector | Static SSG + Client redirect |
| `/liquid-sort/[lang]/` | 1. Lobby / Landing with preset cards & resume | `<GameLandingTemplate>` + `<LiquidSortLobby client:load />` |
| `/liquid-sort/[lang]/game` | 2. Gameplay canvas with in-game Rules & Settings modals | `<GameLayout>` + `<LiquidSortGame client:only="react" />` projecting `<MarkdownContent slot="rulesContent">` |
| `/liquid-sort/[lang]/rules` | 3. Standalone How-to-Play Rules guide | `<MarkdownPageTemplate>` rendering localized `rules.md` |
| `/liquid-sort/[lang]/settings` | 4. Standalone Settings page | `<GameSubpageTemplate>` + `<GameSettingsPanel mode="detailed" client:load />` |
| `/liquid-sort/[lang]/stats` | 5. Standalone Statistics dashboard | `<GameSubpageTemplate>` + `<GameStatsDashboard client:load />` |
| `/liquid-sort/[lang]/medals` | 6. Standalone Medal Showcase | `<GameSubpageTemplate>` + `<GameMedalGrid client:load />` |

---

## 🏗️ Architecture

```
apps/liquid-sort/
├── astro.config.mjs          # Astro config with base '/liquid-sort' and i18n routing
├── src/
│   ├── components/           # React game island & UI components
│   │   ├── LiquidSortBoard/  # Test tubes rendering container
│   │   ├── LiquidSortControls/# In-game controls (Undo, Reset, Pause)
│   │   ├── LiquidSortGame/   # Root game coordinator island
│   │   ├── LiquidSortLobby/  # Lobby with presets and resume card
│   │   ├── LiquidSortTube/   # Individual tube with animated liquid layers
│   │   └── LiquidSortVictoryDialog/ # Win modal
│   ├── config/
│   │   ├── medals.ts         # LIQUID_SORT_MEDAL_DEFINITIONS
│   │   └── settings.ts       # LIQUID_SORT_SETTINGS_CONFIG (ADR 0008 declarative schema)
│   ├── content/
│   │   └── pages/[lang]/     # Localized markdown rules (rules.md)
│   ├── engine/               # Pure TypeScript puzzle engine (generator, solver, validator)
│   └── pages/                # Multi-page routes
│       ├── index.astro       # Root language redirector
│       └── [lang]/           # Canonical 6 routes
│           ├── index.astro   # Lobby
│           ├── game.astro    # Gameplay canvas
│           ├── rules.astro   # Rules guide
│           ├── settings.astro# Declarative settings
│           ├── stats.astro   # Statistics dashboard
│           └── medals.astro  # Medal showcase
```

---

## 💻 Development Commands

From the monorepo root:

```bash
# Start Liquid Sort local dev server
pnpm dev:liquid-sort

# Typecheck TypeScript code
pnpm --filter @arcade/liquid-sort typecheck

# Check formatting and lint rules with Biome
pnpm biome check apps/liquid-sort
```
