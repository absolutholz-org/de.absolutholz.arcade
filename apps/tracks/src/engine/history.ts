import type { BoardState, CellState, HistoryState } from './types.ts';

/**
 * Creates a deep copy of a BoardState.
 */
export function cloneBoardState(state: BoardState): BoardState {
	return {
		...state,
		rowClues: [...state.rowClues],
		colClues: [...state.colClues],
		start: { ...state.start },
		end: { ...state.end },
		fixedCells: state.fixedCells.map((f) => ({ ...f })),
		grid: state.grid.map((row) => [...row]),
	};
}

/**
 * Creates an initial HistoryState wrapper around the provided BoardState.
 */
export function createHistory(initialState: BoardState): HistoryState {
	return {
		past: [],
		present: cloneBoardState(initialState),
		future: [],
	};
}

/**
 * Returns whether an undo action is available.
 */
export function canUndo(history: HistoryState): boolean {
	return history.past.length > 0;
}

/**
 * Returns whether a redo action is available.
 */
export function canRedo(history: HistoryState): boolean {
	return history.future.length > 0;
}

/**
 * Immutably records a new BoardState into history, appending the present state to past
 * and clearing any redo future.
 */
export function pushState(history: HistoryState, nextState: BoardState): HistoryState {
	return {
		past: [...history.past, history.present],
		present: cloneBoardState(nextState),
		future: [],
	};
}

/**
 * Immutably restores the most recent past state, shifting the current present state into the redo future.
 */
export function undo(history: HistoryState): HistoryState {
	if (!canUndo(history)) {
		return history;
	}

	const previous = history.past[history.past.length - 1];
	const newPast = history.past.slice(0, -1);

	return {
		past: newPast,
		present: previous,
		future: [history.present, ...history.future],
	};
}

/**
 * Immutably reapplies the next future state, shifting the current present state into past.
 */
export function redo(history: HistoryState): HistoryState {
	if (!canRedo(history)) {
		return history;
	}

	const next = history.future[0];
	const newFuture = history.future.slice(1);

	return {
		past: [...history.past, history.present],
		present: next,
		future: newFuture,
	};
}

/**
 * Resets the board by clearing all non-fixed cells to 'empty' and restoring all fixedCells.
 */
export function resetBoardState(state: BoardState): BoardState {
	const grid: CellState[][] = Array.from({ length: state.size }, () =>
		Array.from({ length: state.size }, () => 'empty' as CellState),
	);

	for (const fixed of state.fixedCells) {
		if (fixed.row >= 0 && fixed.row < state.size && fixed.col >= 0 && fixed.col < state.size) {
			grid[fixed.row][fixed.col] = fixed.track;
		}
	}

	return {
		...cloneBoardState(state),
		grid,
	};
}

/**
 * Immutably resets the present board (restoring only fixedCells) while retaining past history so the reset can be undone.
 */
export function reset(history: HistoryState): HistoryState {
	const cleared = resetBoardState(history.present);
	return pushState(history, cleared);
}
