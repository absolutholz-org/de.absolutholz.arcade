# @arcade/codebreaker

**Codebreaker** is a single-player color-sequence deduction game in the `absolutholz Arcade` monorepo (`/codebreaker`).

## Rules Summary

Deduce the hidden sequence of $K$ colored pegs chosen from $C$ available colors within $M$ guess rows. After each submitted guess, grouped feedback pegs report:

1. **Exact matches** — right color in the right position.
2. **Color-only matches** — right color in the wrong position (computed in a strict two-pass algorithm without double-counting).

## Difficulty Presets

| Difficulty | Secret Length ($K$) | Colors ($C$) | Max Attempts ($M$) |
| :--- | :---: | :---: | :---: |
| Easy (`easy`) | 4 | 6 | 10 |
| Medium (`medium`) | 4 | 8 | 10 |
| Hard (`hard`) | 5 | 8 | 12 |

Duplicate colors are allowed by default and configurable in Settings (`allowDuplicates`).

## Architecture

- **Headless Engine (`src/engine/`):** Pure TypeScript modules (`types.ts`, `scorer.ts`, `generator.ts`, `solver.ts`, `history.ts`, `storage.ts`) with zero React/DOM imports.
- **Accessibility (WCAG 2.2 AA / BITV 2.0):** Every color peg renders a unique high-contrast geometric SVG shape alongside its OKLCH `light-dark()` color token, optional numeric index (`1`–`8`), full `@media (forced-colors: active)` support, WAI-ARIA grid/row semantics, keyboard controls, and polite `<output>` live announcements.
- **Storage:** Scoped via `createGameStorage('codebreaker')` with active session resume and `recordGameStats('codebreaker', ...)`.

## Development Commands

```bash
pnpm dev:codebreaker
pnpm --filter @arcade/codebreaker test
pnpm --filter @arcade/codebreaker typecheck
pnpm build:codebreaker
```
