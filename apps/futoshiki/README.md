# @arcade/futoshiki

**Futoshiki** (`futoshiki`) is a single-player Latin-square inequality deduction puzzle built for `absolutholz Arcade`.

## Rules Summary

- Fill an **N × N** grid with digits `1` through `N` so each digit appears exactly once in every row and column.
- Satisfy every inequality sign (`<`, `>`, `∧`, `∨`) placed between adjacent cells.
- Every generated puzzle is verified by the deterministic deductive solver to have a **unique solution solvable strictly by logic without guessing**, and strictly requires its inequality signs.

## Difficulty Matrix

| Tier | Grid Size | Characteristics |
| :--- | :--- | :--- |
| `easy` | 4×4 | Compact grid ideal for learning inequality chains |
| `medium` | 5×5 | Balanced Latin-square and comparison logic |
| `hard` | 6×6 | Multi-step range tightening and hidden singles |
| `expert` | 7×7 | Deep deduction across larger chains |

## Architecture

- `src/engine/`: Pure TypeScript headless engine (`types.ts`, `validator.ts`, `solver.ts`, `generator.ts`, `history.ts`, `storage.ts`) with zero React/DOM imports.
- `src/components/`: Linaria-styled React islands (`FutoshikiBoard` using a visual `(2N - 1) × (2N - 1)` CSS Grid with `subgrid` over an $N \times N$ semantic WAI-ARIA grid, `FutoshikiKeypad`, `FutoshikiGame`, `FutoshikiLobby`).
- `src/pages/`: 6 canonical localized Astro routes + root language redirect (`en`, `de`, `fr`, `pt`).
- `src/config/`: Declarative `FUTOSHIKI_SETTINGS_CONFIG` and `FUTOSHIKI_MEDAL_DEFINITIONS`.

## Development Commands

```bash
pnpm dev:futoshiki
pnpm --filter @arcade/futoshiki test
pnpm --filter @arcade/futoshiki typecheck
pnpm build:futoshiki
```
