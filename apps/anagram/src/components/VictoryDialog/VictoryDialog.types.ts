import type { DifficultyLevel, GameMode } from '../../engine/types.js';

export interface VictoryDialogProps {
	isOpen: boolean;
	isMastered: boolean;
	foundCount: number;
	totalCount: number;
	score: number;
	elapsedSeconds: number;
	difficulty: DifficultyLevel;
	mode: GameMode;
	onPlayAgain: () => void;
	onClose: () => void;
}
