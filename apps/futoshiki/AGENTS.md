# @arcade/futoshiki — Local Agent Invariants

- **Puzzle Engine (`src/engine/`):** Guarantee unique solutions (`countSolutions === 1`), strict logical solvability (`solveDeductively().solved === true` without guessing), and inequality necessity (`requiresInequalities === true`) across `easy` (4×4), `medium` (5×5), `hard` (6×6), and `expert` (7×7).
- **Accessibility & Controls:** Visual `(2N - 1) × (2N - 1)` CSS Grid (`subgrid`) over a strict $N \times N$ WAI-ARIA `grid` with roving `tabIndex` and dynamic adjacent inequality announcements in each cell's `aria-label`. Keyboard: arrow keys move, `1`–`N` digit/note entry, `Backspace`/`Delete` erase, `N` notes mode, `H` logical hint, `U`/`Z` undo, `R`/`Y` redo, `Esc`/`P` pause. Visually obscure board when paused.
- **Namespaces:** i18n `futoshiki`; storage `createGameStorage('futoshiki')`.
