import type { SudokuTokenMode } from '../../config/tokens';
import type { KeypadLayoutMode } from '../../engine/types';

export interface SudokuKeypadProps {
	digitCounts: Record<number, number>;
	isNotesMode: boolean;
	canUndo?: boolean;
	canRedo?: boolean;
	layout?: KeypadLayoutMode;
	tokenMode?: SudokuTokenMode;
	onDigitPress: (digit: number) => void;
	onToggleNotes: () => void;
	onErase: () => void;
	onUndo?: () => void;
	onRedo?: () => void;
	onRestart?: () => void;
}
