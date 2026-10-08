import type { Difficulty } from '../../engine/types';

export interface VictoryDialogProps {
	isOpen: boolean;
	elapsedSeconds: number;
	difficulty: Difficulty;
	isNewBestTime: boolean;
	onPlayAgain: () => void;
	onClose: () => void;
}
