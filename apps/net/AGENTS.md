# @arcade/net — Local Agent Invariants

- **Spanning Tree & Bitwise Engine (`src/engine/`):** Generate connected spanning trees via randomized Prim's algorithm from `(rootRow, rootCol)` with scrambled initial rotations. Use bitwise direction masks (N=1, E=2, S=4, W=8): CW `((mask << 1) | (mask >> 3)) & 0b1111`, CCW `((mask >> 1) | ((mask & 1) << 3)) & 0b1111`, and BFS from root for energized states/leaking ports. Tiers: `easy` (5×5), `medium` (7×7), `hard` (9×9), `expert` (11×11).
- **Accessibility & Styling:** WAI-ARIA `grid` with roving `tabIndex`; `Arrow` keys move, `Space`/`Enter` CW, `Shift+Space`/`Shift+Enter` CCW, `L` lock tile, `Z`/`U` undo, `Y` redo, `P` pause. Set dynamic tile rotation via CSS custom properties (`--tile-angle`), never runtime Linaria prop interpolations.
- **Namespaces:** i18n `net`; storage `createGameStorage('net')`.
