# @arcade/tracks — Local Agent Invariants

- **Puzzle Engine (`src/engine/`):** Guarantee unique solutions where a single continuous, non-branching, non-crossing track connects `start` to `end`, row/column segment counts match `rowClues`/`colClues`, all `fixedCells` retain their `TrackType` on the path, and zero disconnected segments exist. Tiers: `easy` (6×6), `medium` (8×8), `hard` (8×8), `expert` (10×10).
- **Accessibility & Controls:** WAI-ARIA `grid` with arrow keys, `Space`/`Enter` place/cycle track, `X`/`M` cross, `Backspace`/`Delete` clear, `Z`/`U` undo, `Y`/`R` redo, `Esc`/`P` pause. Obscure board and clues when paused.
- **Namespaces:** i18n `tracks`; storage `createGameStorage('tracks')`.
