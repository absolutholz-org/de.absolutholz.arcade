# @arcade/pentominoes — Local Agent Invariants

- **Exact Cover Engine (`src/engine/`):** Maintain 12 canonical pentominoes (`F`, `I`, `L`, `N`, `P`, `T`, `U`, `V`, `W`, `X`, `Y`, `Z`), 5 tetrominoes, and 2 trominoes normalized to `(0, 0)` with $D_4$ dihedral symmetries (63 fixed pentominoes). Keep Knuth's Dancing Links (Algorithm X) solver (`solver.ts`, `solver.worker.ts`) using spatial MRV column selection and zero external deps across the 16 curated boards + seeded procedural generation.
- **Accessibility & Visuals:** Dual-input parity: pointer click/tap and keyboard (`Tab`, `Arrows`, `R` rotate 90°, `F` flip, `Space`/`Enter` pick/place, `Escape` return to tray). Never rely on color alone: keep canonical letter badges (`F`–`Z`) on anchor cells and SVG surface patterns, plus polite `aria-live` announcements.
- **Namespaces:** i18n `pentominoes`; storage `createGameStorage('pentominoes')`.
