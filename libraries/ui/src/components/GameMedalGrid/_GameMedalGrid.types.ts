import type { SupportedLanguageCode } from '@arcade/lib-i18n/types/i18n.types';
import type { AchievementType, GameId, MedalDefinition, MedalProgress, MedalTier } from '@arcade/lib-medals';

export interface HydratedGameMedalItem {
	readonly id: string;
	readonly type: AchievementType;
	readonly tier: MedalTier;
	readonly titleKey: string;
	readonly descriptionKey: string;
	readonly icon: string;
	readonly target?: number;
	readonly thresholds?: {
		readonly bronze: number;
		readonly silver: number;
		readonly gold: number;
	};
	readonly isUnlocked: boolean;
	readonly unlockedAt?: number;
	readonly progress?: MedalProgress;
	readonly bronzeUnlocked: boolean;
	readonly silverUnlocked: boolean;
	readonly goldUnlocked: boolean;
}

export interface GameMedalSummaryCounts {
	readonly totalCount: number;
	readonly unlockedCount: number;
	readonly goldCount: number;
	readonly silverCount: number;
	readonly bronzeCount: number;
}

export interface GameMedalGridProps<G extends GameId = GameId> {
	/** Canonical game identifier whose medals should be rendered */
	readonly gameId: G;
	/** Co-located game medal definitions from `apps/[gameId]/src/config/medals.ts` */
	readonly definitions: readonly MedalDefinition<G>[];
	/** Active locale code */
	readonly lang: SupportedLanguageCode | string;
	/** Whether to hide the redundant bottom action button (e.g. when handled by a page template) */
	readonly hideActions?: boolean;
	/** Optional CSS class name */
	readonly className?: string;
}
