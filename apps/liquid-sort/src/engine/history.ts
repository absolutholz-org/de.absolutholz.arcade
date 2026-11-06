import type { Board, HistoryState } from './types.ts';

export function createHistory(initialBoard: Board): HistoryState {
	return { past: [], present: initialBoard, future: [] };
}

export function canUndo(history: HistoryState): boolean {
	return history.past.length > 0;
}

export function canRedo(history: HistoryState): boolean {
	return history.future.length > 0;
}

/** Records a new board, appending the present board to the past and clearing any redo future. */
export function pushState(history: HistoryState, nextBoard: Board): HistoryState {
	return { past: [...history.past, history.present], present: nextBoard, future: [] };
}

export function undo(history: HistoryState): HistoryState {
	if (!canUndo(history)) {
		return history;
	}
	return {
		past: history.past.slice(0, -1),
		present: history.past[history.past.length - 1],
		future: [history.present, ...history.future],
	};
}

export function redo(history: HistoryState): HistoryState {
	if (!canRedo(history)) {
		return history;
	}
	return {
		past: [...history.past, history.present],
		present: history.future[0],
		future: history.future.slice(1),
	};
}

/** Restores the starting board while keeping history, so the reset itself can be undone. */
export function reset(history: HistoryState): HistoryState {
	const initialBoard = history.past[0] ?? history.present;
	return initialBoard === history.present ? history : pushState(history, initialBoard);
}
