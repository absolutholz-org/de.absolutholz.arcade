import type { FeedbackResult, GuessRow, PegColorId } from './types.ts';

/**
 * Two-pass feedback scoring algorithm.
 *
 * Pass 1: Count exact matches (same color at the same index) and mark those positions consumed.
 * Pass 2: Count color-only matches among remaining unmatched pegs using frequency counts so
 *         duplicate colors are never double-counted.
 */
export function scoreGuess(secret: readonly PegColorId[], guess: readonly PegColorId[]): FeedbackResult {
	if (secret.length !== guess.length) {
		throw new RangeError(`Secret length (${secret.length}) does not match guess length (${guess.length}).`);
	}

	const secretCounts = [0, 0, 0, 0, 0, 0, 0, 0];
	const guessCounts = [0, 0, 0, 0, 0, 0, 0, 0];
	let exact = 0;

	for (let i = 0; i < secret.length; i += 1) {
		const s = secret[i];
		const g = guess[i];
		if (s === g) {
			exact += 1;
		} else {
			secretCounts[s] += 1;
			guessCounts[g] += 1;
		}
	}

	let partial = 0;
	for (let c = 0; c < 8; c += 1) {
		const sCount = secretCounts[c];
		const gCount = guessCounts[c];
		partial += sCount < gCount ? sCount : gCount;
	}

	return { exact, partial };
}

/**
 * Checks whether a candidate secret code produces the exact same feedback for a single historical guess.
 */
export function isConsistentWithRow(candidate: readonly PegColorId[], row: GuessRow): boolean {
	const result = scoreGuess(candidate, row.guess);
	return result.exact === row.feedback.exact && result.partial === row.feedback.partial;
}

/**
 * Checks whether a candidate secret code is consistent with every submitted guess in history.
 */
export function isConsistentWithHistory(candidate: readonly PegColorId[], history: readonly GuessRow[]): boolean {
	for (let i = 0; i < history.length; i += 1) {
		if (!isConsistentWithRow(candidate, history[i])) {
			return false;
		}
	}
	return true;
}
