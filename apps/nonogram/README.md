# @arcade/nonogram

Classic, accessible Nonogram (Picross / Picture Logic) puzzle web application for the Arcade monorepo. Built as a hybrid application using **Astro** for static multi-page routing and internationalized layouts, and **React** for the zero-runtime interactive game canvas island. Implemented per **ADR 0008 (Game Shell & Subsystem Contract)**.

---

## 🎯 Features

- **3 Difficulty Tiers & Sizing:**
  - **Easy:** 5×5 grid (quick onboarding / low deduction complexity)
  - **Medium:** 10×10 grid (balanced deduction runs)
  - **Hard:** 15×15 grid (complex overlapping sequences)
- **15 Curated Deterministic Starter Puzzles:** 5 iconic retro gaming icons per tier (Heart, Trophy, Pine Tree, Sailboat, Cottage, Space Invader, Mushroom, Ghost, Controller, Floppy Disk, Crown, Sword, Robot, Cabinet, Castle) — each mathematically verified with a unique, deterministically solvable solution without guessing.
- **Dual-Mode Controls & Settings:**
  - Left-click to fill, right-click to cross, drag drawing with axis locking.
  - Auto-cross completed lines toggle (configurable in in-game and standalone Settings).
  - Pre-rendered How-to-Play Rules projected into an accessible in-game modal dialog.
- **Visual Grid A11y & Readability:**
  - Thicker grid lines every 5 cells (both rows and columns) for quick visual scanning.
  - Clue headers on the top (columns) and left (rows) that auto-dim when completed.
  - Full keyboard navigation: arrow keys to move focus, `Space`/`Enter` to fill, `X` to cross, `Backspace`/`Delete` to erase, `Ctrl+Z`/`Ctrl+Y` to undo/redo.
- **State Persistence & Telemetry:**
  - `arcade::nonogram::activeGame`: Preserves ongoing puzzle progress.
  - `arcade::nonogram::settings`: Persists declarative settings via `@arcade/lib-storage`.
  - `arcade::nonogram::stats`: Telemetry recording win rate, completion times, and moves across difficulty tiers.
  - `@arcade/lib-medals`: Tracks achievements and progressive Nonogram badges.
- **Multilingual Support:** Fully translated into English (`en`), German (`de`), French (`fr`), and Portuguese (`pt`) via `@arcade/lib-i18n`. Zero hardcoded UI strings.

---

## 🗺️ Canonical 6-Route Architecture (ADR 0008)

| Route | Description | Template / Island |
| :--- | :--- | :--- |
| `/nonogram/` | Root language redirector | Static SSG + Client redirect |
| `/nonogram/[lang]/` | 1. Lobby / Landing with puzzle selector | `<GameLandingTemplate>` + `<NonogramLobby client:load />` |
| `/nonogram/[lang]/game` | 2. Gameplay canvas with in-game Rules & Settings modals | `<GameLayout>` + `<NonogramGame client:only="react" />` projecting `<MarkdownContent slot="rulesContent">` |
| `/nonogram/[lang]/rules` | 3. Standalone How-to-Play Rules guide | `<MarkdownPageTemplate>` rendering localized `rules.md` |
| `/nonogram/[lang]/settings` | 4. Standalone Settings page | `<GameSubpageTemplate>` + `<GameSettingsPanel mode="detailed" client:load />` |
| `/nonogram/[lang]/stats` | 5. Standalone Statistics dashboard | `<GameSubpageTemplate>` + `<GameStatsDashboard client:load />` |
| `/nonogram/[lang]/medals` | 6. Standalone Medal Showcase | `<GameSubpageTemplate>` + `<GameMedalGrid client:load />` |

---

## 💻 Development Commands

```bash
# Start Nonogram dev server
pnpm dev:nonogram

# Typecheck TypeScript code
pnpm --filter @arcade/nonogram typecheck

# Check formatting and lint rules with Biome
pnpm biome check apps/nonogram
```
