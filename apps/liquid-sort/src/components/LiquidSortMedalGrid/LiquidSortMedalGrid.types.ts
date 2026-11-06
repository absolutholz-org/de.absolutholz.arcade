import type { SupportedLanguageCode } from '@arcade/lib-i18n/types/i18n.types';
import type { MedalTier } from '@arcade/lib-medals';

export interface LiquidSortMedalDefinitionItem {
	id: string;
	type: 'standalone' | 'ladder';
	tier: MedalTier;
	title: string;
	description: string;
	icon: string;
	target?: number;
	thresholds?: {
		bronze: number;
		silver: number;
		gold: number;
	};
}

export interface LiquidSortMedalGridProps {
	lang: SupportedLanguageCode;
	staticMedals: LiquidSortMedalDefinitionItem[];
}
