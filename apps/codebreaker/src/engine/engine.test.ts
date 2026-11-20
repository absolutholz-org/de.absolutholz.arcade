import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { generateSecretCode } from './generator.ts';
import {
	canRedoDraft,
	canUndoDraft,
	createDraftHistory,
	pushDraftState,
	redoDraftState,
	undoDraftState,
} from './history.ts';
import { isConsistentWithHistory, scoreGuess } from './scorer.ts';
import { computeHint, findConsistentCandidate } from './solver.ts';
import { DEFAULT_CODEBREAKER_SETTINGS, DIFFICULTY_CONFIGS, type GuessRow, type PegColorId } from './types.ts';

function makeSeededRng(seed: number): () => number {
	let s = seed >>> 0;
	return () => {
		s = (1664525 * s + 1013904223) >>> 0;
		return s / 4294967296;
	};
}

describe('Codebreaker two-pass scoring (scoreGuess)', () => {
	it('scores all exact matches correctly for 4-peg and 5-peg codes', () => {
		assert.deepEqual(scoreGuess([0, 1, 2, 3], [0, 1, 2, 3]), { exact: 4, partial: 0 });
		assert.deepEqual(scoreGuess([7, 5, 3, 1, 0], [7, 5, 3, 1, 0]), { exact: 5, partial: 0 });
	});

	it('scores zero matches correctly', () => {
		assert.deepEqual(scoreGuess([0, 1, 2, 3], [4, 5, 4, 5]), { exact: 0, partial: 0 });
	});

	it('scores pure derangement (all partial, zero exact)', () => {
		assert.deepEqual(scoreGuess([0, 1, 2, 3], [1, 2, 3, 0]), { exact: 0, partial: 4 });
	});

	it('never double-counts when guess repeats a color that appears once in secret', () => {
		// Secret has one 0 at index 0; guess has four 0s -> 1 exact, 0 partial
		assert.deepEqual(scoreGuess([0, 1, 2, 3], [0, 0, 0, 0]), { exact: 1, partial: 0 });
		// Secret has one 0 at index 3; guess has [0, 0, 4, 5] -> 0 exact, 1 partial
		assert.deepEqual(scoreGuess([1, 2, 3, 0], [0, 0, 4, 5]), { exact: 0, partial: 1 });
	});

	it('never double-counts when secret repeats a color that appears once in guess', () => {
		// Secret has three 2s; guess has one 2 at a wrong position -> 0 exact, 1 partial
		assert.deepEqual(scoreGuess([2, 2, 2, 5], [0, 1, 3, 2]), { exact: 0, partial: 1 });
		// Secret has two 2s; guess has one 2 at an exact position -> 1 exact, 0 partial
		assert.deepEqual(scoreGuess([2, 2, 4, 5], [2, 0, 1, 3]), { exact: 1, partial: 0 });
	});

	it('handles mixed exact + partial with multiple duplicate colors accurately', () => {
		assert.deepEqual(scoreGuess([0, 0, 1, 1], [0, 1, 0, 2]), { exact: 1, partial: 2 });
		assert.deepEqual(scoreGuess([2, 2, 2, 0], [2, 0, 2, 2]), { exact: 2, partial: 2 });
		assert.deepEqual(scoreGuess([0, 1, 0, 1, 2], [1, 0, 0, 2, 1]), { exact: 1, partial: 4 });
	});

	it('throws when secret and guess lengths differ', () => {
		assert.throws(() => scoreGuess([0, 1, 2, 3], [0, 1, 2]), RangeError);
	});
});

describe('Codebreaker generator (generateSecretCode)', () => {
	it('generates codes matching each difficulty preset with duplicates allowed', () => {
		const rng = makeSeededRng(42);
		for (const config of Object.values(DIFFICULTY_CONFIGS)) {
			const code = generateSecretCode({ ...config, allowDuplicates: true }, rng);
			assert.equal(code.length, config.codeLength);
			for (const peg of code) {
				assert.ok(peg >= 0 && peg < config.colorCount);
			}
		}
	});

	it('generates strictly unique codes when allowDuplicates is false', () => {
		const rng = makeSeededRng(1337);
		for (let trial = 0; trial < 50; trial += 1) {
			const code = generateSecretCode({ codeLength: 5, colorCount: 8, allowDuplicates: false }, rng);
			assert.equal(code.length, 5);
			assert.equal(new Set(code).size, 5);
		}
	});

	it('throws when unique code length exceeds available color count', () => {
		assert.throws(() => generateSecretCode({ codeLength: 5, colorCount: 4, allowDuplicates: false }), RangeError);
	});
});

describe('Codebreaker default settings', () => {
	it('defaults allowDuplicates to false for unique-color secret codes', () => {
		assert.equal(DEFAULT_CODEBREAKER_SETTINGS.allowDuplicates, false);
	});
});

