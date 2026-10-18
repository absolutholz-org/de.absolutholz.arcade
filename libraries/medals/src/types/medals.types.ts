import type { BaseGameStats, GameCustomStatsMap, GameId } from './stats.types.js';

export type MedalTier = 'bronze' | 'silver' | 'gold';

export interface MedalUnlock {
	readonly id: string;
	readonly tier: MedalTier;
	readonly unlockedAt: number;
}

export interface MedalProgress {
	readonly current: number;
	readonly target: number;
}

/**
 * Complete atomic document persisted per game under `arcade::[gameId]::medals`.
 */
export interface GameMedalState<G extends GameId = GameId> {
	readonly gameId: G;
	readonly baseStats: BaseGameStats;
	readonly customStats: GameCustomStatsMap[G];
	readonly unlockedMedals: Record<string, MedalUnlock>;
	readonly medalProgress: Record<string, MedalProgress>;
	readonly schemaVersion: number;
	readonly updatedAt: number;
}

export interface AchievementEvaluationContext<G extends GameId = GameId> {
	readonly priorState: GameMedalState<G>;
	readonly updatedBaseStats: BaseGameStats;
	readonly updatedCustomStats: GameCustomStatsMap[G];
	readonly result: GameResultPayload<G>;
}

export interface AchievementEvaluationResult {
	readonly unlocked: boolean;
	readonly progress?: number;
	readonly target?: number;
}

export interface AchievementDefinition<G extends GameId = GameId> {
	readonly id: string;
	readonly tier: MedalTier;
	readonly titleKey: string;
	readonly descriptionKey: string;
	readonly icon: string;
	readonly evaluate: (context: AchievementEvaluationContext<G>) => AchievementEvaluationResult;
}

export interface GameResultPayload<G extends GameId = GameId> {
	readonly gameId: G;
	readonly won: boolean;
	readonly playTimeSeconds: number;
	readonly levelKey?: string;
	readonly customData?: Partial<GameCustomStatsMap[G]>;
	readonly roundContext?: Record<string, unknown>;
}

export interface RecordGameResultResponse<G extends GameId = GameId> {
	readonly updatedState: GameMedalState<G>;
	readonly newlyUnlockedMedals: readonly MedalUnlock[];
	readonly isNewBestTime: boolean;
}
