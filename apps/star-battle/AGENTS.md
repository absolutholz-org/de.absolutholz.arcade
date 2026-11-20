# @arcade/star-battle — Local Agent Invariants

- **Puzzle Engine (`src/engine/`):** Guarantee unique solutions where placed tokens satisfy exactly 1 token per row, column, and contiguous region, with no two tokens touching orthogonally or diagonally. Tiers: `easy` (6×6), `medium` (8×8), `hard` (10×10), `expert` (12×12).
- **Accessibility & Controls:** WAI-ARIA `grid` with arrow keys, `Space`/`Enter` activate, `S`/`C`/`Q` Star, `X`/`M` mark, `Backspace`/`Delete` erase, `Z`/`U` undo, `Y`/`R` redo, `Esc`/`P` pause. Visually obscure board when paused.
- **Namespaces:** i18n `star-battle`; storage `createGameStorage('star-battle')`.
