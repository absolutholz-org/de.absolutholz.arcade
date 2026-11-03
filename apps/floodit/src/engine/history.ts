import type { BoardState } from './types.ts';

export interface HistoryState {
	readonly past: readonly BoardState[];
	readonly present: BoardState;
	readonly future: readonly BoardState[];
}

export function createHistory(initial: BoardState): HistoryState {
	return {
		past: [],
		present: initial,
		future: [],
	};
}

export function pushState(history: HistoryState, next: BoardState): HistoryState {
	return {
		past: [...history.past, history.present],
		present: next,
		future: [],
	};
}

export function undo(history: HistoryState): HistoryState {
	if (history.past.length === 0) return history;
	const previous = history.past[history.past.length - 1];
	const newPast = history.past.slice(0, -1);
	return {
		past: newPast,
		present: previous,
		future: [history.present, ...history.future],
	};
}

export function redo(history: HistoryState): HistoryState {
	if (history.future.length === 0) return history;
	const next = history.future[0];
	const newFuture = history.future.slice(1);
	return {
		past: [...history.past, history.present],
		present: next,
		future: newFuture,
	};
}
