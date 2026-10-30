# @arcade/sudoku

Classic, accessible Sudoku puzzle web application for the Arcade monorepo. Built as a hybrid application using **Astro** for static multi-page routing and internationalized layouts, and **React** for the zero-runtime interactive game canvas island. Implemented per **ADR 0008 (Game Shell & Subsystem Contract)**.

---

## 🎯 Features

- **6 Difficulty Tiers:** `easy`, `medium`, `hard`, `veryHard`, `insane`, and `inhuman` (matching legacy puzzle targets).
- **Unique Solution Guarantee:** Backtracking solver verifies unique solutions during 180° symmetric puzzle generation.
- **Accessible 9×9 Grid:** Fully navigable via keyboard (arrow keys, 1–9 digit input, Backspace/Delete to erase), WAI-ARIA grid pattern with screen reader announcements.
- **Candidate Notes (Pencil Marks):** Fast toggle between digit and note candidate entry (keyboard shortcut `N`).
- **Undo / Redo Stack:** Unlimited history navigation with automatic peer candidate note cleanup and undo restoration.
- **Visual Assistance & Toggles:** Peer cell highlighting, peer digit highlighting, real-time conflict error detection, and auto-clear notes toggle (configurable in Settings).
- **Dual-Mode Settings & Rules:** Accessible modal overlays in gameplay and standalone subpages for both Settings and How-to-Play Rules.
- **State Persistence & Telemetry:** Synced to `@arcade/lib-storage` under the `arcade::sudoku::` namespace:
  - `arcade::sudoku::activeGame`: Preserves incomplete puzzle state, timer, and history across reloads.
  - `arcade::sudoku::settings`: Preserves user preferences across sessions using `SUDOKU_SETTINGS_CONFIG`.
  - `arcade::sudoku::stats`: Telemetry recording win rate, completion times, and moves across difficulty tiers.
  - `@arcade/lib-medals`: Tracks achievements and progressive Sudoku badges.
- **Multilingual Support:** Fully translated into English (`en`), German (`de`), French (`fr`), and Portuguese (`pt`) via `@arcade/lib-i18n`. Zero hardcoded UI strings.

---

## 🗺️ Canonical 6-Route Architecture (ADR 0008)

| Route | Description | Template / Island |
| :--- | :--- | :--- |
| `/sudoku/` | Root language redirector | Static SSG + Client redirect |
| `/sudoku/[lang]/` | 1. Lobby / Landing with puzzle and difficulty selector | `<GameLandingTemplate>` + `<SudokuLobby client:load />` |
| `/sudoku/[lang]/game` | 2. Gameplay canvas with in-game Rules & Settings modals | `<GameLayout>` + `<SudokuGame client:only="react" />` projecting `<MarkdownContent slot="rulesContent">` |
| `/sudoku/[lang]/rules` | 3. Standalone How-to-Play Rules guide | `<MarkdownPageTemplate>` rendering localized `rules.md` |
| `/sudoku/[lang]/settings` | 4. Standalone Settings page | `<GameSubpageTemplate>` + `<GameSettingsPanel mode="detailed" client:load />` |
| `/sudoku/[lang]/stats` | 5. Standalone Statistics dashboard | `<GameSubpageTemplate>` + `<GameStatsDashboard client:load />` |
| `/sudoku/[lang]/medals` | 6. Standalone Medal Showcase | `<GameSubpageTemplate>` + `<GameMedalGrid client:load />` |

---

## 💻 Development Commands

```bash
# Start Sudoku dev server
pnpm dev:sudoku

# Typecheck TypeScript code
pnpm --filter @arcade/sudoku typecheck

# Check formatting and lint rules with Biome
pnpm biome check apps/sudoku
```
