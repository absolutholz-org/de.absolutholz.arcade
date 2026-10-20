import type { SupportedLanguageCode } from '@arcade/lib-i18n/types/i18n.types';
import type { AchievementType, MedalTier } from '@arcade/lib-medals';

export interface MinesweeperMedalDefinitionItem {
	readonly id: string;
	readonly type: AchievementType;
	readonly tier: MedalTier;
	readonly title: string;
	readonly description: string;
	readonly icon: string;
	readonly target?: number;
	readonly thresholds?: {
		readonly bronze: number;
		readonly silver: number;
		readonly gold: number;
	};
}

export interface MinesweeperMedalGridProps {
	readonly lang: SupportedLanguageCode;
	readonly staticMedals?: readonly MinesweeperMedalDefinitionItem[];
}
