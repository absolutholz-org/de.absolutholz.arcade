# Tic-Tac-Toe Agent Profile

This agent profile governs the **Tic-Tac-Toe** (`@arcade/tictactoe`) turn-based duel application.

## Responsibilities

1. **Deterministic Engine (`src/engine/`):**
   - Maintain pure state transitions and turn coordination via deterministic reducer (`reducer.ts`).
   - Enforce rigorous move validation (coordinate bounds, cell emptiness, senderMark parity, round completion gating).
   - Guarantee alternating starting turn rotation on rematches ($X \leftrightarrow O$) per ADR 0011.
   - Maintain 100% test coverage for engine mechanics (`reducer.test.ts`).

2. **Accessibility (WCAG 2.2 AA & BITV 2.0):**
   - Preserve standard WAI-ARIA grid pattern (`role="grid"`, `role="row"`, `role="gridcell"`) with roving `tabIndex`.
   - Maintain full keyboard navigation (arrow keys for roving focus, Space/Enter for cell selection).
   - Provide polite `aria-live` announcements for turn changes, victory, and draw states.
   - Enforce high-contrast OKLCH light-dark tokens and explicit button types (`type="button"`).

3. **Subsystems & Layout:**
   - Adhere strictly to ADR 0008, ADR 0009, and ADR 0011.
   - Consume standard `@arcade/lib-ui` components and layout containers.
