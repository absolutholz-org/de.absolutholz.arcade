# @arcade/minesweeper

Classic, accessible Minesweeper logic puzzle web application for the Arcade monorepo. Built as a hybrid application using **Astro** for static multi-page routing and internationalized layouts, and **React** for the zero-runtime interactive game canvas island.

---

## 🎯 Features

- **5 Board Sizes:** `xs` (5×5, 25 fields), `sm` (7×7, 49 fields), `md` (9×9, 81 fields), `lg` (11×11, 121 fields), and `xl` (12×12, 144 fields) — matching the classic web version.
- **4 Difficulty Tiers:** `simple` (10% mines), `medium` (15% mines), `hard` (20% mines), and `expert` (25% mines).
- **First Click Safety:** The very first clicked cell is guaranteed to never contain a mine and opens a clean area.
- **Chording:** Double-click, middle-click, or press `C` on a revealed number when adjacent flags are placed to quickly uncover remaining neighbors.
- **Accessible Grid (WCAG 2.2 AA):** Fully navigable via keyboard (arrow keys, `Space`/`Enter` to uncover, `F`/`M` to flag, `C` to chord, `P`/`Esc` to pause), WAI-ARIA grid pattern with cell coordinate and state screen reader announcements.
- **Running Timer & Obscuring Pause Overlay:** Accurate second ticker with an obscuring pause overlay that prevents timer abuse and board inspection while paused or when the browser tab loses focus.
- **State Persistence:** Synced to `@arcade/lib-storage` under the `arcade::minesweeper::` namespace:
  - `activeGame`: Preserves in-progress game state and timer across reloads.
  - `settings`: Preserves user preferences across sessions (safe first click, question marks).
  - `highScores`: Tracks top 10 completion times and dates per size and difficulty tier.
  - `lastConfig`: Remembers preferred board size and difficulty.
- **Multilingual Support:** Fully translated into English (`en`), German (`de`), French (`fr`), and Portuguese (`pt`) via `@arcade/lib-i18n`. Zero hardcoded UI strings.

---

## 🗺️ Routes & Pages

| Route | Description | Rendering Strategy |
| :--- | :--- | :--- |
| `/minesweeper/` | Root redirector routing to preferred language | Static SSG + Client redirect script |
| `/minesweeper/[lang]/` | Game Lobby with size/difficulty pickers and active game resume | Astro SSG with `<MinesweeperLobby client:load />` |
| `/minesweeper/[lang]/game` | Dedicated game canvas island | Astro SSG with `<MinesweeperGame client:only="react" />` |
| `/minesweeper/[lang]/rules` | Rules guide and gameplay breakdown | Static Astro SSG |
| `/minesweeper/[lang]/high-scores` | Best times leaderboard by size and difficulty | Astro SSG with `<HighScoresView client:load />` |

---

## 🏗️ Architecture

```
apps/minesweeper/
├── astro.config.mjs             # Astro configuration with base '/minesweeper' and i18n
├── package.json
├── tsconfig.json
├── src/
│   ├── components/              # React game island components
│   │   ├── DefeatDialog/        # Game over dialog upon mine detonation
│   │   ├── Graphics/            # Mini preview graphics for Size & Difficulty
│   │   ├── HighScoresView/      # High scores leaderboard table
│   │   ├── MinesweeperBoard/    # Accessible CSS grid board container
│   │   ├── MinesweeperCell/     # Interactive cell with tactile buttons and icons
│   │   ├── MinesweeperGame/     # Root coordinator island with state hook
│   │   ├── MinesweeperGameHeader/ # Top bar with timer, mine counter, pause, settings
│   │   ├── MinesweeperIcons/    # SVG icons (Mine, Flag, Question)
│   │   ├── MinesweeperLobby/    # Lobby island with active game resume & option cards
│   │   ├── PauseOverlay/        # Obscuring pause backdrop with resume/restart
│   │   ├── SettingsDialog/      # Modal dialog for gameplay & theme toggles
│   │   └── VictoryDialog/       # Win celebration modal with time recap & best time
│   ├── engine/                  # Pure TypeScript Minesweeper engine
│   │   ├── board.ts             # Grid generation, safe first click, neighbor counts
│   │   ├── operations.ts        # Flood-fill reveal, flagging, chording
│   │   ├── storage.ts           # Asynchronous namespaced persistence client
│   │   └── types.ts             # Game state contracts and size/difficulty definitions
│   ├── layouts/                 # Astro layouts
│   │   ├── MinesweeperBaseLayout.astro # Base HTML document and meta
│   │   └── MinesweeperPageLayout.astro # Header, navigation, and footer
│   └── pages/                   # Multi-page routes
│       ├── index.astro          # Root language redirector
│       └── [lang]/              # Localized route pages
│           ├── index.astro      # Lobby
│           ├── game.astro       # Game canvas
│           ├── rules.astro      # Rules guide
│           └── high-scores.astro # Leaderboard
```

---

## 💻 Development Commands

From the monorepo root:

```bash
# Start Minesweeper local dev server
pnpm dev:minesweeper

# Typecheck TypeScript code
pnpm --filter @arcade/minesweeper typecheck

# Check formatting and lint rules with Biome
pnpm biome check apps/minesweeper
```
