# @arcade/watersort

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
  - `arcade::watersort::activeGame`: Preserves ongoing puzzle state and timer.
  - `arcade::watersort::settings`: Persists declarative settings via `@arcade/lib-storage`.
  - `arcade::watersort::stats`: Tracks overall and per-difficulty games played, win rate, best streaks, and best times.
  - `@arcade/lib-medals`: Tracks achievements and ladder medals.
- **Multilingual Support:** Fully translated into English (`en`), German (`de`), French (`fr`), and Portuguese (`pt`) via `@arcade/lib-i18n`. Zero hardcoded UI strings.

---

## 🗺️ Canonical 6-Route Architecture (ADR 0008)

| Route | Description | Template / Island |
| :--- | :--- | :--- |
| `/watersort/` | Root language redirector | Static SSG + Client redirect |
| `/watersort/[lang]/` | 1. Lobby / Landing with preset cards & resume | `<GameLandingTemplate>` + `<WaterSortLobby client:load />` |
| `/watersort/[lang]/game` | 2. Gameplay canvas with in-game Rules & Settings modals | `<GameLayout>` + `<WaterSortGame client:only="react" />` projecting `<MarkdownContent slot="rulesContent">` |
| `/watersort/[lang]/rules` | 3. Standalone How-to-Play Rules guide | `<MarkdownPageTemplate>` rendering localized `rules.md` |
| `/watersort/[lang]/settings` | 4. Standalone Settings page | `<GameSubpageTemplate>` + `<GameSettingsPanel mode="detailed" client:load />` |
| `/watersort/[lang]/stats` | 5. Standalone Statistics dashboard | `<GameSubpageTemplate>` + `<GameStatsDashboard client:load />` |
| `/watersort/[lang]/medals` | 6. Standalone Medal Showcase | `<GameSubpageTemplate>` + `<GameMedalGrid client:load />` |

---

## 🏗️ Architecture

```
apps/watersort/
├── astro.config.mjs          # Astro config with base '/watersort' and i18n routing
├── src/
│   ├── components/           # React game island & UI components
│   │   ├── WaterSortBoard/   # Test tubes rendering container
│   │   ├── WaterSortControls/# In-game controls (Undo, Reset, Pause)
│   │   ├── WaterSortGame/    # Root game coordinator island
│   │   ├── WaterSortLobby/   # Lobby with presets and resume card
│   │   ├── WaterSortTube/    # Individual tube with animated liquid layers
│   │   └── WaterSortVictoryDialog/ # Win modal
│   ├── config/
│   │   ├── medals.ts         # WATERSORT_MEDAL_DEFINITIONS
│   │   └── settings.ts       # WATERSORT_SETTINGS_CONFIG (ADR 0008 declarative schema)
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
# Start Water Sort local dev server
pnpm dev:watersort

# Typecheck TypeScript code
pnpm --filter @arcade/watersort typecheck

# Check formatting and lint rules with Biome
pnpm biome check apps/watersort
```
