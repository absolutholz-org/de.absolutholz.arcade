import type { Difficulty } from '../../engine/types.ts';

export interface VictoryDialogProps {
	readonly isOpen: boolean;
	readonly elapsedSeconds: number;
	readonly movesCount: number;
	readonly isNewBestTime?: boolean;
	readonly hasNextPuzzle?: boolean;
	readonly onNextPuzzle?: () => void;
	readonly onPlayAgain: () => void;
	readonly onClose: () => void;
	readonly difficulty?: Difficulty;
}
