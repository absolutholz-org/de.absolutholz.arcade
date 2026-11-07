# @arcade/pentominoes

Classic geometric polyomino exact-cover packing puzzle game for the Arcade monorepo.

## Architecture

- **Headless Engine (`src/engine/`):**
  - `pieces.ts`: Canonical 12 pentominoes (`F`, `I`, `L`, `N`, `P`, `T`, `U`, `V`, `W`, `X`, `Y`, `Z`), 5 tetrominoes, and 2 trominoes normalized to `(0, 0)` with $D_4$ dihedral group symmetries (rotation & reflection) and anchor label cells.
  - `solver.ts` & `solver.worker.ts`: Donald Knuth's Dancing Links (DLX / Algorithm X) exact-cover solver with spatial MRV column selection.
  - `generator.ts`: 16 curated boards (the $5 \times 3$ through $5 \times 12$ Penta Ladder, $6 \times 10$ Golomb rectangle, $8 \times 8$ Courtyard/Bastion, and architectural silhouettes) plus a deterministic seeded procedural generator.
  - `validator.ts`, `history.ts`, `storage.ts`: Pure validation, immutable undo/redo stack, and `@arcade/lib-storage` persistence.
- **Accessibility (WCAG 2.2 AA & BITV 2.0):**
  - Full dual-input parity (pointer drag/click-to-place and keyboard modal navigation via `Tab`, `Arrows`, `R`, `F`, `Space`/`Enter`, `Escape`).
  - Colorblind-independent piece identification combining OKLCH `light-dark(...)` fills, distinct SVG geometric surface textures, and high-contrast canonical letter badges (`F`–`Z`).
