import type { KeypadLayoutMode } from '../../engine/types';

export interface SudokuKeypadProps {
	digitCounts: Record<number, number>;
	isNotesMode: boolean;
	canUndo: boolean;
	canRedo: boolean;
	layout?: KeypadLayoutMode;
	onDigitPress: (digit: number) => void;
	onToggleNotes: () => void;
	onErase: () => void;
	onUndo: () => void;
	onRedo: () => void;
}
