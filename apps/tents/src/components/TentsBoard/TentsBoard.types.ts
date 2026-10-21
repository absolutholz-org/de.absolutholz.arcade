import type { KeyboardEvent, MouseEvent } from 'react';
import type { BoardEvaluation, BoardState, CellCoord } from '../../engine/types.ts';

export interface TentsBoardProps {
	board: BoardState;
	evaluation: BoardEvaluation;
	focusedCell: CellCoord | null;
	highlightViolations: boolean;
	highlightClues: boolean;
	isComplete: boolean;
	onCellClick: (row: number, col: number) => void;
	onCellContextMenu: (row: number, col: number, e: MouseEvent) => void;
	onCellFocus: (row: number, col: number) => void;
	onClueClick?: (type: 'row' | 'col', index: number) => void;
	onKeyDown: (e: KeyboardEvent) => void;
}
