import type { SupportedLanguageCode } from '@arcade/lib-i18n/types/i18n.types';
import type { DifficultyLevel, GameMode } from '../../engine/types.js';
import type { GuessResult } from '../../engine/validator.js';

export interface RackTile {
	id: number;
	letter: string;
}

export interface Feedback {
	kind: GuessResult;
	word: string;
	points?: number;
	clearedBaseline?: boolean;
}

export type RoundOutcome = 'cleared' | 'mastered' | 'timeUp' | 'revealed';

export interface AnagramGameProps {
	initialDifficulty?: DifficultyLevel;
	initialMode?: GameMode;
	lang?: SupportedLanguageCode;
}
