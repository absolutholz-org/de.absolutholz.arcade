import assert from 'node:assert/strict';
import { afterEach, describe, it } from 'node:test';
import { DIFFICULTIES, DIFFICULTY_CONFIGS, isDifficulty, resolveInitialDifficulty } from './types.ts';

describe('Net Engine: Types & Difficulty Resolution', () => {
	const originalWindow = globalThis.window;

	afterEach(() => {
		if (originalWindow !== undefined) {
			globalThis.window = originalWindow;
		} else {
			// @ts-expect-error cleanup mock
			globalThis.window = undefined;
		}
	});

	it('defines correct grid dimensions for all difficulties', () => {
		assert.deepEqual(DIFFICULTIES, ['easy', 'medium', 'hard', 'expert']);
		assert.deepEqual(DIFFICULTY_CONFIGS.easy, { rows: 5, cols: 5 });
		assert.deepEqual(DIFFICULTY_CONFIGS.medium, { rows: 7, cols: 7 });
		assert.deepEqual(DIFFICULTY_CONFIGS.hard, { rows: 9, cols: 9 });
		assert.deepEqual(DIFFICULTY_CONFIGS.expert, { rows: 11, cols: 11 });
	});

	it('validates difficulty keys via isDifficulty', () => {
		assert.equal(isDifficulty('easy'), true);
		assert.equal(isDifficulty('medium'), true);
		assert.equal(isDifficulty('hard'), true);
		assert.equal(isDifficulty('expert'), true);
		assert.equal(isDifficulty('unknown'), false);
		assert.equal(isDifficulty(null), false);
		assert.equal(isDifficulty(undefined), false);
		assert.equal(isDifficulty(123), false);
	});

	it('falls back to provided initial or easy when window is undefined', () => {
		// @ts-expect-error simulate SSR
		globalThis.window = undefined;
		assert.equal(resolveInitialDifficulty(), 'easy');
		assert.equal(resolveInitialDifficulty('medium'), 'medium');
		assert.equal(resolveInitialDifficulty('hard'), 'hard');
		assert.equal(resolveInitialDifficulty('expert'), 'expert');
	});

	it('extracts difficulty from URL search parameters on client side', () => {
		for (const diff of DIFFICULTIES) {
			globalThis.window = {
				location: {
					search: `?difficulty=${diff}&new=true`,
				},
			} as unknown as Window & typeof globalThis;
			assert.equal(resolveInitialDifficulty(), diff);
			assert.equal(resolveInitialDifficulty('easy'), diff);
		}
	});

	it('ignores invalid or empty URL search params and uses fallback', () => {
		globalThis.window = {
			location: {
				search: '?difficulty=invalid&new=true',
			},
		} as unknown as Window & typeof globalThis;
		assert.equal(resolveInitialDifficulty('hard'), 'hard');
		assert.equal(resolveInitialDifficulty(), 'easy');

		globalThis.window = {
			location: {
				search: '',
			},
		} as unknown as Window & typeof globalThis;
		assert.equal(resolveInitialDifficulty('expert'), 'expert');
		assert.equal(resolveInitialDifficulty(), 'easy');
	});
});
