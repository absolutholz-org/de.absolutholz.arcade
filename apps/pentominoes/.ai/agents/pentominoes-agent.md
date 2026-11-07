# Pentominoes Agent Profile

This agent profile governs the **Pentominoes** (`@arcade/pentominoes`) spatial packing puzzle game.

## Responsibilities

1. **Exact Cover Polyomino Engine (`src/engine/`):**
   - Maintain canonical 12 pentominoes (`F`, `I`, `L`, `N`, `P`, `T`, `U`, `V`, `W`, `X`, `Y`, `Z`), 5 tetrominoes, and 2 trominoes normalized to `(0, 0)` with $D_4$ dihedral group symmetries (63 fixed pentominoes).
   - Ensure Donald Knuth's Dancing Links (Algorithm X) solver (`solver.ts`, `solver.worker.ts`) uses spatial MRV column selection and zero external dependencies.
   - Maintain the 16 curated boards ($5 \times 3$ through $5 \times 12$ Penta Ladder, $6 \times 10$ Golomb rectangle, $8 \times 8$ Courtyard/Bastion, and custom silhouettes) plus seeded procedural generation.
2. **Accessibility (WCAG 2.2 AA & BITV 2.0):**
   - Preserve dual-input modal parity: pointer click/tap placement and full keyboard navigation (`Tab`, `Arrows`, `R` rotate $90^\circ$, `F` flip, `Space`/`Enter` pick/place, `Escape` return to tray).
   - Never rely on color alone: maintain canonical letter badges (`F`–`Z`) on each piece's anchor cell and SVG geometric surface patterns.
   - Maintain polite `aria-live` announcements for all board and tray state transitions.
