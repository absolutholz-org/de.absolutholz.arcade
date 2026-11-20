# @arcade/lib-games — Game Taxonomy & Registry Invariants (ADR 0009)

All game catalog entries must conform strictly to [ADR 0009](/docs/adr/0009-game-taxonomy-and-metadata-architecture.md).

## 1. Source of Truth & Boundaries
- **Centralized Registry Only:** Taxonomy schemas (`src/taxonomy.ts`), contracts (`src/types.ts`), and manifests (`src/registry.ts`) live exclusively here. Never export discovery manifests from `apps/*`.
- **Zero External Validators:** Keep `@arcade/lib-games` free of `zod`/`valibot`. Use exported `as const` tuples, narrow type guards, and `validateGameMetadata` / `validateGameRegistry`.
- **BASE-07 (i18n) Boundary:** Never store display titles or descriptions in `GameMetadata`. UI consumers resolve titles/descriptions via `game.i18nNamespace` and taxonomy labels via the `taxonomy` namespace in `@arcade/lib-i18n`. Never render raw kebab-case slugs.

## 2. Classification & Tagging Rubric
Every `GameMetadata` entry must define:
- **Identity:** `id` (lowercase slug matching `apps/[id]`, registered in `GAME_ID_LOOKUP`), `route: '/${id}'`, `assets.icon` (emoji), `i18nNamespace: id`.
- **Category (`category`):** `primary` from `GAME_CATEGORIES` (`logic-deduction`, `spatial-puzzle`, `word-trivia`, `casual-sorting`, `card-board`, `party-duel`) and optional distinct `secondary`.
- **Tag Facets (`tags`):** Each array (`mechanics`, `inputs`, `pacing`, `modes`, `sessionLength`) must have `>= 1` tag and zero duplicates:
  - `inputs` (WCAG 2.2 audit): `touch-optimized` (>=24×24px), `keyboard-controls` (roving `tabIndex`/bindings), `tap-only` (only if 100% of pointer actions work via single tap without dragging), `drag-and-drop`, `dual-mode-toggle`, `direct-typing`.
  - `pacing`: `zen-untimed` (only if explicit untimed mode exists), `speedrun-timer`, `countdown-arcade`, `mistake-penalty`, `undo-friendly`, `move-efficiency`, `turn-paced`.
  - `mechanics`, `modes`, `sessionLength`: select all matching literals from `src/taxonomy.ts`.

## 3. Verification
- Only append new taxonomy slugs in `src/taxonomy.ts` when existing tags cannot express a mechanic/mode; update `taxonomy.ts`, `registry.ts`, `@arcade/lib-i18n`, and conformance tests atomically.
- Run `pnpm --filter @arcade/lib-games typecheck` and `pnpm test:conformance` after any change.
