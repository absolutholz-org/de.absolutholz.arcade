import type { Placement } from './types.ts';

export interface HistoryState {
	readonly past: ReadonlyArray<ReadonlyArray<Placement>>;
	readonly present: ReadonlyArray<Placement>;
	readonly future: ReadonlyArray<ReadonlyArray<Placement>>;
}

export const MAX_HISTORY_DEPTH = 100;

export function createHistory(initial: ReadonlyArray<Placement> = []): HistoryState {
	return {
		past: [],
		present: [...initial],
		future: [],
	};
}

export function pushHistory(state: HistoryState, nextPlacements: ReadonlyArray<Placement>): HistoryState {
	const nextPast = [...state.past, state.present];
	if (nextPast.length > MAX_HISTORY_DEPTH) {
		nextPast.shift();
	}
	return {
		past: nextPast,
		present: [...nextPlacements],
		future: [],
	};
}

export function canUndo(state: HistoryState): boolean {
	return state.past.length > 0;
}

export function canRedo(state: HistoryState): boolean {
	return state.future.length > 0;
}

export function undoHistory(state: HistoryState): HistoryState {
	if (state.past.length === 0) {
		return state;
	}
	const previous = state.past[state.past.length - 1] ?? [];
	const nextPast = state.past.slice(0, state.past.length - 1);
	return {
		past: nextPast,
		present: previous,
		future: [state.present, ...state.future],
	};
}

export function redoHistory(state: HistoryState): HistoryState {
	if (state.future.length === 0) {
		return state;
	}
	const next = state.future[0] ?? [];
	const nextFuture = state.future.slice(1);
	return {
		past: [...state.past, state.present],
		present: next,
		future: nextFuture,
	};
}
