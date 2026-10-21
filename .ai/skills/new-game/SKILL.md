---
id: new-game
name: New Game Integration Workflow
description: Step-by-step workflow and quality gate for planning, specifying, and implementing a new arcade game adhering to ADR 0005.
targets: ["apps/**/*", "libraries/games/**/*", "libraries/medals/**/*", "libraries/i18n/**/*"]
---

# New Game Integration Workflow

This skill guides the end-to-end planning, specification, and implementation of new arcade games in the monorepo, enforcing full adherence to [ADR 0005: Standard Arcade Game Integration Contract](docs/adr/0005-standard-game-contract.md).

## When to Apply

Apply this skill whenever:

- Planning or creating a new game application under `apps/*`.
- Scaffolding game engine mechanics, board representations, or puzzle generators.
- Integrating a game into the central lobby, shared UI library, medals system, or user management.
- Refactoring an existing game to align with monorepo standards.

---

## 6-Phase Execution Protocol

```
Phase 1: Reference & Contract Inspection
   ↓
Phase 2: Upfront Specification Proposal (Mandatory User Gate)
   ↓
Phase 3: Pure Headless Engine & Unit Tests
   ↓
Phase 4: Shared Libraries Registration (i18n, Medals, Workspaces)
   ↓
Phase 5: UI & Astro Island Integration
   ↓
Phase 6: Accessibility, Static Verification & Central Hub Activation
```

---

### Phase 1: Reference & Contract Inspection

Before generating or modifying code:

1. **Audit Recent Games & Documentation:** Inspect recently integrated games (e.g. `apps/tracks` and `apps/bridges`) to observe current patterns for layout wrapping, engine isolation, storage creation, and existing documentation (such as `apps/tracks/README.md` and `apps/tracks/.ai/agents/tracks-agent.md`).
2. **Review Root Script Conventions:** Inspect the root `package.json` to observe script naming patterns (`dev:[gameId]`, `build:[gameId]`, `preview:[gameId]`).
3. **Review Contract Boundaries:** Verify the target game design against [ADR 0005](docs/adr/0005-standard-game-contract.md) and monorepo constraints:
    - Zero hardcoded strings ([ADR 007](docs/adr/architecture-decision-records.md)).
    - Pure static build compatibility ([ADR 002](docs/adr/architecture-decision-records.md)).
    - Strict local storage namespacing ([ADR 012](docs/adr/architecture-decision-records.md)).
4. **Audit Component Inventory:** Inspect [libraries/ui/CATALOG.md](libraries/ui/CATALOG.md) to identify all required design system components (`ClickableCard`, `GameSelectionCard`, `SegmentedControl`, `Button`, `Dialog`, `PauseOverlay`, `VictoryDialog`, `MedalCard`).

---

### Phase 2: Upfront Specification Proposal (Mandatory Gate)

> [!IMPORTANT]
> **Do not write implementation code before completing Phase 2.** Formulate and present a comprehensive game specification to the user, covering:

1. **Game Metadata & Taxonomy:**
    - Canonical `gameId` (lowercase slug matching package name `@arcade/[gameId]`).
    - Display name and primary emoji icon (for `assets.icon`).
    - Summary description for the hub lobby card.
2. **Core Rules & Mathematical Invariants:**
    - **Board Representation & Cell States:** Permitted cell types and player interaction states (e.g. empty, item, helper mark).
    - **Constraint Invariants:** Explicit mathematical rules that define valid board states, adjacency limits, and clue mechanics.
    - **Win, Loss & Invalidation Criteria:** Exact algorithmic conditions for victory, deadlocks, and constraint violations.
    - **Player Move Mechanics:** Legal input actions (placement, cycling, secondary mark, clear, undo).
3. **Difficulty Tiers & Sizing Model:**
    - Enumerated difficulty levels (e.g. `easy`, `medium`, `hard`, `expert`).
    - Grid dimensions and rule parameters per level.
    - Puzzle generation and solvability strategy (e.g. procedural seed with solver verification vs curated bundle).
4. **Achievement & Medal Catalog Spec:**
    - Complete roster of medals (standalone and progressive 3-tier ladders).
    - Milestone targets, unlock criteria, and tier thresholds (`bronze`, `silver`, `gold`).
    - Metric keys tracked in `roundContext` and `customStats`.
5. **State Persistence & UI Component Mapping:**
    - Active game session snapshot structure.
    - Level progress map structure (best times, completion flags, star ratings).
    - Catalog of specific `@arcade/lib-ui` components targeted for reuse in HUD, board, and overlays.

---

### Phase 3: Pure Headless Engine & Unit Tests

Implement the core game engine under `apps/[gameId]/src/engine/` before touching any UI:

1. **Engine File Structure:**
    - `types.ts`: Domain models (`Board`, `Cell`, `Move`, `DifficultyLevel`, `GameSnapshot`). Zero DOM/React imports.
    - `validator.ts`: Pure validation algorithms and win-state detectors.
    - `generator.ts`: Procedural generation or deterministic layout generators.
    - `solver.ts`: Solver algorithms verifying solution existence and uniqueness.
    - `history.ts`: Pure undo/redo move history stack.
    - `storage.ts`: Scoped persistence adapter consuming `createGameStorage(gameId)` from `@arcade/lib-storage`.
2. **Comprehensive Unit Testing:**
    - Create unit tests for validation, generation, move application, and undo/redo (`validator.test.ts`, `generator.test.ts`, `history.test.ts`).
    - Run Vitest to guarantee 100% test passing before proceeding to the UI.

---

### Phase 4: Shared Libraries Registration (i18n, Medals, Workspaces)

