# 0008. Standard Game Shell & Per-Game Subsystem Contracts

- **Status:** Accepted
- **Date:** 2026-10-29
- **Deciders:** Engineering Team
- **Consulted:** Monorepo Game Audit Findings
- **Supersedes / Extends:** Extends [0005. Standard Game Contract](0005-standard-game-contract.md) and aligns with [0007. Static Prose in Astro Content Collections](0007-static-prose-in-astro-content-collections.md)

---

## Context and Problem Statement

The `@arcade/monorepo` currently hosts 9 standalone game applications alongside the discovery hub. While [ADR 0005](0005-standard-game-contract.md) successfully isolated headless game engines (`src/engine/`) and standardized state persistence, our survey revealed fragmentation across user-facing pages, UI shells, and player features:

1. **Inconsistent Page Topology:** All games provide `/[lang]/` (lobby), `/[lang]/game` (play), `/[lang]/rules` (rules), and `/[lang]/medals` (achievements), but none provide dedicated `/[lang]/settings` or `/[lang]/stats` routes.
2. **Disconnected Mid-Game Reference:** Rules documentation lives exclusively on a standalone page. Players cannot consult rules mid-game without navigating away and abandoning or suspending active gameplay.
3. **Fragmented Settings Management:** Settings are currently split between URL search params (`?difficulty=...`), ad-hoc localStorage flags, and lobby dropdowns. There is no unified mechanism to explain complex game-specific options on a dedicated page while also exposing a compact set of toggles inside the active game session.
4. **Disjoint Telemetry and Unsurfaced Stats:** Rich gameplay metrics (moves, elapsed time, undos, mistakes, hints, streaks) are computed in memory for medal checks, but historical statistics, win rates, and personal bests are not unified or visualized for the player.
5. **Duplicated Presentation Boilerplate:** Every game application maintains bespoke medal grid components and manually resolves achievement thresholds in `.astro` templates rather than relying on a shared declarative contract.

We need a standardized per-game shell and subsystem contract so that existing games can be systematically aligned and all future games inherit a consistent player experience with zero duplicated boilerplate.

---

## Decision Drivers

- **Zero Content Duplication:** Rules prose must be authored once in Markdown and served both as a standalone SEO-friendly page and inside an in-game modal without bundling a client-side Markdown parser.
- **Local-First with Cloud Agnosticism:** Statistics, high scores, and settings must work instantly offline/anonymously via `@arcade/lib-storage`, with optional cloud sync when user consent and profile services are active.
- **Component-First Reusability:** Shared presentation patterns (medal grids, settings panels, stats dashboards, headers) must live in `@arcade/lib-ui` and `@arcade/lib-medals`, leaving game packages responsible only for domain-specific definitions and schemas.
- **Accessibility & Web Standards Compliance:** All overlays, modal dialogs, and controls must strictly comply with WCAG 2.2 Level AA and BITV 2.0 (keyboard focus trapping, escape dismissal, ARIA attributes, relative `rem` units, and `oklch` color tokens).

---

## Considered Options

1. **Option 1: Status Quo with Ad-Hoc Additions.** Let each game implement `/settings` and `/stats` independently as needs arise.
2. **Option 2: Pure Single-Page Application (SPA) Shell.** Convert all per-game secondary pages into client-side React routes/modals hosted entirely inside a single `index.html` or `game.astro`.
3. **Option 3: Standard 6-Route Static Topology with Dual-Mode Subsystem Overlays (Selected).** Standardize every game on a uniform 6-route structure in Astro, powered by shared domain contracts for stats, settings, and medals, using Astro slot injection for zero-cost client-side markdown delivery.

---

## Decision Outcome

Chosen Option: **Option 3**. Every game package in `apps/*` must implement a standard 6-route topology and conform to shared contracts for rules, settings, statistics, and medals.

```text
apps/[gameId]/src/pages/
├── index.astro                 # Root language detection and redirect
└── [lang]/
	├── index.astro             # 1. Landing / Lobby Page
	├── game.astro              # 2. Gameplay Page (Playfield + In-Game Overlays)
	├── rules.astro             # 3. Standalone Rules & How-To-Play Page
	├── settings.astro          # 4. Standalone Extended Settings Page
	├── stats.astro             # 5. Standalone Statistics & High Scores Page
	└── medals.astro            # 6. Standalone Medals Showcase Page
```

---

## Subsystem Specifications

### 1. Rules Dual-Mode Strategy (Astro Slot Injection)

To comply with ADR 0007 without inflating the client bundle with `marked` or `micromark`:

- **Single Source of Truth (SSOT):** Authored in Markdown under `apps/[gameId]/src/content/pages/[lang]/rules.md`.
- **Standalone Page (`/[lang]/rules.astro`):** Fetches the collection entry and renders via `MarkdownPageTemplate.astro`.
- **In-Game Modal (`/[lang]/game.astro`):** Pre-renders `<Content/>` at build time in Astro and projects it into the React game root island using a named slot (`slot="rulesContent"`):

```astro
---
// apps/[gameId]/src/pages/[lang]/game.astro
import { getEntry } from 'astro:content';
import { MarkdownContent } from '@arcade/lib-ui';
import { GameLayout } from '@arcade/lib-ui';
import { ExampleGame } from '../../components/ExampleGame/ExampleGame';

const lang = Astro.params.lang ?? 'en';
const rulesEntry = (await getEntry('pages', `${lang}/rules`)) ?? (await getEntry('pages', `en/rules`));
const renderedRules = rulesEntry ? await rulesEntry.render() : null;
const RulesContent = renderedRules?.Content;
---

<GameLayout lang={lang}>
  <ExampleGame client:only="react" lang={lang}>
	<div slot="rulesContent">
	  <MarkdownContent>
		{RulesContent && <RulesContent />}
	  </MarkdownContent>
	</div>
  </ExampleGame>
</GameLayout>
```

