import type { DifficultyLevel, GameMode, LanguageCode } from '../../engine/types.js';

export interface AnagramGameHeaderProps {
	difficulty: DifficultyLevel;
	mode: GameMode;
	vocabLanguage: LanguageCode;
	score: number;
	foundCount: number;
	totalCount: number;
	/** Elapsed seconds in Zen, remaining seconds in Timed Arcade. */
	displaySeconds: number;
	isPaused: boolean;
	isEnded: boolean;
	onTogglePause: () => void;
	onNewRound: () => void;
}
