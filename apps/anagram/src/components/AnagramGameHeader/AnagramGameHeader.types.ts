import type { DifficultyLevel, GameMode } from '../../engine/types.js';

export interface AnagramGameHeaderProps {
	difficulty: DifficultyLevel;
	mode: GameMode;
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
