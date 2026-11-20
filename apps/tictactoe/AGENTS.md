# @arcade/tictactoe — Local Agent Invariants

- **Deterministic Engine (`src/engine/`):** Pure state transitions via `reducer.ts` with rigorous move validation (bounds, emptiness, `senderMark` parity, round completion gating) and alternating starting turn rotation on rematches ($X \leftrightarrow O$) per [ADR 0011](/docs/adr/0011-multiplayer-architecture.md). Maintain 100% test coverage in `reducer.test.ts`.
- **Accessibility & Controls:** WAI-ARIA 3×3 `grid` with roving `tabIndex` (arrow keys + `Space`/`Enter`) and polite `aria-live` turn/victory/draw announcements.
- **Namespaces:** i18n `tictactoe`; storage `createGameStorage('tictactoe')`.
