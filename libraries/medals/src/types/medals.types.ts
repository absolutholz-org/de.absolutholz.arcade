import type { BaseGameStats, GameCustomStatsMap, GameId } from './stats.types.js';

export type MedalTier = 'bronze' | 'silver' | 'gold';
export type AchievementType = 'standalone' | 'ladder';

export interface MedalUnlock {
	readonly id: string;
	readonly tier: MedalTier;
	readonly unlockedAt: number;
}

export interface MedalProgress {
	readonly current: number;
	readonly target: number;
	readonly currentProgress?: number;
	readonly currentTier?: MedalTier | null;
	readonly nextThreshold?: number | null;
	readonly bronzeUnlocked?: boolean;
	readonly silverUnlocked?: boolean;
	readonly goldUnlocked?: boolean;
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
	readonly unlocked?: boolean;
	readonly progress?: number;
	readonly target?: number;
	readonly currentProgress?: number;
	readonly currentTier?: MedalTier | null;
	readonly nextThreshold?: number | null;
	readonly bronzeUnlocked?: boolean;
	readonly silverUnlocked?: boolean;
	readonly goldUnlocked?: boolean;
}

export interface AchievementDefinition<G extends GameId = GameId> {
	readonly id: string;
	readonly type?: AchievementType;
	readonly tier: MedalTier;
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

export interface GameResultPayload<G extends GameId = GameId> {
	readonly gameId: G;
	readonly won: boolean;
	readonly playTimeSeconds: number;
	readonly levelKey?: string;
	readonly sizeKey?: string;
	readonly customData?: Partial<GameCustomStatsMap[G]>;
	readonly roundContext?: Record<string, unknown>;
}

export interface RecordGameResultResponse<G extends GameId = GameId> {
	readonly updatedState: GameMedalState<G>;
	readonly newlyUnlockedMedals: readonly MedalUnlock[];
	readonly isNewBestTime: boolean;
}
