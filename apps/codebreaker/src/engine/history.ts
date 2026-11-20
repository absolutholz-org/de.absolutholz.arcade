import type { DraftRow } from './types.ts';

export interface DraftEntry {
	readonly draft: DraftRow;
	readonly selectedSlot: number;
}

export interface DraftHistoryState {
	readonly past: readonly DraftEntry[];
	readonly present: DraftEntry;
	readonly future: readonly DraftEntry[];
}

export function createEmptyDraft(codeLength: number): DraftRow {
	return Array.from({ length: codeLength }, () => null);
}

export function createDraftHistory(codeLength: number, initialDraft?: DraftRow, initialSlot = 0): DraftHistoryState {
	const draft = initialDraft ? [...initialDraft] : createEmptyDraft(codeLength);
	const clampedSlot = Math.max(0, Math.min(codeLength - 1, initialSlot));
	return {
		past: [],
		present: { draft, selectedSlot: clampedSlot },
		future: [],
	};
}

export function pushDraftState(
	history: DraftHistoryState,
	nextDraft: DraftRow,
	nextSelectedSlot: number,
): DraftHistoryState {
	const prev = history.present.draft;
	const unchanged = prev.length === nextDraft.length && prev.every((peg, index) => peg === nextDraft[index]);

	if (unchanged) {
		if (history.present.selectedSlot === nextSelectedSlot) {
			return history;
		}
		return {
			...history,
			present: {
				draft: history.present.draft,
				selectedSlot: nextSelectedSlot,
			},
		};
	}

	return {
		past: [...history.past, history.present],
		present: {
			draft: [...nextDraft],
			selectedSlot: nextSelectedSlot,
		},
		future: [],
	};
}

export function undoDraftState(history: DraftHistoryState): DraftHistoryState {
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

export function redoDraftState(history: DraftHistoryState): DraftHistoryState {
	if (history.future.length === 0) {
		return history;
	}
	const [next, ...restFuture] = history.future;
	return {
		past: [...history.past, history.present],
		present: next,
		future: restFuture,
	};
}

export function canUndoDraft(history: DraftHistoryState): boolean {
	return history.past.length > 0;
}

export function canRedoDraft(history: DraftHistoryState): boolean {
	return history.future.length > 0;
}
