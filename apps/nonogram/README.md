# @arcade/nonogram

Classic, accessible Nonogram (Picross / Picture Logic) puzzle web application for the Arcade monorepo. Built as a hybrid application using **Astro** for static multi-page routing and internationalized layouts, and **React** for the zero-runtime interactive game canvas island.

---

## 🎯 Features

- **3 Difficulty Tiers & Sizing:**
  - **Easy:** 5×5 grid (quick onboarding / low deduction complexity)
  - **Medium:** 10×10 grid (balanced deduction runs)
  - **Hard:** 15×15 grid (complex overlapping sequences)
- **15 Curated Deterministic Starter Puzzles:** 5 iconic retro gaming icons per tier (Heart, Trophy, Pine Tree, Sailboat, Cottage, Space Invader, Mushroom, Ghost, Controller, Floppy Disk, Crown, Sword, Robot, Cabinet, Castle) — each mathematically verified with a unique, deterministically solvable solution without guessing.
- **Dual-Mode Controls:**
  - **Desktop:** Left-click to fill, right-click (or Shift+click) to mark `X` (flag as empty). Smooth click-and-drag line drawing that locks along horizontal or vertical axes and maintains the initial paint action across the gesture.
  - **Mobile/Touch:** Clear inline toggle for "Fill" vs. "Cross" mode with responsive touch drag. Native touch scrolling is prevented on the grid to eliminate layout shifts.
- **Visual Grid A11y & Readability:**
  - Thicker grid lines every 5 cells (both rows and columns) for quick visual scanning.
  - Clue headers on the top (columns) and left (rows) that auto-dim when completed.
  - Full keyboard navigation: arrow keys to move focus, `Space`/`Enter` to fill, `X` to cross, `Backspace`/`Delete` to erase, `Ctrl+Z`/`Ctrl+Y` to undo/redo.
  - High-contrast states adhering to WCAG 2.2 Level AA.
- **Pixel Art Victory State:** Reveals vibrant completed pixel art with color fill and records elapsed time and moves.
- **State Persistence:** Synced to `@arcade/lib-storage` under the `arcade::nonogram::` namespace:
  - `activeGame`: Preserves in-progress game state and timer across reloads.
  - `settings`: Preserves user preferences across sessions (auto-cross).
  - `solvedPuzzles`: Tracks completion status, best times, and moves for all catalog puzzles.
  - `lastConfig`: Remembers preferred difficulty and puzzle.
- **Multilingual Support:** Fully translated into English (`en`), German (`de`), French (`fr`), and Portuguese (`pt`) via `@arcade/lib-i18n`. Zero hardcoded UI strings.

---

## 🗺️ Routes & Pages

| Route | Description | Rendering Strategy |
| :--- | :--- | :--- |
| `/nonogram/` | Root redirector routing to preferred language | Static SSG + Client redirect script |
| `/nonogram/[lang]/` | Game Lobby with difficulty picker, puzzle gallery, and resume card | Astro SSG with `<NonogramLobby client:load />` |
| `/nonogram/[lang]/game` | Dedicated game canvas island | Astro SSG with `<NonogramGame client:only="react" />` |
| `/nonogram/[lang]/rules` | Rules guide and gameplay breakdown | Static Astro SSG |

---

## 💻 Development Commands

From the monorepo root:

```bash
# Start Nonogram local dev server
pnpm dev:nonogram

# Typecheck TypeScript code
pnpm --filter @arcade/nonogram typecheck

# Check formatting and lint rules with Biome
pnpm biome check apps/nonogram
```
