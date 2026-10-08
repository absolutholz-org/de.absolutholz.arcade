import type { SupportedLanguageCode } from '@arcade/lib-i18n/types/i18n.types';
import type { Difficulty } from '../../engine/types';

export interface SudokuGameProps {
	initialDifficulty?: Difficulty;
	lang?: SupportedLanguageCode;
}
