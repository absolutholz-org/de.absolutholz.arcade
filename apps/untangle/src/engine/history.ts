import type { BoardState, HistoryState } from './types.ts';

export function createInitialHistory(board: BoardState): HistoryState {
	return {
		past: [],
		present: board,
		future: [],
	};
}

export function pushHistory(history: HistoryState, nextBoard: BoardState): HistoryState {
	return {
		past: [...history.past, history.present],
		present: nextBoard,
		future: [],
	};
}

export function canUndo(history: HistoryState): boolean {
	return history.past.length > 0;
}

export function canRedo(history: HistoryState): boolean {
	return history.future.length > 0;
}

export function undoHistory(history: HistoryState): HistoryState {
	const previous = history.past[history.past.length - 1];
	if (!previous) {
		return history;
	}

	const nextPast = history.past.slice(0, -1);

	return {
		past: nextPast,
		present: previous,
		future: [history.present, ...history.future],
	};
}

export function redoHistory(history: HistoryState): HistoryState {
	const next = history.future[0];
	if (!next) {
		return history;
	}

	const nextFuture = history.future.slice(1);

	return {
		past: [...history.past, history.present],
		present: next,
		future: nextFuture,
	};
}
