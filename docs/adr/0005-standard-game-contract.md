# ADR 0005: Standard Arcade Game Integration Contract

## Status

Accepted

## Context

As the Arcade monorepo expands with diverse web games (such as Sudoku, Minesweeper, Nonogram, Queens, Tracks, and Bridges), introducing a new game requires seamless integration across several core cross-cutting systems:

1. Central pre-rendered hub discovery (`apps/hub`) and monorepo package topology.
2. Consistent layout, design tokens, component reuse, and accessibility primitives (`@arcade/lib-ui`).
3. User identity, data privacy tiers, and storage modes (`@arcade/lib-user`, `@arcade/lib-consent`, `@arcade/lib-storage`, ADR 0003, ADR 0004, ADR 0012).
4. Configurable game parameters (difficulty tiers, grid sizes, presets).
5. Gamification, achievement tracking, medal tiers, and event broadcasts (`@arcade/lib-medals`).
6. Maintainable separation of core game mechanics from visual view rendering.

Without a formal architectural contract, game implementations risk diverging in UX patterns, duplicating boilerplate, introducing hardcoded strings, coupling engine math to React/DOM lifecycles, and bypassing privacy/medal pipelines.

## Decision

Every game application added under `apps/*` must strictly adhere to the following six-pillar architectural contract:

### 1. Central Registry & Pre-rendered Lobby Integration

- **Canonical Identification:** Every game must declare its canonical ID (`GameId` in `libraries/games/src/types.ts`) and register its metadata in `GAME_REGISTRY` in `libraries/games/src/registry.ts` (defining `id`, fallback `name`, root `route: '/${id}'`, emoji icon in `assets.icon`, and `i18nNamespace`).
- **Pre-rendered Hub Integration:** The central lobby (`apps/hub/src/pages/[lang]/index.astro`) automatically iterates over `ALL_GAMES` from `@arcade/lib-games` to generate pre-rendered static cards linking to `${game.route}/${lang}/`.
- **Static Multilingual Pages:** Dedicated game applications must generate static routes for all `SUPPORTED_LANGUAGES`:
  - `/[lang]/index.astro`: Pre-rendered game lobby featuring difficulty/puzzle selection.
  - `/[lang]/game.astro`: Interactive game canvas mounting the React island.
  - `/[lang]/rules.astro`: Pre-rendered instructions page utilizing `GameRulesLayout`.
  - `/[lang]/medals.astro`: Pre-rendered achievement showcase page utilizing `MedalCard`.
- **Localization Strategy (ADR 007):** Hardcoded UI strings are strictly forbidden. All labels, rules prose, difficulty tags, and achievement microcopy must route through `@arcade/lib-i18n` under the game's namespace.

### 2. Mandatory Shared UI Library & UX Pattern Reuse

- **Mandatory Catalog Reuse:** Authoring ad-hoc styled tags or raw HTML elements (`<button>`, `<a>` cards, custom dialogs) in game applications is strictly prohibited. All UI elements must consume `@arcade/lib-ui` primitives documented in `libraries/ui/CATALOG.md`:
  - **Layouts:** `PageLayout.astro`, `BaseLayout.astro`, `GameRulesLayout.astro`, `GameContainer`.
  - **Cards & Surfaces:** `ClickableCard`, `GameSelectionCard`, `QuickPlayCard`, `MedalCard`.
  - **Controls & Actions:** `Button`, `SegmentedControl`, `Switch`, `Toolbar`, `Timer`.
  - **Overlays & Feedback:** `Dialog`, `PauseOverlay`, `VictoryDialog`, `Toast`.
- **Zero-Runtime Styling (ADR 014):** All styles must use Linaria CSS template literals (`css`...``). Theming must leverage OKLCH CSS Custom Properties (`light-dark()`). State variants must use static `data-*` attribute selectors. Runtime prop interpolations in style blocks are prohibited.
- **Hydration Boundary (ADR 002):** Game canvases and stateful UI mounted in Astro templates must explicitly declare `client:only="react"` to prevent evaluation during static pre-rendering.

### 3. User Management Context & Storage Tier Integration

- **Header Identity Integration:** Game layouts must mount `HeaderUserMenu` (`@arcade/lib-ui`) in the header actions slot, displaying guest UUID vs authenticated account status and local vs cloud storage mode.
- **Namespaced Persistence (ADR 008, ADR 012):** Games must never access `localStorage`, `sessionStorage`, or raw browser storage directly. All client state must be accessed through `createGameStorage(gameId)` from `@arcade/lib-storage`, enforcing key namespacing (`arcade::[gameId]::[key]`).
- **Privacy & Data Sovereignty (ADR 003, ADR 004):** Games must never execute direct Firestore or third-party cloud SDK calls. Cloud synchronization (Tiers 3 & 4) is handled transparently by domain sync adapters based on affirmative user consent.

