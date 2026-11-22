import { cloneBoard } from './board.ts';
import type { GameStateSnapshot } from './types.ts';

export interface MoveHistory {
	readonly entries: readonly GameStateSnapshot[];
	readonly index: number;
}

function cloneSnapshot(snapshot: GameStateSnapshot): GameStateSnapshot {
	return {
		board: cloneBoard(snapshot.board),
		score: snapshot.score,
		movesCount: snapshot.movesCount,
		maxClusterCleared: snapshot.maxClusterCleared,
		remainingTiles: snapshot.remainingTiles,
	};
}

export function createHistory(initialState: GameStateSnapshot): MoveHistory {
	return {
		entries: [cloneSnapshot(initialState)],
		index: 0,
	};
}

export function pushHistory(history: MoveHistory, nextState: GameStateSnapshot): MoveHistory {
	const truncated = history.entries.slice(0, history.index + 1);
	return {
		entries: [...truncated, cloneSnapshot(nextState)],
		index: truncated.length,
	};
}

export function canUndo(history: MoveHistory): boolean {
	return history.index > 0;
}

export function canRedo(history: MoveHistory): boolean {
	return history.index < history.entries.length - 1;
}

export function undoHistory(history: MoveHistory): MoveHistory {
	if (!canUndo(history)) return history;
	return {
		entries: history.entries,
		index: history.index - 1,
	};
}

export function redoHistory(history: MoveHistory): MoveHistory {
	if (!canRedo(history)) return history;
	return {
		entries: history.entries,
		index: history.index + 1,
	};
}

export function getCurrentSnapshot(history: MoveHistory): GameStateSnapshot {
	const current = history.entries[history.index] ?? history.entries[0];
	if (!current) {
		throw new Error('MoveHistory must always contain at least one snapshot.');
	}
	return cloneSnapshot(current);
}
