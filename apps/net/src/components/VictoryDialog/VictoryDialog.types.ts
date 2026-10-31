import type { Difficulty } from '../../engine/types.ts';

export interface VictoryDialogProps {
	isOpen: boolean;
	elapsedSeconds: number;
	movesCount: number;
	isNewBestTime?: boolean;
	hasNextPuzzle?: boolean;
	onNextPuzzle?: () => void;
	onPlayAgain?: () => void;
	onClose: () => void;
	gameMode?: 'standard' | 'casual';
	difficulty?: Difficulty;
}
