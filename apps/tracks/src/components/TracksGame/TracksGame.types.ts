import type { SupportedLanguageCode } from '@arcade/lib-i18n/types/i18n.types';
import type { DifficultyLevel } from '../../engine/types.js';

export interface TracksGameProps {
	initialDifficulty?: DifficultyLevel;
	initialPuzzleId?: string;
	lang?: SupportedLanguageCode;
}
