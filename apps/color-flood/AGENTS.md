# @arcade/color-flood — Local Agent Invariants

- **Flood Fill Engine (`src/engine/`):** Deterministic generation via Mulberry32 PRNG; cluster originates at `(0, 0)`. On selecting $C_{\text{new}} \neq C_{\text{current}}$, BFS absorbs matching orthogonal neighbors. Calibrated move limits: `beginner` (8×8, 18), `easy` (10×10, 22), `medium` (14×14, 26), `hard` (18×18, 32).
- **Accessibility & Colorblindness:** Pair each color with a distinct geometric symbol overlay (`●`, `▲`, `■`, `◆`, `★`, `✚`). Support arrow keys, `Tab`, and `1`–`6` shortcuts on color buttons; announce remaining moves and percentage flooded via `<VisuallyHidden aria-live="polite">`.
- **Namespaces:** i18n `color-flood`; storage `createGameStorage('color-flood')`; OKLCH CSS custom properties only (zero hex colors).
