import type { DifficultyLevel } from '../../engine/types.js';

export interface TracksGameHeaderProps {
	difficulty: DifficultyLevel;
	puzzleId: string;
	satisfiedLines: number;
	totalLines: number;
	elapsedSeconds: number;
	mistakes: number;
	maxMistakes: number;
	isPaused: boolean;
	gameMode: 'standard' | 'casual';
	onTogglePause: () => void;
	onOpenSettings: () => void;
}
