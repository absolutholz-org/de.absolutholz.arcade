# @arcade/sudoku

Classic, accessible Sudoku puzzle web application for the Arcade monorepo. Built as a hybrid application using **Astro** for static multi-page routing and internationalized layouts, and **React** for the zero-runtime interactive game canvas island.

---

## 🎯 Features

- **6 Difficulty Tiers:** `easy`, `medium`, `hard`, `veryHard`, `insane`, and `inhuman` (matching legacy puzzle targets).
- **Unique Solution Guarantee:** Backtracking solver verifies unique solutions during 180° symmetric puzzle generation.
- **Accessible 9×9 Grid:** Fully navigable via keyboard (arrow keys, 1–9 digit input, Backspace/Delete to erase), WAI-ARIA grid pattern with screen reader announcements.
- **Candidate Notes (Pencil Marks):** Fast toggle between digit and note candidate entry (keyboard shortcut `N`).
- **Undo / Redo Stack:** Unlimited history navigation with automatic peer candidate note cleanup and undo restoration.
- **Visual Assistance & Toggles:** Peer cell highlighting, peer digit highlighting, real-time conflict error detection, and auto-clear notes toggle (configurable in Settings).
- **Running Timer & Obscuring Pause Overlay:** Accurate second-level ticker with blur overlay when paused or when tab is hidden, preventing timer abuse.
- **State Persistence:** Synced to `@arcade/lib-storage` under the `arcade::sudoku::` namespace:
  - `activeGame`: Preserves incomplete puzzle state, timer, and history across reloads.
  - `settings`: Preserves user preferences across sessions.
  - `stats`: Tracks games played, won, and best times per difficulty tier.
- **Multilingual Support:** Fully translated into English (`en`), German (`de`), French (`fr`), and Portuguese (`pt`) via `@arcade/lib-i18n`. Zero hardcoded UI strings.

---

## 🗺️ Routes & Pages

| Route | Description | Rendering Strategy |
| :--- | :--- | :--- |
| `/sudoku/` | Root redirector routing to preferred language | Static SSG + Client redirect script |
| `/sudoku/[lang]/` | Game Lobby with Resume card, difficulty selectors, and quick links | Astro SSG with `<SudokuLobby client:load />` |
| `/sudoku/[lang]/game` | Dedicated full-focus game board canvas | Astro SSG with `<SudokuGame client:only="react" />` |
| `/sudoku/[lang]/rules` | How-to-play guide and rules breakdown | Static Astro SSG |
| `/sudoku/[lang]/stats` | Statistics dashboard with win rates and best times | Astro SSG with `<SudokuStatsView client:load />` |

---

## 🏗️ Architecture

```
apps/sudoku/
├── astro.config.mjs          # Astro config with base '/sudoku' and i18n routing
├── src/
│   ├── components/           # React game island components
│   │   ├── PauseOverlay/     # Obscuring pause backdrop with resume/restart
│   │   ├── SettingsDialog/   # Modal dialog for gameplay & theme toggles
│   │   ├── SudokuBoard/      # 9x9 CSS Grid board with 3x3 block subgrid borders
│   │   ├── SudokuCell/       # Individual interactive cell with candidate notes
│   │   ├── SudokuGame/       # Root game coordinator island with state hook
│   │   ├── SudokuGameHeader/ # Top bar with timer, difficulty badge, pause/settings
│   │   ├── SudokuKeypad/     # 1-9 digits with remaining counts, undo, redo, notes
│   │   ├── SudokuLobby/      # Lobby island with active game resume & difficulty cards
│   │   ├── SudokuStatsView/  # Reactive statistics dashboard
│   │   └── VictoryDialog/    # Win celebration modal with time recap & best time
│   ├── engine/               # Pure TypeScript Sudoku puzzle engine
│   │   ├── generator.ts      # Symmetric puzzle generator with solution verification
│   │   ├── history.ts        # Immutable undo/redo action dispatcher
│   │   ├── solver.ts         # Backtracking solver & solution counter
│   │   ├── types.ts          # Cell, grid, move, settings, and stats contracts
│   │   └── validator.ts      # Conflict detection and completion validator
│   ├── layouts/              # Astro layouts
│   │   ├── SudokuBaseLayout.astro # Global HTML document, meta, and styles
│   │   └── SudokuPageLayout.astro # Header, brand navigation, and footer
│   └── pages/                # Multi-page routes
│       ├── index.astro       # Root language redirector
│       └── [lang]/           # Localized route pages
│           ├── index.astro   # Lobby
│           ├── game.astro    # Game canvas
│           ├── rules.astro   # Rules guide
│           └── stats.astro   # Statistics
```

---

## 💻 Development Commands

From the monorepo root:

```bash
# Start Sudoku local dev server
pnpm dev:sudoku

# Typecheck TypeScript code
pnpm --filter @arcade/sudoku typecheck

# Check formatting and lint rules with Biome
pnpm biome check apps/sudoku
```
