import type { SupportedLanguageCode } from '@arcade/lib-i18n/types/i18n.types';
import type { ReactNode } from 'react';
import type { Difficulty } from '../../engine/types';

export interface SudokuGameProps {
	initialDifficulty?: Difficulty;
	lang?: SupportedLanguageCode;
	rulesContent?: ReactNode;
}
