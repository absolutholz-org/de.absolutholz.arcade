import type { Cell, GameStatus } from './types';

export interface HistoryStep {
	readonly cells: Cell[];
	readonly minesPlaced: boolean;
	readonly status: GameStatus;
}

export interface HistoryState {
	readonly past: readonly HistoryStep[];
	readonly present: HistoryStep;
	readonly future: readonly HistoryStep[];
}

export function createHistory(initialStep: HistoryStep): HistoryState {
	return {
		past: [],
		present: initialStep,
		future: [],
	};
}

export function pushHistory(history: HistoryState, nextStep: HistoryStep): HistoryState {
	return {
		past: [...history.past, history.present],
		present: nextStep,
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
	if (history.past.length === 0) {
		return history;
	}

	const previous = history.past[history.past.length - 1];
	return {
		past: history.past.slice(0, -1),
		present: previous,
		future: [history.present, ...history.future],
	};
}

export function redoHistory(history: HistoryState): HistoryState {
	if (history.future.length === 0) {
		return history;
	}

	const next = history.future[0];
	return {
		past: [...history.past, history.present],
		present: next,
		future: history.future.slice(1),
	};
}
