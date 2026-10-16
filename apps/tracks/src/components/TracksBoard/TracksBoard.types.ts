import type { KeyboardEvent, MouseEvent, PointerEvent } from 'react';
import type { BoardEvaluation, BoardState } from '../../engine/types.js';

export interface TracksBoardProps {
	board: BoardState;
	evaluation: BoardEvaluation;
	focusedCell: { row: number; col: number } | null;
	highlightClues: boolean;
	isComplete: boolean;
	onCellClick: (row: number, col: number) => void;
	onCellContextMenu: (row: number, col: number, e: MouseEvent<HTMLButtonElement>) => void;
	onCellFocus: (row: number, col: number) => void;
	onDragStart: (row: number, col: number, e: PointerEvent<HTMLButtonElement>) => void;
	onDragEnter: (row: number, col: number, e: PointerEvent<HTMLButtonElement>) => void;
	onDragEnd: (e: PointerEvent<HTMLElement>) => void;
	onClueClick: (axis: 'row' | 'col', index: number) => void;
	onKeyDown: (e: KeyboardEvent<HTMLDivElement>) => void;
}
