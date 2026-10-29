import type { AchievementDefinition, GameId } from '../types/index.js';

const registry = new Map<GameId, readonly AchievementDefinition<GameId>[]>();

/**
 * Registers achievement definitions for a given game at runtime.
 */
export function registerMedalDefinitions<G extends GameId>(
	gameId: G,
	definitions: readonly AchievementDefinition<G>[],
): void {
	registry.set(gameId, definitions as unknown as readonly AchievementDefinition<GameId>[]);
}

/**
 * Returns the registered achievement definitions for a given game, or an empty array if none registered.
 */
export function getMedalDefinitionsForGame<G extends GameId>(gameId: G): readonly AchievementDefinition<G>[] {
	return (registry.get(gameId) as unknown as readonly AchievementDefinition<G>[]) ?? [];
}
