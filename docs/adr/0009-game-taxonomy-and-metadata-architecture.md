# 0009. Game Taxonomy and Metadata Architecture

- **Status:** Accepted
- **Date:** 2026-11-03
- **Deciders:** Engineering Team
- **Consulted:** Monorepo Catalog & Hub Architecture Review
- **Supersedes / Extends:** Extends [0005. Standard Arcade Game Integration Contract](./0005-standard-game-contract.md) and aligns with [ADR 001](./architecture-decision-records.md#adr-001-monorepo-topology-and-domain-model), [ADR 002](./architecture-decision-records.md#adr-002-build-tools-and-static-output-generation), [ADR 006](./architecture-decision-records.md#adr-006-accessibility-standard-wcag-22-level-aa), [ADR 007](./architecture-decision-records.md#adr-007-core-localization-i18n-strategy), and [0008. Standard Game Shell & Per-Game Subsystem Contracts](./0008-game-shell-and-subsystem-contract.md)

---

## Context and Problem Statement

The `@arcade/monorepo` catalog has grown beyond a handful of grid puzzles into a diverse portfolio spanning number logic (`sudoku`), hazard deduction (`minesweeper`), picture logic (`nonogram`), region placement (`star-battle`), railway and island pathfinding (`tracks`, `bridges`, `net`), bipartite constraint matching (`tents`), container sorting (`watersort`), multilingual word scrambles (`anagram`), and continuous planar graph untangling (`untangle`). Furthermore, the product roadmap introduces turn-based board games, card games, pass-and-play social games, and asynchronous online multiplayer titles (such as Tic-Tac-Toe, Uno, and Memory).

Previously, `GameDefinition` in `@arcade/lib-games` (`libraries/games`) captured only minimal routing and icon fields (`id`, `name`, `route`, `assets`, `i18nNamespace`). Without a formal taxonomy and metadata contract:

1. **Flat Discovery Surface:** As the catalog scales past 10+ games, a single flat list in `apps/hub` cannot support high-level genre browsing (categories) alongside orthogonal faceted filtering (mechanics, session duration, pacing).
2. **Opaque Input & Accessibility Requirements:** Because the PWA targets both mobile touchscreens and desktop keyboards under strict WCAG 2.2 Level AA / BITV 2.0 compliance (ADR 006), players and discovery UIs need structured metadata distinguishing discrete `tap-only` games (WCAG 2.2 SC 2.5.7) from `drag-and-drop` or `direct-typing` experiences.
3. **Undifferentiated Pacing & Session Commitment:** Relaxed untimed solvers (`zen-untimed`) have fundamentally different intent than players seeking a 2-minute countdown word rush (`countdown-arcade`, `snack-under-3m`) or a 20-minute `deep-15m-plus` deduction puzzle with `mistake-penalty`.
4. **No Lifecycle or Multiplayer Readiness:** Upcoming turn-based (`pass-and-play`, `multiplayer-turn-based`, `vs-ai`) and pre-release (`beta`, `coming-soon`) titles cannot be represented safely in the shared catalog without risking broken static links or ad-hoc per-component hardcoded arrays.

We need a type-safe, zero-dependency taxonomy and metadata architecture that remains strictly decoupled from UI presentation layers while preserving monorepo package boundaries.

---

## Decision Drivers

- **Strict Topological Unidirectionality (ADR 001):** `apps/*` must never import one another, and `libraries/*` must never import from `apps/*`.
- **Zero-Runtime Static Build Compatibility (ADR 002):** Discovery metadata must be statically importable at Astro SSG build time (`apps/hub`) and executable directly by Node deployment/conformance scripts (`node --experimental-strip-types`) without bundling React, game engines, or heavy third-party schema libraries.
- **Orthogonal Faceted Classification:** High-level browsing requires mutually distinct primary categories, whereas gameplay mechanics, input modalities, pacing, player modes, and session durations are orthogonal multi-valued facets.
- **Localization Separation (ADR 007):** Taxonomy identifiers must be canonical, language-neutral kebab-case string literals, never user-facing hardcoded UI copy.
- **Compile-Time Exhaustiveness + Runtime Integrity:** Every `GameId` must be guaranteed to satisfy the schema at compile time via TypeScript literal types and verified at test time via zero-dependency validators.

---

## Considered Options

1. **Option 1: Distributed Per-App Metadata Manifests.** Each `apps/[gameId]` exports a `manifest.ts` file consumed directly by `apps/hub` or aggregated dynamically by `@arcade/lib-games`.
   - *Rejected:* Directly violates **ADR 001** (`apps/hub` importing `apps/[gameId]` couples standalone deployable apps; `@arcade/lib-games` importing `apps/*` inverts library-to-app dependency direction and creates circular dependencies once apps consume `@arcade/lib-games` settings contracts).
2. **Option 2: Third-Party Runtime Schema Validation (e.g., Zod / Valibot) in `@arcade/lib-games`.** Define schemas via an external validation package added to `pnpm-workspace.yaml`.
   - *Rejected:* Introduces an external runtime dependency into `@arcade/lib-games` (currently zero runtime dependencies), increases client bundle weight whenever metadata helpers are imported in islands, and complicates raw `node --experimental-strip-types` execution in CI scripts.
3. **Option 3: Centralized Source-of-Truth Registry in `@arcade/lib-games` with Pure TypeScript `as const` Contracts & Zero-Dependency Validators (Selected).** Define canonical taxonomy literal tuples, TypeScript interfaces, runtime type guards/validators, and `GAME_REGISTRY` centrally inside `@arcade/lib-games`, verified continuously by `tests/architecture/game-structure.test.ts`.

---

## Decision Outcome

Chosen Option: **Option 3**. `@arcade/lib-games` (`libraries/games`) is the single authoritative source of truth for game taxonomy schemas, validation contracts, and catalog metadata manifests.

### 1. Multi-Faceted Taxonomy Model

The taxonomy separates **hierarchical genre placement** (`category`) from **five orthogonal tag facets** (`tags`):

| Dimension | Cardinality | Purpose | Canonical Values |
| :--- | :--- | :--- | :--- |
| **`category`** | `primary` (required) + `secondary` (optional, distinct) | High-level genre grouping for hub navigation sections and primary shelves. | `logic-deduction`, `spatial-puzzle`, `word-trivia`, `casual-sorting`, `card-board`, `party-duel` |
| **`tags.mechanics`** | `1..N` unique | Core cognitive or spatial puzzle/game loop mechanics. | `grid-based`, `pathfinding`, `deduction`, `sorting`, `pattern-recognition`, `color-matching`, `number-logic`, `word-forming`, `graph-topology`, `tile-rotation`, `hazard-avoidance`, `memory-recall`, `hand-management`, `alignment-capture` |
| **`tags.inputs`** | `1..N` unique | Supported pointer, keyboard, and accessibility interaction modalities. | `touch-optimized`, `keyboard-controls`, `drag-and-drop`, `tap-only`, `dual-mode-toggle`, `direct-typing` |
| **`tags.pacing`** | `1..N` unique | Temporal pressure, error punishment, and move recovery semantics. | `zen-untimed`, `speedrun-timer`, `mistake-penalty`, `undo-friendly`, `countdown-arcade`, `move-efficiency`, `turn-paced` |
| **`tags.modes`** | `1..N` unique | Player topology and content generation/challenge structure. | `single-player`, `pass-and-play`, `multiplayer-turn-based`, `daily-challenge`, `procedural-endless`, `curated-levels`, `vs-ai` |
| **`tags.sessionLength`** | `1..N` unique | Typical completion time across supported difficulty/board tiers. | `snack-under-3m`, `standard-5-10m`, `deep-15m-plus` |

#### Input & Accessibility Tag Semantics (WCAG 2.2 Alignment)
- `tap-only` must **only** be assigned when every pointer interaction in gameplay can be completed via discrete single-point taps/clicks without requiring continuous dragging movements (aligning with WCAG 2.2 SC 2.5.7). Games supporting optional drag gestures alongside full single-tap operation (e.g., `nonogram`, `tracks`, `star-battle`, `bridges`) carry both `tap-only` and `drag-and-drop`; games whose pointer interaction inherently requires dragging (e.g., `untangle`) carry `drag-and-drop` without `tap-only` while providing `keyboard-controls` for non-pointer accessibility.
- `dual-mode-toggle` designates games that expose an explicit on-screen mode switch (e.g., Reveal/Flag, Fill/Cross, Digit/Notes) bridging desktop secondary-click actions to touch screens.

### 2. Unified `GameMetadata` Contract & Structural Isolation

`GameMetadata` in `libraries/games/src/types.ts` captures exclusively structural and taxonomy metadata into an immutable record:

- `id: GameId` — Canonical lowercase slug matching `apps/[id]` and storage namespace `arcade::[id]::*`.
- `route: '/${GameId}'` — Root URL subpath.
- `assets: GameAssets` — Emoji icon and optional artwork descriptors.
- `i18nNamespace: GameId` — Mandatory namespace binding in `@arcade/lib-i18n`.
- `category: GameCategoryAssignment` — `{ primary: GameCategory; secondary?: GameCategory }` where `secondary !== primary`.
- `tags: TaxonomyTags` — Non-empty, deduplicated arrays across all five facets.

To maintain strict separation of concerns (ADR 007), presentation text (`title`, fallback names, and descriptions) is completely stripped from `GameMetadata` and `GAME_REGISTRY`. All titles and descriptions are retrieved dynamically via `@arcade/lib-i18n` using the game's `i18nNamespace`.

`GameDefinition` is preserved as a type alias (`export type GameDefinition = GameMetadata`) to maintain seamless compatibility across existing consumers (`apps/hub`, `libraries/ui`).

### 3. Localization Boundary (ADR 007 Compliance)

All user-facing UI components (`apps/hub`, `@arcade/lib-ui`) **must never** render raw taxonomy slugs (e.g., `'logic-deduction'`) directly in the DOM, and must resolve localized game titles and descriptions from `@arcade/lib-i18n` via `game.i18nNamespace`. Category IDs and Tag keys are mapped to human-readable strings across all supported locales via the shared `taxonomy` namespace in `@arcade/lib-i18n`.

### 4. Validation Strategy

Integrity is enforced across two complementary layers with zero external runtime dependencies:

1. **Compile-Time Static Verification:**
   - Every taxonomy vocabulary is declared as a frozen `as const` tuple (`GAME_CATEGORIES`, `MECHANIC_TAGS`, `INPUT_TAGS`, `PACING_TAGS`, `MODE_TAGS`, `SESSION_LENGTH_TAGS`), from which union types are derived via `(typeof TUPLE)[number]`.
   - `GAME_REGISTRY` is typed as `Readonly<Record<GameId, GameMetadata>>`, and internal `GameId` lookup maps use `satisfies Readonly<Record<GameId, true>>`, guaranteeing compile errors if any game or field is omitted.
2. **Runtime Type Guards & Conformance Gate:**
   - `libraries/games/src/taxonomy.ts` exports narrow literal type guards (`isGameCategory`, `isGameMechanicTag`, etc.) and structural validators (`validateGameMetadata`, `isValidGameMetadata`, `assertValidGameMetadata`, `validateGameRegistry`) enforcing invariants that TypeScript's type system alone cannot express concisely (non-empty facet arrays, absence of duplicate tags within a facet, `category.secondary !== category.primary`, and `route === '/${id}'`).
   - `tests/architecture/game-structure.test.ts` (`pnpm test:conformance`) asserts bidirectional parity between `apps/*` directories and `GAME_REGISTRY` (for playable installed apps) and validates every registered manifest via `validateGameRegistry`.

---

## Consequences

### Positive

- **Zero-Cyclic, Zero-Bloat Package Graph:** `@arcade/lib-games` stays a leaf library with zero runtime dependencies, consumable identically by Astro SSG pages, React UI islands, and Node `--experimental-strip-types` CI scripts.
- **Future-Proof Roadmap Support:** Upcoming turn-based, pass-and-play, card/board, and online multiplayer games (`card-board`, `party-duel`, `pass-and-play`, `multiplayer-turn-based`, `vs-ai`, `turn-paced`) are first-class citizens in the schema today, and unshipped titles can be staged via `releaseStatus: 'coming-soon'` or `'beta'` once Hub consumers filter by release status.
- **Explicit Accessibility Metadata:** Faceted input indicators (`tap-only`, `drag-and-drop`, `keyboard-controls`, `dual-mode-toggle`, `direct-typing`) allow players with motor or device constraints to identify compatible games immediately.

### Negative / Trade-offs

- **Centralized Registration Step:** Adding a new game requires updating `libraries/games/src/types.ts`, `libraries/games/src/taxonomy.ts` (`GAME_ID_LOOKUP`), and `libraries/games/src/registry.ts` alongside `apps/[gameId]` (codified in `.ai/skills/new-game/SKILL.md` and `.ai/rules/game-taxonomy.md`).
- **Controlled Taxonomy Evolution:**
  - *Additive changes* (appending a new tag or category slug to a const tuple) are backward-compatible for `GameMetadata` records, though any future exhaustive UI label maps (`Record<GameCategory, string>`) in `@arcade/lib-i18n` or `@arcade/lib-ui` will intentionally require corresponding translation entries at compile time.
  - *Breaking changes* (renaming or removing an existing category or tag slug) require updating all affected `GAME_REGISTRY` manifests, `@arcade/lib-i18n` label maps, and URL filter serialization (if persisted in query params) within a single atomic commit verified by `pnpm typecheck` and `pnpm test:conformance`.
