export interface HistoryState<T> {
	readonly past: readonly T[];
	readonly present: T;
	readonly future: readonly T[];
}

const MAX_HISTORY_SIZE = 200;

export function createHistory<T>(initial: T): HistoryState<T> {
	return {
		past: [],
		present: initial,
		future: [],
	};
}

export function pushHistory<T>(history: HistoryState<T>, next: T): HistoryState<T> {
	const nextPast = [...history.past, history.present];
	if (nextPast.length > MAX_HISTORY_SIZE) {
		nextPast.shift();
	}
	return {
		past: nextPast,
		present: next,
		future: [],
	};
}

export function canUndo<T>(history: HistoryState<T>): boolean {
	return history.past.length > 0;
}

export function canRedo<T>(history: HistoryState<T>): boolean {
	return history.future.length > 0;
}

export function undoHistory<T>(history: HistoryState<T>): HistoryState<T> {
	if (history.past.length === 0) return history;
	const previous = history.past[history.past.length - 1];
	if (previous === undefined) return history;
	return {
		past: history.past.slice(0, -1),
		present: previous,
		future: [history.present, ...history.future],
	};
}

export function redoHistory<T>(history: HistoryState<T>): HistoryState<T> {
	if (history.future.length === 0) return history;
	const next = history.future[0];
	if (next === undefined) return history;
	return {
		past: [...history.past, history.present],
		present: next,
		future: history.future.slice(1),
	};
}
