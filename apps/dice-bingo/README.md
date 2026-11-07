# @arcade/dice-bingo

An interactive board puzzle game for the Arcade monorepo where players roll two six-sided dice (2d6) each turn and position their sums onto a spatial grid to construct poker hands across rows, columns, and diagonals.

## Technical Architecture

* **Framework:** Astro 4 & React 18 islands (`client:only="react"` for game playfield, `client:load` for lobby and subpages).
* **Styling:** Linaria CSS-in-JS adhering to static `data-*` state attributes and zero runtime prop interpolations.
* **Localization:** `@arcade/lib-i18n` across `en`, `de`, `fr`, and `pt`.
* **State & Persistence:** Namespaced via `@arcade/lib-storage` (`createGameStorage('dice-bingo')`).
* **Achievement Engine:** `@arcade/lib-medals` telemetry hooks tracking progressive score ladders and feat medals.
* **Component System:** `@arcade/lib-ui` design primitives (`GameLayout`, `GameHeader`, `GameStatusStrip`, `GameControlStrip`, `GameSettingsPanel`, `GameStatsDashboard`, `GameMedalGrid`, `DiceTray`, `Dialog`).

## Difficulty Tiers

| Tier | Grid Dimensions | Turns | Hand Rules | Special Features |
| :--- | :--- | :--- | :--- | :--- |
| `EASY` | 4×4 | 16 | 4-number scaled hands (4-kind, 4-straight, 3-kind, 2-pair, 1-pair) | Relaxed entry mode |
| `MEDIUM` | 5×5 | 25 | Standard 5-number poker rules | Classic Dice Bingo gameplay |
| `HARD` | 5×5 | 23 | Standard rules (scaled on obstacle lines) | 2 randomly pre-blocked obstacle cells |

## Hand Scoring Rules

* **Diagonals Score Double (×2)** on all boards.
* **5-Number Hands:**
  * Five of a Kind: 10 pts
  * Straight without a 7: 12 pts (unordered consecutive)
  * Straight with a 7: 8 pts
  * Full House (3-of-a-kind + pair): 8 pts
  * Four of a Kind: 6 pts
  * Three of a Kind: 3 pts
  * Two Pair: 3 pts
  * One Pair: 1 pt
* **4-Number Hands:**
  * Four of a Kind: 8 pts
  * 4-Number Straight: 6 pts
  * Three of a Kind: 3 pts
  * Two Pair: 2 pts
  * One Pair: 1 pt

## Development Commands

```bash
# Run local dev server
pnpm --filter @arcade/dice-bingo dev

# Run unit tests
pnpm --filter @arcade/dice-bingo test

# Run Biome lint & format check
pnpm exec biome check apps/dice-bingo
```