### 4. Explicit Difficulty Levels & Sizing Configurations

- **Domain Parameter Modeling:** Difficulty levels (e.g. `easy`, `medium`, `hard`, `expert`) and grid dimensions (e.g. `6x6`, `8x8`, `10x10`) must be formally modeled in `src/engine/types.ts` (e.g. `DIFFICULTY_LEVELS`, `DIFFICULTY_SIZES`).
- **Accessible Control Surfaces:** Difficulty and size toggles in lobbies and settings dialogs must use accessible components (e.g., `SegmentedControl`).
- **Deep Linking:** Game selection states must sync bidirectionally with URL search parameters (e.g., `?difficulty=medium&puzzle=12`) to support bookmarking, back-navigation, and shareable puzzle links.
- **Metrics Disaggregation:** Completion times and high scores must be disaggregated by difficulty and size when evaluating records and achievement thresholds.

### 5. Achievement & Medal System Integration

- **Medal Catalog Definition:** Every game must declare its complete achievement catalog in `libraries/medals/src/definitions/[gameId].ts` and register it in `libraries/medals/src/definitions/index.ts`.
- **Achievement Typology:** Medals must follow the two standard patterns:
  - `standalone`: Single milestone unlocking Bronze, Silver, or Gold tier.
  - `ladder`: Progressive 3-tier milestone tracking incremental progress toward Bronze, Silver, and Gold thresholds.
- **Decoupled Result Recording:** When a match completes or is surrendered, games must call `recordGameResult({ gameId, won, playTimeSeconds, levelKey, sizeKey, roundContext })` from `@arcade/lib-medals`.
- **Automatic Event Dispatch & Notifications:** `recordGameResult` automatically updates aggregate stats, evaluates unlock criteria, commits to namespaced storage, handles cloud synchronization queues, and dispatches the `medalUnlocked` custom event on `window`.
- **Global Toast Notification:** Layouts wrapping `BaseLayout` automatically mount `MedalToastListener`, which listens to `medalUnlocked` and displays a celebratory `Toast` with the unlocked `MedalIcon`.
- **Showcase Page:** Each game must provide a dedicated static page at `/[lang]/medals.astro` displaying all unlocked and locked medals with `MedalCard` components.
- **Hub-Level Medal Showcase & Aggregation:** In addition to the game's local showcase page, every new game must be registered in the central hub's global Medals Showcase (`apps/hub/src/components/MedalsShowcase/MedalsShowcase.tsx`) and the user medal summary widget (`apps/hub/src/components/UserMedalSummaryWidget/UserMedalSummaryWidget.tsx`). This guarantees that medals from the new game are discoverable on the central `/medals` route, filterable by game, and aggregate into the player's total trophy count on the main hub.

### 6. Strict Engine Logic Isolation from UI Rendering

- **Headless Domain Architecture:** All board representations, puzzle generators, validation algorithms, solvers, and undo/redo history stacks must reside in `src/engine/`.
- **Zero Framework Coupling:** Code in `src/engine/` must be 100% headless TypeScript with zero imports from React, JSX, Astro runtime, Linaria, or DOM APIs.
- **Independent Testability:** The engine must achieve comprehensive unit test coverage using Vitest before any UI layer is developed.
- **Clean Consumption Layer:** React components (`src/components/`) and custom hooks (`use[Game]Game.hooks.ts`) interact with the engine strictly as an immutable or functional state machine.

## Consequences

### Positive

- **Unified Player Experience:** Consistent navigation, controls, modal dialogs, and visual hierarchy across all games.
- **Zero-Friction Hub Discovery:** New games are automatically indexed in the pre-rendered lobby without manual HTML updates.
- **Privacy & Compliance by Default:** Built-in support for offline storage, consent tiers, and cross-device cloud sync without bespoke database code in apps.
- **High Code Quality & Resiliency:** Complete decoupling of pure algorithmic puzzle math from UI rendering simplifies testing and refactoring.

### Negative / Trade-offs

- **Upfront Scaffolding Overhead:** Integrating a new game requires coordinated registration in shared libraries (`@arcade/lib-games`, `@arcade/lib-i18n`, `@arcade/lib-medals`) in addition to the application package.
- **Mandatory Upfront Specification:** Teams cannot jump straight into UI drafting; difficulty tiers, puzzle formats, and achievement rosters must be formally specified first.
