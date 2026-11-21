export interface HistoryState<T> {
	readonly past: readonly T[];
	readonly present: T;
	readonly future: readonly T[];
}

const MAX_HISTORY_LENGTH = 200;

export function createHistory<T>(initial: T): HistoryState<T> {
	return {
		past: [],
		present: initial,
		future: [],
	};
}

export function pushHistory<T>(history: HistoryState<T>, nextPresent: T): HistoryState<T> {
	const nextPast =
		history.past.length >= MAX_HISTORY_LENGTH
			? [...history.past.slice(history.past.length - MAX_HISTORY_LENGTH + 1), history.present]
			: [...history.past, history.present];
	return {
		past: nextPast,
		present: nextPresent,
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
	const nextPast = history.past.slice(0, -1);
	return {
		past: nextPast,
		present: previous,
		future: [history.present, ...history.future],
	};
}

export function redoHistory<T>(history: HistoryState<T>): HistoryState<T> {
	if (history.future.length === 0) return history;
	const next = history.future[0];
	const nextFuture = history.future.slice(1);
	return {
		past: [...history.past, history.present],
		present: next,
		future: nextFuture,
	};
}