describe('Codebreaker logical consistency hint (computeHint)', () => {
	const easyConfig = {
		codeLength: 4,
		colorCount: 6,
		allowDuplicates: DEFAULT_CODEBREAKER_SETTINGS.allowDuplicates,
	};

	it('suggests a valid color for slot 0 on an empty board', () => {
		const hint = computeHint([], [null, null, null, null], easyConfig);
		assert.equal(hint.kind, 'suggestion');
		if (hint.kind === 'suggestion') {
			assert.equal(hint.slotIndex, 0);
			assert.ok(hint.colorId >= 0 && hint.colorId < 6);
		}
	});

	it('flags a contradiction when draft places a color ruled out by prior 0/0 feedback', () => {
		const history: GuessRow[] = [{ guess: [0, 0, 0, 0], feedback: { exact: 0, partial: 0 } }];
		const hint = computeHint(history, [0, null, null, null], easyConfig);
		assert.deepEqual(hint, { kind: 'contradiction', conflictingRowIndex: 0 });
	});

	it('pinpoints the exact conflicting row when multiple rows exist', () => {
		const secret: PegColorId[] = [2, 3, 4, 5];
		const history: GuessRow[] = [
			{ guess: [0, 1, 2, 3], feedback: scoreGuess(secret, [0, 1, 2, 3]) }, // 0 exact, 2 partial
			{ guess: [0, 0, 1, 1], feedback: scoreGuess(secret, [0, 0, 1, 1]) }, // 0 exact, 0 partial -> rules out 0 and 1
		];
		// Placing 1 at slot 0 could be a partial match for row 0, so only row 1 (0 exact, 0 partial) is contradicted
		const hint = computeHint(history, [1, null, null, null], easyConfig);
		assert.deepEqual(hint, { kind: 'contradiction', conflictingRowIndex: 1 });
	});

	it('suggests a consistent peg for the first empty slot when draft is partially filled and valid', () => {
		const secret: PegColorId[] = [1, 2, 3, 4];
		const history: GuessRow[] = [
			{ guess: [0, 0, 0, 0], feedback: scoreGuess(secret, [0, 0, 0, 0]) },
			{ guess: [1, 2, 5, 5], feedback: scoreGuess(secret, [1, 2, 5, 5]) },
		];
		const draft = [1 as PegColorId, null, null, null];
		const hint = computeHint(history, draft, easyConfig);
		assert.equal(hint.kind, 'suggestion');
		if (hint.kind === 'suggestion') {
			assert.equal(hint.slotIndex, 1);
			const nextDraft = [...draft];
			nextDraft[hint.slotIndex] = hint.colorId;
			const candidate = findConsistentCandidate(history, nextDraft, easyConfig);
			assert.ok(candidate !== null);
			assert.equal(isConsistentWithHistory(candidate, history), true);
		}
	});

	it('confirms consistent-complete when a full draft satisfies all prior rows', () => {
		const secret: PegColorId[] = [2, 4, 1, 3];
		const history: GuessRow[] = [{ guess: [0, 1, 2, 3], feedback: scoreGuess(secret, [0, 1, 2, 3]) }];
		const hint = computeHint(history, [2, 4, 1, 3], easyConfig);
		assert.deepEqual(hint, { kind: 'consistent-complete' });
	});

	it('flags duplicate-disallowed when allowDuplicates is false and draft repeats a color', () => {
		const noDupConfig = { codeLength: 4, colorCount: 6, allowDuplicates: false };
		const hint = computeHint([], [2, 2, null, null], noDupConfig);
		assert.deepEqual(hint, { kind: 'duplicate-disallowed' });
	});

	it('allows repeated colors in draft when allowDuplicates is explicitly true', () => {
		const dupConfig = { codeLength: 4, colorCount: 6, allowDuplicates: true };
		const hint = computeHint([], [2, 2, null, null], dupConfig);
		assert.equal(hint.kind, 'suggestion');
	});

	it('solves 5-peg Hard difficulty hints deterministically', () => {
		const hardConfig = { codeLength: 5, colorCount: 8, allowDuplicates: true };
		const secret: PegColorId[] = [3, 6, 1, 7, 2];
		const history: GuessRow[] = [
			{ guess: [0, 1, 2, 3, 4], feedback: scoreGuess(secret, [0, 1, 2, 3, 4]) },
			{ guess: [5, 6, 7, 0, 1], feedback: scoreGuess(secret, [5, 6, 7, 0, 1]) },
		];
		const hint = computeHint(history, [3, null, null, null, null], hardConfig);
		assert.equal(hint.kind, 'suggestion');
		if (hint.kind === 'suggestion') {
			assert.equal(hint.slotIndex, 1);
		}
	});
});

describe('Codebreaker active-row draft history (undo/redo)', () => {
	it('pushes, undoes, and redoes peg placements cleanly', () => {
		let state = createDraftHistory(4);
		assert.equal(canUndoDraft(state), false);
		assert.equal(canRedoDraft(state), false);

		state = pushDraftState(state, [0, null, null, null], 1);
		state = pushDraftState(state, [0, 2, null, null], 2);
		assert.equal(canUndoDraft(state), true);
		assert.deepEqual(state.present.draft, [0, 2, null, null]);

		state = undoDraftState(state);
		assert.deepEqual(state.present.draft, [0, null, null, null]);
		assert.equal(state.present.selectedSlot, 1);
		assert.equal(canRedoDraft(state), true);

		state = redoDraftState(state);
		assert.deepEqual(state.present.draft, [0, 2, null, null]);
		assert.equal(state.present.selectedSlot, 2);
		assert.equal(canRedoDraft(state), false);
	});
});
