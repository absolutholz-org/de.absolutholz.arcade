# @arcade/minesweeper — Local Agent Invariants

- **Engine (`src/engine/`):** Guarantee safe first click opening an initial area (unless disabled in settings), accurate 8-neighbor counts, 0-neighbor flood-fill cascade, and chording (`C` or double-click when adjacent flags match the number). Support sizes `xs`, `sm`, `md`, `lg`, `xl` and mine ratios `simple` (10%), `medium` (15%), `hard` (20%), `expert` (25%).
- **Accessibility & Controls:** WAI-ARIA `grid` with arrow-key movement, `Space`/`Enter` reveal, `F`/`M` flag, `C` chord, `Esc`/`P` pause. Visually obscure board when paused.
- **Namespaces:** i18n `minesweeper`; storage `createGameStorage('minesweeper')`.
