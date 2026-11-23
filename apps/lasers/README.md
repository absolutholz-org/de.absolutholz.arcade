# @arcade/lasers — Laser & Mirrors

Single-player optical beam-routing puzzle game for **absolutholz Arcade**.

## Overview

Rotate mirrors (`/` and `\`) and half-silvered beam splitters on a responsive grid to route laser beams from fixed emitters into every target receiver. Higher difficulties introduce beam splitting, locked mirrors, additive RGB color mixing (`Red + Blue = Magenta`, `Red + Green = Yellow`, `Blue + Green = Cyan`), decoy mirrors, and par move targets.

## Difficulty Matrix

| Tier | Grid | Mechanics |
| :--- | :--- | :--- |
| **Easy** | `5 × 5` | 1 emitter, 1 target, 3–4 rotatable mirrors, 1–2 walls |
| **Medium** | `7 × 7` | 1 emitter, 2 targets, 1 beam splitter, 5–7 rotatable mirrors, fixed mirrors, walls |
| **Hard** | `8 × 8` | 2 emitters, additive color mixing, mixed-color targets, splitters, fixed mirrors |
| **Expert** | `9 × 9` | Multi-color mixing, splitters, decoy rotatable mirrors, fixed mirrors, par challenge |

## Engine Architecture

- `src/engine/types.ts`: Pure domain models, RGB bitmask color constants, and non-color geometric symbols.
- `src/engine/prng.ts`: Deterministic Mulberry32 PRNG.
- `src/engine/raytrace.ts`: Synchronous deterministic grid ray-tracer with additive segment mixing and `(row, col, dir, colorMask)` loop-termination guard.
- `src/engine/generator.ts`: Constructive puzzle generator carving guaranteed-solvable beam paths before scrambling rotatable mirrors.
- `src/engine/history.ts`: Pure immutable Undo/Redo stack.
- `src/engine/storage.ts`: Scoped persistence via `createGameStorage('lasers')` and `recordGameStats`.

## Development Commands

```bash
pnpm dev:lasers
pnpm --filter @arcade/lasers test
pnpm --filter @arcade/lasers typecheck
pnpm build:lasers
```
