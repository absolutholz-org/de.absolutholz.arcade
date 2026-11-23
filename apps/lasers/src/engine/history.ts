import type { LaserGrid } from './types.ts';

export interface HistoryState {
	readonly past: readonly LaserGrid[];
	readonly present: LaserGrid;
	readonly future: readonly LaserGrid[];
}

export function createHistory(initial: LaserGrid): HistoryState {
	return {
		past: [],
		present: initial,
		future: [],
	};
}

export function pushHistory(state: HistoryState, next: LaserGrid): HistoryState {
	return {
		past: [...state.past, state.present],
		present: next,
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
	if (state.past.length === 0) return state;
	const previous = state.past[state.past.length - 1];
	return {
		past: state.past.slice(0, -1),
		present: previous,
		future: [state.present, ...state.future],
	};
}

export function redoHistory(state: HistoryState): HistoryState {
	if (state.future.length === 0) return state;
	const next = state.future[0];
	return {
		past: [...state.past, state.present],
		present: next,
		future: state.future.slice(1),
	};
}

export function resetHistory(initial: LaserGrid): HistoryState {
	return createHistory(initial);
}
