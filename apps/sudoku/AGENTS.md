# @arcade/sudoku — Local Agent Invariants

- **Puzzle Engine (`src/engine/`):** Guarantee unique solutions via `countSolutions()` and 180° rotational symmetry for generated puzzles across `easy`, `medium`, `hard`, `veryHard`, `insane`, `inhuman` clue counts.
- **Accessibility & Controls:** WAI-ARIA `grid` announcing row/col, value, and candidate notes. Keyboard: arrow keys move, `1`–`9` digit entry, `Backspace`/`Delete` erase, `N` notes mode, `U` undo, `R` redo, `Esc`/`P` pause. Visually obscure board when paused.
- **Namespaces:** i18n `sudoku`; storage `createGameStorage('sudoku')`.
