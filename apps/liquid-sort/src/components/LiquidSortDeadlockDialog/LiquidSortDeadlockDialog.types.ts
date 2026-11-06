export interface LiquidSortDeadlockDialogProps {
	isOpen: boolean;
	canUndo: boolean;
	difficulty: string;
	onUndo: () => void;
	onRestart: () => void;
	onNextPuzzle: () => void;
}
