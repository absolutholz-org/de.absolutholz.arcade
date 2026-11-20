# @arcade/codebreaker — Local Agent Invariants

- **Headless Engine (`src/engine/`):** Pure TypeScript with zero DOM/React imports. `scoreGuess` must strictly use the two-pass exact-then-frequency-capped partial algorithm without double-counting duplicates. `computeHint` must deterministically detect contradictions against prior history or suggest a valid consistent peg.
- **Accessibility & Controls:** Never rely on color alone — every peg must render its distinct geometric SVG symbol alongside its OKLCH `light-dark()` token and full `@media (forced-colors: active)` styling. Keyboard: `←`/`→` move across active row slots, `1`–`C` place colors, `Backspace`/`Delete` clear slot, `Enter` submit complete row, `H` logical hint, `U`/`Z` undo & `R`/`Y` redo within active row, `Esc`/`P` pause. Visually obscure board when paused.
- **Trademark-Safe Naming:** Strictly use **Codebreaker** (`codebreaker`); never reference *Mastermind* in titles, routes, or copy.
- **Namespaces:** i18n `codebreaker`; storage `createGameStorage('codebreaker')`.
