---
id: add-levels
name: Add Game Presets and Levels
description: Generates, validates, and registers additional curated preset levels for any arcade game by delegating to its headless engine and solver.
targets: ["apps/**/src/engine/presets/**/*", "apps/**/src/engine/types.ts"]
---

# Add Levels & Puzzle Packs Workflow

Use this skill when adding or expanding curated puzzle packs for an existing game.

## Phase 1: Engine Introspection

1. Inspect `apps/[gameId]/src/engine/types.ts` to extract:
    - The `DifficultyLevel` union.
    - The preset definition interface (e.g. `CompactPreset`, board representation).
2. Inspect `apps/[gameId]/src/engine/presets/index.ts` to see:
    - Existing preset ID conventions (e.g. `easy-1`, `medium-12`).
    - Coordinate, string, or matrix serialization format.
3. Inspect `apps/[gameId]/src/engine/solver.ts` and `generator.ts` to see what generation/validation functions are exposed.

## Phase 2: Generation & Uniqueness Verification

1. Run a one-off headless generation script using `generator.ts` and `solver.ts` to produce the requested number of puzzles for the target difficulty.
2. Every candidate puzzle MUST be verified by the engine's solver to guarantee:
    - Exactly one unique solution ($S = 1$).
    - Solvability falls within the target tier's deduction rules.

## Phase 3: Registration & Verification

1. Append the new compact preset definitions to `apps/[gameId]/src/engine/presets/index.ts`.
2. Run the game's test suite:
    ```bash
    pnpm --filter @arcade/[gameId] test
    ```
