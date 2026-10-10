import type { MouseEvent, PointerEvent } from 'react';
import type { CellConflict, CellCoord, CellState, InputMode } from '../../engine/types';

export interface QueensBoardProps {
	size: number;
	regions: number[][];
	board: CellState[][];
	conflicts: Map<string, CellConflict>;
	focusedCell: CellCoord | null;
	inputMode: InputMode;
	onCellClick: (row: number, col: number) => void;
	onCellDoubleClick: (row: number, col: number) => void;
	onCellContextMenu: (row: number, col: number, e: MouseEvent) => void;
	onDragStart: (row: number, col: number, e: PointerEvent) => void;
	onDragEnter: (row: number, col: number, e: PointerEvent) => void;
	onDragEnd: (e: PointerEvent) => void;
	onKeyDown: (e: React.KeyboardEvent) => void;
}
