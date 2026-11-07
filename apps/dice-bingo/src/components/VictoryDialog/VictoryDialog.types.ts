import type { DifficultyLevel } from '../../engine/types.ts';

export interface VictoryDialogProps {
	readonly isOpen: boolean;
	readonly score: number;
	readonly elapsedSeconds?: number;
	readonly isNewBestScore?: boolean;
	readonly onPlayAgain: () => void;
	readonly onClose: () => void;
	readonly difficulty?: DifficultyLevel;
}
