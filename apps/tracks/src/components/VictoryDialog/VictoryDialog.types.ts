import type { DifficultyLevel } from '../../engine/types.js';

export interface VictoryDialogProps {
	isOpen: boolean;
	elapsedSeconds: number;
	movesCount?: number;
	isNewBestTime: boolean;
	hasNextPuzzle?: boolean;
	onNextPuzzle?: () => void;
	onPlayAgain: () => void;
	onClose: () => void;
	gameMode?: 'standard' | 'casual';
	difficulty?: DifficultyLevel;
}
