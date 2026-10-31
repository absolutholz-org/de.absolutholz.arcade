import type { Move } from './types.ts';

export interface HistoryState {
	readonly past: readonly Move[];
	readonly future: readonly Move[];
}

export function createHistory(): HistoryState {
	return {
		past: [],
		future: [],
	};
}

export function pushMove(history: HistoryState, move: Move): HistoryState {
	return {
		past: [...history.past, move],
		future: [], // New branch clears redo stack
	};
}

export function canUndo(history: HistoryState): boolean {
	return history.past.length > 0;
}

export function canRedo(history: HistoryState): boolean {
	return history.future.length > 0;
}

export function undoMove(history: HistoryState): {
	readonly nextHistory: HistoryState;
	readonly move: Move | null;
} {
	if (history.past.length === 0) {
		return { nextHistory: history, move: null };
	}

	const move = history.past[history.past.length - 1];
	const nextHistory: HistoryState = {
		past: history.past.slice(0, -1),
		future: [move, ...history.future],
	};

	return { nextHistory, move };
}

export function redoMove(history: HistoryState): {
	readonly nextHistory: HistoryState;
	readonly move: Move | null;
} {
	if (history.future.length === 0) {
		return { nextHistory: history, move: null };
	}

	const move = history.future[0];
	const nextHistory: HistoryState = {
		past: [...history.past, move],
		future: history.future.slice(1),
	};

	return { nextHistory, move };
}
