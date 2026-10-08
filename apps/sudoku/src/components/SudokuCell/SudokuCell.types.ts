import type { CellState } from '../../engine/types';

export interface SudokuCellProps {
	cell: CellState;
	isActive: boolean;
	isPeerCell: boolean;
	isPeerDigit: boolean;
	isInvalid: boolean;
	activeDigit?: number | null;
	onClick: () => void;
}
