import type { BoardState, CellState, HistoryState, PlayerMark } from './types.ts';

/**
 * Deep clones a BoardState.
 */
export function cloneBoardState(state: BoardState): BoardState {
	return {
		id: state.id,
		difficulty: state.difficulty,
		size: state.size,
		trees: state.trees.map((t) => ({ ...t })),
		rowClues: [...state.rowClues],
		colClues: [...state.colClues],
		grid: state.grid.map((row) =>
			row.map((cell) => ({
				fixed: cell.fixed,
				mark: cell.mark,
			})),
		),
	};
}

/**
 * Creates an initial HistoryState wrapping the provided BoardState.
 */
export function createHistory(initialState: BoardState): HistoryState {
	return {
		past: [],
		present: cloneBoardState(initialState),
		future: [],
		grassPlacedCount: 0,
		moveCount: 0,
	};
}

/**
 * Returns true if an undo operation is available.
 */
export function canUndo(history: HistoryState): boolean {
	return history.past.length > 0;
}

/**
 * Returns true if a redo operation is available.
 */
export function canRedo(history: HistoryState): boolean {
	return history.future.length > 0;
}

/**
 * Immutably records a new board state into history.
 */
export function pushState(history: HistoryState, nextState: BoardState, grassPlacedDelta = 0): HistoryState {
	return {
		past: [...history.past, history.present],
		present: cloneBoardState(nextState),
		future: [],
		grassPlacedCount: history.grassPlacedCount + grassPlacedDelta,
		moveCount: history.moveCount + 1,
	};
}

/**
 * Restores the most recent past state.
 */
export function undo(history: HistoryState): HistoryState {
	if (!canUndo(history)) {
		return history;
	}

	const previous = history.past[history.past.length - 1];
	const newPast = history.past.slice(0, -1);

	// Calculate grass delta between present and previous to restore counter
	let presentGrass = 0;
	let prevGrass = 0;
	for (let r = 0; r < history.present.size; r++) {
		for (let c = 0; c < history.present.size; c++) {
			if (history.present.grid[r][c].mark === 'grass') presentGrass++;
			if (previous.grid[r][c].mark === 'grass') prevGrass++;
		}
	}
	const grassDelta = presentGrass - prevGrass;
	const restoredGrassPlaced = Math.max(0, history.grassPlacedCount - Math.max(0, grassDelta));

	return {
		past: newPast,
		present: previous,
		future: [history.present, ...history.future],
		grassPlacedCount: restoredGrassPlaced,
		moveCount: Math.max(0, history.moveCount - 1),
	};
}

/**
 * Reapplies the next future state.
 */
export function redo(history: HistoryState): HistoryState {
	if (!canRedo(history)) {
		return history;
	}

	const next = history.future[0];
	const newFuture = history.future.slice(1);

	let presentGrass = 0;
	let nextGrass = 0;
	for (let r = 0; r < history.present.size; r++) {
		for (let c = 0; c < history.present.size; c++) {
			if (history.present.grid[r][c].mark === 'grass') presentGrass++;
			if (next.grid[r][c].mark === 'grass') nextGrass++;
		}
	}
	const grassDelta = nextGrass - presentGrass;
	const reappliedGrassPlaced = history.grassPlacedCount + Math.max(0, grassDelta);

	return {
		past: [...history.past, history.present],
		present: next,
		future: newFuture,
		grassPlacedCount: reappliedGrassPlaced,
		moveCount: history.moveCount + 1,
	};
}

/**
 * Sets the player mark for a single cell and updates history.
 * Trees cannot receive marks.
 */
export function setCellMark(history: HistoryState, row: number, col: number, mark: PlayerMark): HistoryState {
	const current = history.present.grid[row]?.[col];
	if (!current || current.fixed === 'tree' || current.mark === mark) {
		return history;
	}

	const nextBoard = cloneBoardState(history.present);
	nextBoard.grid[row][col].mark = mark;

	const grassPlacedDelta = mark === 'grass' && current.mark !== 'grass' ? 1 : 0;
	return pushState(history, nextBoard, grassPlacedDelta);
}

/**
 * Sets player marks for a batch of cells (e.g. auto-grassing or drag-marking) in one undoable step.
 */
export function batchSetMarks(
	history: HistoryState,
	cells: { row: number; col: number; mark: PlayerMark }[],
): HistoryState {
	const nextBoard = cloneBoardState(history.present);
	let grassPlacedDelta = 0;
	let changesCount = 0;

	for (const { row, col, mark } of cells) {
		const cell = nextBoard.grid[row]?.[col];
		if (!cell || cell.fixed === 'tree' || cell.mark === mark) {
			continue;
		}

		if (mark === 'grass' && cell.mark !== 'grass') {
			grassPlacedDelta++;
		}
		cell.mark = mark;
		changesCount++;
	}

	if (changesCount === 0) {
		return history;
	}

	return pushState(history, nextBoard, grassPlacedDelta);
}

/**
 * Resets all non-tree cells on the board to 'none' mark.
 */
export function resetBoardState(state: BoardState): BoardState {
	const next = cloneBoardState(state);
	for (let r = 0; r < next.size; r++) {
		for (let c = 0; c < next.size; c++) {
			if (next.grid[r][c].fixed !== 'tree') {
				next.grid[r][c].mark = 'none';
			}
		}
	}
	return next;
}

/**
 * Resets the active board back to initial empty state, retaining undo history.
 */
export function reset(history: HistoryState): HistoryState {
	const cleared = resetBoardState(history.present);
	return pushState(history, cleared, 0);
}

/**
 * Higher-level History Stack Manager for stateful consumption in game controllers.
 */
export class HistoryManager {
	private state: HistoryState;

	constructor(initialBoard: BoardState) {
		this.state = createHistory(initialBoard);
	}

	getBoard(): BoardState {
		return this.state.present;
	}

	getState(): HistoryState {
		return this.state;
	}

	canUndo(): boolean {
		return canUndo(this.state);
	}

	canRedo(): boolean {
		return canRedo(this.state);
	}

	getGrassPlacedCount(): number {
		return this.state.grassPlacedCount;
	}

	getMoveCount(): number {
		return this.state.moveCount;
	}

	setMark(row: number, col: number, mark: PlayerMark): BoardState {
		this.state = setCellMark(this.state, row, col, mark);
		return this.state.present;
	}

	batchSetMarks(cells: { row: number; col: number; mark: PlayerMark }[]): BoardState {
		this.state = batchSetMarks(this.state, cells);
		return this.state.present;
	}

	undo(): BoardState | null {
		if (!this.canUndo()) return null;
		this.state = undo(this.state);
		return this.state.present;
	}

	redo(): BoardState | null {
		if (!this.canRedo()) return null;
		this.state = redo(this.state);
		return this.state.present;
	}

	reset(): BoardState {
		this.state = reset(this.state);
		return this.state.present;
	}
}

/**
 * Factory helper for HistoryManager.
 */
export function createHistoryStack(initialBoard: BoardState): HistoryManager {
	return new HistoryManager(initialBoard);
}
