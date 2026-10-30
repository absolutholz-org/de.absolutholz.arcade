# @arcade/minesweeper

Classic, accessible Minesweeper puzzle web application for the Arcade monorepo. Built as a hybrid application using **Astro** for static multi-page routing and internationalized layouts, and **React** for the zero-runtime interactive game canvas island. Implemented per **ADR 0008 (Game Shell & Subsystem Contract)**.

---

## 🎯 Features

- **5 Board Sizes & 4 Difficulty Ratios:**
  - Sizes: `xs` (5×5), `sm` (7×7), `md` (9×9), `lg` (11×11), `xl` (12×12).
  - Difficulty: `simple` (10% mines), `medium` (15% mines), `hard` (20% mines), `expert` (25% mines).
- **First-Click Safety Guarantee:** The very first clicked cell is always guaranteed safe, dynamically reallocating mine placements before opening empty cascades.
- **Dual Controls & A11y:**
  - Desktop: Left-click to reveal, right-click to flag, double-click/middle-click/space on number cells to chord.
  - Mobile/Touch: Toggle between Reveal and Flag modes with dedicated action triggers.
  - Full keyboard navigation across grid cells with arrow keys and screen reader announcements.
- **Dual-Mode Settings & Rules:**
  - Safe first click, question marks, and fit-to-screen toggles.
  - Pre-rendered How-to-Play Rules projected into an accessible in-game modal dialog.
- **State Persistence & Telemetry:**
  - `arcade::minesweeper::activeGame`: Preserves ongoing puzzle progress.
  - `arcade::minesweeper::settings`: Persists declarative settings via `@arcade/lib-storage`.
  - `arcade::minesweeper::stats`: Telemetry recording win rate, completion times, and moves across difficulty tiers.
  - `@arcade/lib-medals`: Tracks achievements and progressive minesweeper badges.
- **Multilingual Support:** Fully translated into English (`en`), German (`de`), French (`fr`), and Portuguese (`pt`) via `@arcade/lib-i18n`. Zero hardcoded UI strings.

---

## 🗺️ Canonical 6-Route Architecture (ADR 0008)

| Route | Description | Template / Island |
| :--- | :--- | :--- |
| `/minesweeper/` | Root language redirector | Static SSG + Client redirect |
| `/minesweeper/[lang]/` | 1. Lobby / Landing with size and difficulty selectors | `<GameLandingTemplate>` + `<MinesweeperLobby client:load />` |
| `/minesweeper/[lang]/game` | 2. Gameplay canvas with in-game Rules & Settings modals | `<GameLayout>` + `<MinesweeperGame client:only="react" />` projecting `<MarkdownContent slot="rulesContent">` |
| `/minesweeper/[lang]/rules` | 3. Standalone How-to-Play Rules guide | `<MarkdownPageTemplate>` rendering localized `rules.md` |
| `/minesweeper/[lang]/settings` | 4. Standalone Settings page | `<GameSubpageTemplate>` + `<GameSettingsPanel mode="detailed" client:load />` |
| `/minesweeper/[lang]/stats` | 5. Standalone Statistics dashboard | `<GameSubpageTemplate>` + `<GameStatsDashboard client:load />` |
| `/minesweeper/[lang]/medals` | 6. Standalone Medal Showcase | `<GameSubpageTemplate>` + `<GameMedalGrid client:load />` |

---

## 💻 Development Commands

```bash
# Start Minesweeper dev server
pnpm dev:minesweeper

# Typecheck TypeScript code
pnpm --filter @arcade/minesweeper typecheck

# Check formatting and lint rules with Biome
pnpm biome check apps/minesweeper
```
