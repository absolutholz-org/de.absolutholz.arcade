import type { DifficultyLevel } from '../../engine/types.ts';

export interface VictoryDialogProps {
	isOpen: boolean;
	elapsedSeconds: number;
	movesCount?: number;
	isNewBestTime: boolean;
	hasNextPuzzle?: boolean;
	onNextPuzzle?: () => void;
	onPlayAgain: () => void;
	onClose: () => void;
	difficulty?: DifficultyLevel;
}
