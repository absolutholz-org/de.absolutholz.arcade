export interface VictoryDialogProps {
	isOpen: boolean;
	elapsedSeconds: number;
	isNewBestTime: boolean;
	hasNextPuzzle?: boolean;
	onNextPuzzle?: () => void;
	onPlayAgain: () => void;
	onClose: () => void;
}
