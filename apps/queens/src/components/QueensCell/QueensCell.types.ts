import type { MouseEvent, PointerEvent } from 'react';
import type { CellConflict, CellState } from '../../engine/types.js';

export interface QueensCellProps {
	row: number;
	col: number;
	region: number;
	state: CellState;
	conflict?: CellConflict;
	isFocused?: boolean;
	borderTop: 'thick' | 'thin';
	borderBottom: 'thick' | 'thin';
	borderLeft: 'thick' | 'thin';
	borderRight: 'thick' | 'thin';
	onCellClick: (row: number, col: number) => void;
	onCellDoubleClick?: (row: number, col: number) => void;
	onCellContextMenu?: (row: number, col: number, e: MouseEvent) => void;
	onPointerDown?: (row: number, col: number, e: PointerEvent) => void;
	onPointerEnter?: (row: number, col: number, e: PointerEvent) => void;
	onPointerUp?: (e: PointerEvent) => void;
}
