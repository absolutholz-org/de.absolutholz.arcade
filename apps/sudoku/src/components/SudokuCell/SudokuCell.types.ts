import type { SudokuTokenMode } from '../../config/tokens';
import type { CellState } from '../../engine/types';

export interface SudokuCellProps {
	cell: CellState;
	isActive: boolean;
	isPeerCell: boolean;
	isPeerDigit: boolean;
	isInvalid: boolean;
	activeDigit?: number | null;
	tokenMode?: SudokuTokenMode;
	onClick: () => void;
}
