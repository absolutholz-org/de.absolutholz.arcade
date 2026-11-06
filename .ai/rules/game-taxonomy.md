# Game Taxonomy & Metadata Rules (ADR 0009)

All game catalog entries registered in `@arcade/lib-games` (`libraries/games`) must conform strictly to [ADR 0009: Game Taxonomy and Metadata Architecture](/docs/adr/0009-game-taxonomy-and-metadata-architecture.md).

## 1. Source of Truth & Package Boundary

- **Centralized Registry Only:** Taxonomy schemas (`libraries/games/src/taxonomy.ts`), contracts (`libraries/games/src/types.ts`), and manifests (`libraries/games/src/registry.ts`) live exclusively in `@arcade/lib-games`.
- **Topological Invariant (ADR 001):** Never export discovery manifests from `apps/[gameId]` for consumption by `apps/hub` or `@arcade/lib-games`. Libraries must never import from `apps/*`, and apps must never import from sibling apps.
- **Zero External Validation Dependencies:** Keep `@arcade/lib-games` free of runtime validation dependencies (`zod`, `valibot`, etc.). Use the exported `as const` tuples, narrow type guards, and `validateGameMetadata` / `validateGameRegistry` validators.

## 2. How Agents Must Classify & Tag Newly Created Games

When specifying (Phase 2 of `new-game` skill) or activating a new game in `GAME_REGISTRY`, populate every field of `GameMetadata`:

### A. Identity & Routing Fields
- `id`: Lowercase canonical `GameId` slug matching `apps/[id]`. Also add `[id]: true` to `GAME_ID_LOOKUP` in `libraries/games/src/taxonomy.ts`.
- `route`: Must equal `'/${id}'`.
- `assets`: Visual assets (icon emoji in `assets.icon`).
- `i18nNamespace`: Must equal `id`.
- **ADR 007 Boundary:** No display titles, names, or descriptions are stored in `GameMetadata`. UI components (`apps/hub`, `@arcade/lib-ui`) must resolve user-facing localized titles and descriptions exclusively from `@arcade/lib-i18n` using `game.i18nNamespace`, and resolve category/tag labels from the `taxonomy` namespace. Never display raw kebab-case taxonomy slugs (e.g. `'logic-deduction'`) in the DOM.

### B. Genre Category (`category`)
Assign one `primary` category and an optional `secondary` category from `GAME_CATEGORIES` (`secondary` **must not** equal `primary`):
- `'logic-deduction'`: Constraint-satisfaction, number, clue, or deduction puzzles (e.g. Sudoku, Minesweeper, Nonogram, Star Battle, Tents).
- `'spatial-puzzle'`: Geometric, planar-graph, topological, or route-layout puzzles (e.g. Untangle; secondary for Bridges, Tracks, Net, Nonogram).
- `'word-trivia'`: Lexicon, spelling, anagram, vocabulary, or trivia games (e.g. Anagram Scramble).
- `'casual-sorting'`: Relaxed container-sorting, grouping, or tactile organization games (e.g. Liquid Sort).
- `'card-board'`: Classic tabletop board, grid-alignment, dice, or card games (e.g. Tic-Tac-Toe, Connect Four, Uno).
- `'party-duel'`: Social, memory-duel, or quick-turn competitive games (e.g. Memory, pass-and-play duels).

### C. Orthogonal Tag Facets (`tags`)
Every facet array (`mechanics`, `inputs`, `pacing`, `modes`, `sessionLength`) **must contain at least 1 tag** and **zero duplicates**:

1. **`mechanics` (`MECHANIC_TAGS`):** Tag all core cognitive/spatial mechanisms driving gameplay (`grid-based`, `pathfinding`, `deduction`, `sorting`, `pattern-recognition`, `color-matching`, `number-logic`, `word-forming`, `graph-topology`, `tile-rotation`, `hazard-avoidance`, `memory-recall`, `hand-management`, `alignment-capture`).
2. **`inputs` (`INPUT_TAGS`) — Strict WCAG 2.2 Audit Required:**
   - `'touch-optimized'`: Mandatory for all games meeting the ≥24×24 CSS px touch target requirement (ADR 006).
   - `'keyboard-controls'`: Mandatory for all games implementing WAI-ARIA roving `tabIndex` grid navigation or full keyboard bindings.
   - `'tap-only'`: Assign **only** if 100% of pointer gameplay actions can be executed via discrete single taps/clicks without dragging (WCAG 2.2 SC 2.5.7).
   - `'drag-and-drop'`: Assign if the game supports or requires pointer drag/swipe gestures (e.g. line drawing in Nonogram/Tracks, node dragging in Untangle). Note: Games supporting both single-tap and optional drag carry both `'tap-only'` and `'drag-and-drop'`; games where pointer play requires dragging omit `'tap-only'`.
   - `'dual-mode-toggle'`: Assign when an on-screen toggle switches primary touch actions (e.g. Reveal/Flag, Fill/Cross, Digit/Notes).
   - `'direct-typing'`: Assign when physical alphanumeric keys directly input characters/digits (e.g. Anagram letter typing, Sudoku `1`–`9` entry).
3. **`pacing` (`PACING_TAGS`):**
   - `'zen-untimed'`: Assign **only** when the game offers an explicit untimed Zen or Casual mode without clock or life pressure.
   - `'speedrun-timer'`: Assign when rounds track elapsed completion time for personal bests or speed medals.
   - `'countdown-arcade'`: Assign when gameplay runs against an expiring countdown clock.
   - `'mistake-penalty'`: Assign when invalid moves detonate hazards, deduct lives/hearts, or end the round.
   - `'undo-friendly'`: Assign when players have step-by-step Undo/Redo move recovery.
   - `'move-efficiency'`: Assign when move/pour/rotation counts are benchmarked or tracked as primary efficiency metrics.
   - `'turn-paced'`: Assign for alternating turn-based games without real-time clock pressure.
4. **`modes` (`MODE_TAGS`):** Tag supported player topologies and level sources (`single-player`, `pass-and-play`, `multiplayer-turn-based`, `daily-challenge`, `procedural-endless`, `curated-levels`, `vs-ai`).
5. **`sessionLength` (`SESSION_LENGTH_TAGS`):** Tag all realistic completion buckets across supported difficulty tiers (`snack-under-3m`, `standard-5-10m`, `deep-15m-plus`).

## 3. Taxonomy Evolution & Verification

- **Adding New Slugs:** Only append a new slug to `libraries/games/src/taxonomy.ts` when existing tags genuinely cannot express a distinct mechanic or mode. Keep slugs lowercase `kebab-case`.
- **Renaming / Removing Slugs:** Breaking changes to taxonomy literals must atomically update `taxonomy.ts`, `registry.ts`, any `@arcade/lib-i18n` label maps, and conformance tests in a single commit.
- **Mandatory Conformance Check:** Always run `pnpm --filter @arcade/lib-games typecheck` and `pnpm test:conformance` after modifying taxonomy schemas or `GAME_REGISTRY`.
