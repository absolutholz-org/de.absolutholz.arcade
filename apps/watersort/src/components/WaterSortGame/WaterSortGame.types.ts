import type { SupportedLanguageCode } from '@arcade/lib-i18n/types/i18n.types';
import type { ReactNode } from 'react';
import type { DifficultyLevel } from '../../engine/types.js';

export interface WaterSortGameProps {
	initialDifficulty?: DifficultyLevel;
	initialSeed?: number;
	lang?: SupportedLanguageCode;
	rulesContent?: ReactNode;
}
