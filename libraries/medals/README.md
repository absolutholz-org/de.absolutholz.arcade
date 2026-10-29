# @arcade/lib-medals

Unified medal progression, local achievement evaluation, and conflict-free statistics engine for the Arcade monorepo.

## Overview

`@arcade/lib-medals` is a pure, game-agnostic domain engine providing achievement types, progression evaluation, event notifications, CRDT-style cloud sync merging, and local medal state persistence (`arcade::[gameId]::medals`).

Game-specific medal definitions are co-located in each game workspace at `apps/[gameId]/src/config/medals.ts` and passed explicitly into both gameplay round completion handlers (`recordGameResult(payload, { definitions })`) and showcase UI views (`<GameMedalGrid gameId={gameId} definitions={...} lang={lang} />` in `@arcade/lib-ui`).

## Medal Definitions (`MedalDefinition` / `AchievementDefinition`)

Each game co-locates its achievements as an array of `MedalDefinition<G>` (an alias for `AchievementDefinition<G>`) in `apps/[gameId]/src/config/medals.ts`.

```ts
export interface AchievementDefinition<G extends GameId = GameId> {
	readonly id: string;
	readonly type?: AchievementType; // 'standalone' | 'ladder'
	readonly tier: MedalTier; // 'bronze' | 'silver' | 'gold'
	readonly titleKey: string;
	readonly descriptionKey: string;
	readonly icon: string;
	readonly metric?: string;
	readonly target?: number;
	readonly thresholds?: {
		readonly bronze: number;
		readonly silver: number;
		readonly gold: number;
	};
	readonly evaluate: (context: AchievementEvaluationContext<G>) => AchievementEvaluationResult;
}

export type MedalDefinition<G extends GameId = GameId> = AchievementDefinition<G>;
```

### Standalone vs. Ladder Thresholds (`target` vs. `thresholds`)

- **Standalone Medals (`type: 'standalone'`)**: Use the optional `target?: number` property on `MedalDefinition` to declare the numerical threshold required for completion (e.g., `target: 10` for 10 consecutive undos, or `target: 1` for single-trigger milestones). When `target` is omitted (`undefined`), consumers and UI components default the completion target to `1`.
- **Ladder Medals (`type: 'ladder'`)**: Use the `thresholds: { bronze, silver, gold }` object to define multi-tier progression milestones across Bronze, Silver, and Gold tiers.

> **Important (ADR 0008):** Page templates (`apps/[game]/src/pages/[lang]/medals.astro`) must never hardcode or override medal `target` or `thresholds` values. All numerical completion targets must be declared directly on the co-located `MedalDefinition` in `apps/[gameId]/src/config/medals.ts`.

## Key Exports

- `recordGameResult(payload, options)` — Atomic round evaluation, stat aggregation, storage persistence, and unlock event emission using co-located `options.definitions`.
- `evaluateMedals(state, result, definitions, timestamp)` — Pure achievement evaluation engine.
- `getGameMedalState(gameId)` / `saveGameMedalState(state)` — Namespaced storage accessors (`arcade::[gameId]::medals`).
- `emitMedalUnlocked(detail)` / `subscribeToMedalUnlocked(callback)` — Typed custom event bus for achievement unlock toasts and live UI hydration.