Register the game in the prerequisite shared monorepo packages:

1. **Type Declaration (`@arcade/lib-games`):**
    - Add the new `gameId` to the `GameId` type union in `libraries/games/src/types.ts`.
    - _Note:_ Do **not** add the game to `GAME_REGISTRY` or `ALL_GAMES` yet. Doing so prematurely would cause the pre-rendered hub (`apps/hub`) to render cards linking to an unbuilt route.
2. **Localization Dictionaries (`@arcade/lib-i18n`):**
    - Add the game namespace with localized titles, descriptions, instructions, difficulty labels, and medal strings across all supported language files.
3. **Achievement Definitions (`@arcade/lib-medals`):**
    - Author `libraries/medals/src/definitions/[gameId].ts` implementing the specification approved in Phase 2.
    - Register definitions in `libraries/medals/src/definitions/index.ts` within `getMedalDefinitionsForGame`.
4. **Workspace Config (`pnpm-workspace.yaml`) & Root Scripts (`package.json`):**
    - Ensure the new package directory is included under workspace package globs in `pnpm-workspace.yaml`.
    - Add root convenience scripts to the monorepo `package.json`:
      - `"dev:[gameId]": "pnpm --filter @arcade/[gameId] dev"`
      - `"build:[gameId]": "pnpm --filter @arcade/[gameId] build"`
      - `"preview:[gameId]": "pnpm --filter @arcade/[gameId] preview"`

---

### Phase 5: UI & Astro Island Integration

Construct the application shell and React canvas in `apps/[gameId]/`:

1. **Astro Route Shells:**
    - `src/pages/[lang]/index.astro`: Pre-rendered lobby mounting `[Game]Lobby` with `client:load`.
    - `src/pages/[lang]/game.astro`: Game view mounting `[Game]Game` with `client:only="react"`.
    - `src/pages/[lang]/rules.astro`: Static rules page using `GameRulesLayout.astro` from `@arcade/lib-ui`.
    - `src/pages/[lang]/medals.astro`: Static achievement showcase rendering catalog medals with `MedalCard`.
2. **Layout Chrome & User Identity:**
    - Wrap views in `PageLayout.astro` or `BaseLayout.astro`.
    - Mount `HeaderUserMenu client:load` in the header actions slot to expose user identity and cloud sync status.
3. **Design System Component Usage:**
    - Canvas shell: Wrap with `GameContainer`.
    - Lobby controls: Use `ClickableCard`, `GameSelectionCard`, `QuickPlayCard`, and `SegmentedControl`.
    - Game overlays: Implement `PauseOverlay` and `VictoryDialog` from `@arcade/lib-ui`.
4. **Result Recording & Medal Toasts:**
    - Call `recordGameResult({ gameId, won, playTimeSeconds, levelKey, sizeKey, roundContext })` upon round victory or defeat.
    - Ensure `BaseLayout` is present so `MedalToastListener` catches the `medalUnlocked` event and displays achievement notifications.
5. **App Documentation & Local Agent Profile:**
    - Author `apps/[gameId]/README.md` covering game overview, rules summary, difficulty matrix, engine architecture, and development commands.
    - Author `apps/[gameId]/.ai/agents/[gameId]-agent.md` providing the local agent cheatsheet and execution boundaries matching existing agent profiles (like `tracks-agent.md`), and register it in root `AGENTS.md`.

---

### Phase 6: Accessibility, Static Verification & Central Hub Activation

1. **Accessibility (WCAG 2.2 Level AA):**
    - Ensure the interactive grid/board implements appropriate WAI-ARIA roles (`grid`, `gridcell`, `button`).
    - Implement complete keyboard navigation (arrow keys for movement, Action keys, Undo/Redo keys, Pause key).
    - Ensure touch targets satisfy the 24×24 CSS pixel minimum.
    - Provide an ARIA live region for screen reader game status announcements.
2. **Zero-Runtime Styling Audit:**
    - Verify all Linaria styles use static OKLCH CSS variables and `data-*` selectors without runtime style prop interpolations.
3. **Static Build Verification:**
    - Run typecheck and static build:
        ```bash
        pnpm --filter @arcade/[gameId] test
        pnpm --filter @arcade/[gameId] build
        ```
    - Verify that output assets in `dist/` contain pure static HTML/CSS/JS without SSR dependencies.
4. **Central Hub Activation (Final Step):**
    - Only after all static tests and builds succeed, add the game entry to `GAME_REGISTRY` in `libraries/games/src/registry.ts`.
    - Verify that rebuilding `apps/hub` (`pnpm --filter @arcade/hub build`) successfully renders the new game card in the central lobby across all languages.

---

## Anti-Patterns to Avoid

- ❌ **Premature Hub Listing:** Never add a game to `GAME_REGISTRY` before its application builds cleanly and passes static verification.
- ❌ **Direct Storage Access:** Never call `localStorage.setItem` or `sessionStorage` directly; always use `createGameStorage(gameId)`.
- ❌ **Direct Cloud SDK Calls:** Never import or invoke Firestore/Firebase directly in the game app; always route through domain storage facades and `recordGameResult`.
- ❌ **Ad-hoc Styled Primitives:** Never create custom buttons, cards, or dialog backdrops; always reuse `@arcade/lib-ui` primitives from `CATALOG.md`.
- ❌ **Framework Leaks in Engine:** Never import React, hooks, or DOM types in `src/engine/`.
- ❌ **SSR Evaluation of Canvas:** Never use `client:load` for canvas components; always enforce `client:only="react"`.
- ❌ **Hardcoded UI Copy:** Never write literal English strings in `.tsx` or `.astro` templates; always use `@arcade/lib-i18n`.