The game client island renders an accessible `<Dialog>` component wrapping the projected slot, pausing gameplay timers while visible.

---

### 2. Settings Contract & Dual-Mode Presentation

Settings state is partitioned into **Universal Preferences** (managed centrally via `@arcade/lib-ui`) and **Game-Specific Preferences** (declared via schema).

#### A. Schema Definition (`src/config/settings.ts`)

Every game defines its configuration schema in `src/config/settings.ts` adhering to `@arcade/lib-games`:

```ts
export type SettingControlType = "boolean" | "segmented" | "select";

export interface SettingFieldDescriptor<TValue = boolean | string> {
	readonly key: string;
	readonly control: SettingControlType;
	readonly defaultValue: TValue;
	/** Whether this setting can be modified safely mid-round inside the in-game modal */
	readonly availableInGame: boolean;
	/** Translation keys for labels and detailed standalone descriptions */
	readonly i18n: {
		readonly labelKey: string;
		readonly descriptionKey: string;
	};
	readonly options?: readonly {
		readonly value: TValue & string;
		readonly labelKey: string;
	}[];
}

export interface GameSettingsConfig<TSettings extends Record<string, unknown>> {
	readonly gameId: GameId;
	readonly defaults: TSettings;
	readonly fields: readonly SettingFieldDescriptor[];
}
```

#### B. Dual-Mode Rendering (`<GameSettingsPanel/>`)

A shared presentation component in `@arcade/lib-ui` renders the settings form in two modes:

- **`mode="compact"` (In-Game Modal):** Renders only fields where `availableInGame === true` alongside basic appearance toggles, minimizing cognitive load during active play.
- **`mode="detailed"` (`/[lang]/settings.astro`):** Renders all fields with extended descriptive text (`descriptionKey`), global preferences (sound, haptics, color scheme, theme, language), account/sync controls (`UserProfileDialog`), and a destructive "Reset Local Progress" action.

---

### 3. Unified Statistics & Telemetry Contract

Historical telemetry is normalized across all games in `@arcade/lib-storage` under `arcade::[gameId]::stats`.

```ts
export interface DifficultyBucketStats {
	readonly gamesPlayed: number;
	readonly gamesWon: number;
	readonly gamesLost: number;
	readonly currentStreak: number;
	readonly bestStreak: number;
	readonly bestTimeSeconds: number | null;
	readonly totalPlayTimeSeconds: number;
	readonly bestMoves?: number | null;
	readonly bestScore?: number | null;
	readonly flawlessWins: number;
}

export interface GameStats<
	TBucketKey extends string = string,
	TCustomMetrics extends Record<string, number> = Record<string, number>,
> {
	readonly schemaVersion: 1;
	readonly gameId: GameId;
	readonly updatedAt: number;
	readonly overall: DifficultyBucketStats;
	readonly byBucket: Partial<Record<TBucketKey, DifficultyBucketStats>>;
	readonly lifetimeMetrics: TCustomMetrics;
}
```

- **Aggregation Pipeline:** Game completion events invoke `recordGameStats(gameId, roundResult)` in `@arcade/lib-storage`, which updates bucket stats and lifetime metrics in a single transactional step alongside medal checks.
- **Dashboard View:** `/[lang]/stats.astro` renders `<GameStatsDashboard gameId="{gameId}"/>` from `@arcade/lib-ui`, displaying win rates, streak tracking, time graphs, and bucket metrics.

---

### 4. Consolidated Medals Showcase

To eliminate copy-pasted `[Game]MedalGrid` components across apps:

1. **Explicit Thresholds:** `MedalDefinition` in `@arcade/lib-medals` is extended so that standalone medals explicitly declare their numerical `target` (defaulting to `1`), eliminating inline `if (def.id === ...)` branch logic.
2. **Shared Component:** Apps render medals solely via `<GameMedalGrid gameId="{gameId}" lang="{lang}"/>` from `@arcade/lib-ui`, which directly consumes definitions and state from `@arcade/lib-medals`.

---

## Consequences

### Positive

- **Predictable UX:** Every game in the monorepo provides an identical navigation contract, layout structure, and settings experience.
- **Zero Rules Bloat:** Standalone and in-game rules stay 100% synchronized with zero client-side markdown parsing libraries.
- **Radical Boilerplate Reduction:** App directories focus strictly on game rules, engine algorithms, and playfield rendering; shell components (medals grids, stats dashboards, settings forms) are shared.
- **Authoritative AI Blueprint:** Agents creating new games have a deterministic, auditable checklist of routes and exports to scaffold.

### Negative / Trade-offs

- **Migration Effort:** All 9 existing game packages must be updated to replace legacy layouts, hook into the stats pipeline, and expose the missing `/settings` and `/stats` routes.
- **Astro Slot Boundary:** Passing pre-rendered markdown via named slots into client React islands requires maintaining proper hydration boundaries in `game.astro`.

---

## Validation & Verification

1. **Route Completeness Check:** A workspace lint test (`pnpm test:routes`) validates that every directory under `apps/*` (excluding `hub`) implements the 6 canonical `.astro` routes.
2. **Accessibility Audit:** Playwright automated tests verify that both the Rules modal and Settings modal trap focus, respond to `Escape`, and return focus to the invoking trigger in `GameHeader`.
3. **Storage Isolation Test:** Unit tests verify that `recordGameStats` gracefully initializes missing state, calculates bucket win rates accurately, and functions without errors in private/incognito browsing contexts where storage quotas may be restricted.
