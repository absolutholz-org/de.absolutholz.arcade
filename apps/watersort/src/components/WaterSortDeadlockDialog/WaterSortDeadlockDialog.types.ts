export interface WaterSortDeadlockDialogProps {
	isOpen: boolean;
	canUndo: boolean;
	difficulty: string;
	onUndo: () => void;
	onRestart: () => void;
	onNextPuzzle: () => void;
}
