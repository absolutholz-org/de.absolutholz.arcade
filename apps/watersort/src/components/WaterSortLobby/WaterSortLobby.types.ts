import type { SupportedLanguageCode } from '@arcade/lib-i18n/types/i18n.types';
import type { DifficultyLevel } from '../../engine/types.js';

export interface WaterSortLobbyProps {
	lang: SupportedLanguageCode;
	initialDifficulty?: DifficultyLevel;
}
