import type { SupportedLanguageCode } from '@arcade/lib-i18n/types/i18n.types';
import type { MedalTier } from '@arcade/lib-medals';

export interface SudokuMedalDefinitionItem {
	readonly id: string;
	readonly tier: MedalTier;
	readonly title: string;
	readonly description: string;
	readonly icon: string;
	readonly target?: number;
}

export interface SudokuMedalGridProps {
	readonly lang: SupportedLanguageCode;
	readonly staticMedals?: readonly SudokuMedalDefinitionItem[];
}
