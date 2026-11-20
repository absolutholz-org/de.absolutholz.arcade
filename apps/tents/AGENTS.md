# @arcade/tents — Local Agent Invariants

- **Puzzle Engine (`src/engine/`):** Guarantee unique solutions satisfying 1-to-1 orthogonal tree-to-tent pairing (maximum bipartite matching), Chebyshev non-touching ($D_\infty > 1$), exact `rowClues`/`colClues` counts, and immutable pre-placed trees. Tiers: `easy` (6×6, 5 trees), `medium` (8×8, 8 trees), `hard` (10×10, 12 trees), `expert` (12×12, 18 trees).
- **Accessibility & Controls:** WAI-ARIA `grid` (`aria-selected`, `aria-readonly`) with arrow keys, `Space`/`Enter` tent, `G` grass, `Backspace`/`Delete` clear, `Ctrl`/`Cmd`+`Z` undo, `Esc`/`P` pause. Obscure board and clues when paused.
- **Namespaces:** i18n `tents`; storage `createGameStorage('tents')`.
