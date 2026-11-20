import { isConsistentWithHistory, isConsistentWithRow } from './scorer.ts';
import type { CodeRuleConfig, DraftRow, GuessRow, HintResult, PegColorId } from './types.ts';

function hasDuplicateColors(draft: DraftRow): boolean {
	const seen = new Set<PegColorId>();
	for (const peg of draft) {
		if (peg !== null) {
			if (seen.has(peg)) {
				return true;
			}
			seen.add(peg);
		}
	}
	return false;
}

/**
 * Deterministically searches for the first valid candidate secret code that:
 * 1. Matches all non-null slots in `draft`
 * 2. Respects `config.allowDuplicates`
 * 3. Satisfies every row in `rows`
 */
export function findConsistentCandidate(
	rows: readonly GuessRow[],
	draft: DraftRow,
	config: CodeRuleConfig,
): PegColorId[] | null {
	const { codeLength, colorCount, allowDuplicates } = config;
	const candidate: PegColorId[] = new Array(codeLength).fill(0) as PegColorId[];
	const used = [false, false, false, false, false, false, false, false];

	// Pre-validate fixed slots from draft
	for (let i = 0; i < codeLength; i += 1) {
		const fixed = draft[i] ?? null;
		if (fixed !== null) {
			if (fixed < 0 || fixed >= colorCount) {
				return null;
			}
			if (!allowDuplicates && used[fixed]) {
				return null;
			}
			candidate[i] = fixed;
			used[fixed] = true;
		}
	}

	function backtrack(slot: number): boolean {
		if (slot === codeLength) {
			return isConsistentWithHistory(candidate, rows);
		}

		if ((draft[slot] ?? null) !== null) {
			return backtrack(slot + 1);
		}

		for (let c = 0; c < colorCount; c += 1) {
			if (!allowDuplicates && used[c]) {
				continue;
			}
			candidate[slot] = c as PegColorId;
			if (!allowDuplicates) {
				used[c] = true;
			}
			if (backtrack(slot + 1)) {
				return true;
			}
			if (!allowDuplicates) {
				used[c] = false;
			}
		}

		return false;
	}

	return backtrack(0) ? [...candidate] : null;
}

/**
 * Computes a deterministic logical consistency hint for the active draft row.
 *
 * - If `allowDuplicates` is false and the draft already contains duplicate colors, flags `duplicate-disallowed`.
 * - If the current draft pegs contradict prior feedback clues, returns `contradiction` with the
 *   0-based index of the conflicting historical row.
 * - Otherwise, if the draft is complete, confirms it is consistent (`consistent-complete`).
 * - Otherwise, suggests a valid color for the first empty slot from a deterministic consistent candidate.
 */
export function computeHint(history: readonly GuessRow[], draft: DraftRow, config: CodeRuleConfig): HintResult {
	if (!config.allowDuplicates && hasDuplicateColors(draft)) {
		return { kind: 'duplicate-disallowed' };
	}

	const candidate = findConsistentCandidate(history, draft, config);

	if (candidate !== null) {
		const firstEmptySlot = draft.findIndex((peg) => peg === null);
		if (firstEmptySlot === -1) {
			return { kind: 'consistent-complete' };
		}
		return {
			kind: 'suggestion',
			slotIndex: firstEmptySlot,
			colorId: candidate[firstEmptySlot],
		};
	}

	// No candidate extends the current draft across all history rows.
	// First check if the draft directly contradicts a single row on its own.
	for (let i = 0; i < history.length; i += 1) {
		const singleRowCandidate = findConsistentCandidate([history[i]], draft, config);
		if (singleRowCandidate === null) {
			return { kind: 'contradiction', conflictingRowIndex: i };
		}
	}

	// Otherwise, find the earliest prefix history[0..i] that becomes unsatisfiable with this draft.
	for (let i = 1; i < history.length; i += 1) {
		const prefixCandidate = findConsistentCandidate(history.slice(0, i + 1), draft, config);
		if (prefixCandidate === null) {
			return { kind: 'contradiction', conflictingRowIndex: i };
		}
	}

	// Fallback if draft is complete and matches nothing (should already be caught above)
	const lastRowIdx = Math.max(0, history.length - 1);
	if (history.length > 0 && !draft.includes(null)) {
		const fullDraft = draft as readonly PegColorId[];
		for (let i = 0; i < history.length; i += 1) {
			if (!isConsistentWithRow(fullDraft, history[i])) {
				return { kind: 'contradiction', conflictingRowIndex: i };
			}
		}
	}

	return { kind: 'contradiction', conflictingRowIndex: lastRowIdx };
}
