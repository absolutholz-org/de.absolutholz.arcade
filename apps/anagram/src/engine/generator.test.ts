import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { generateRound, shuffleRack } from './generator.ts';
import { getAnagramData } from './lexicon.ts';
import { DIFFICULTY_CONFIGS, type DifficultyLevel } from './types.ts';
import { canFormWord } from './validator.ts';

describe('getAnagramData', () => {
	it('finds anagram siblings via sorted signatures', () => {
		const { words } = getAnagramData(['s', 't', 'a', 'r', 'e'], 'easy');
		for (const word of ['stare', 'aster', 'tears', 'rates', 'tea', 'eat', 'ate']) {
			assert.ok(words.includes(word), word);
		}
	});

	it('excludes words below the tier minimum length', () => {
		const { words } = getAnagramData(['s', 't', 'a', 'r', 'e'], 'expert');
		assert.ok(words.every((word) => word.length >= 4));
	});

	it('returns sorted words, full-length words and normalized rack', () => {
		const data = getAnagramData(['S', 'T', 'A', 'R', 'E'], 'easy');
		assert.deepEqual(data.rack, ['s', 't', 'a', 'r', 'e']);
		assert.deepEqual(
			data.words,
			[...data.words].sort((a, b) => a.localeCompare(b)),
		);
		assert.ok(data.fullLengthWords.every((word) => word.length === 5));
	});
});

describe('generateRound', () => {
	const levels = Object.keys(DIFFICULTY_CONFIGS) as DifficultyLevel[];

	// The starter fixture is too small to satisfy target word counts, so only structural invariants are asserted.
	it('builds solvable rounds for every tier', () => {
		for (const level of levels) {
			const round = generateRound(level);
			assert.ok(round.words.length > 0, level);
			assert.ok(
				round.words.every((word) => canFormWord(word, round.rack)),
				level,
			);
			assert.ok(
				round.words.every((word) => word.length >= DIFFICULTY_CONFIGS[level].minWordLength),
				level,
			);
		}
	});

	it('is deterministic for a seeded random source', () => {
		const makeRandom = () => {
			let seed = 7;
			return () => {
				seed = (seed * 16807) % 2147483647;
				return seed / 2147483647;
			};
		};
		assert.deepEqual(generateRound('medium', 'en', makeRandom()), generateRound('medium', 'en', makeRandom()));
	});

	it('generates diverse root words across seeded rounds (at least 6 distinct words in 10 rounds)', () => {
		const makeRandom = (initialSeed: number) => {
			let seed = initialSeed;
			return () => {
				seed = (seed * 16807) % 2147483647;
				return seed / 2147483647;
			};
		};

		for (const level of ['medium', 'expert'] as const) {
			const rootSignatures = new Set<string>();
			for (let i = 1; i <= 10; i++) {
				const round = generateRound(level, 'en', makeRandom(i * 100 + 7));
				const signature = [...round.rack].sort().join('');
				rootSignatures.add(signature);
			}
			assert.ok(
				rootSignatures.size >= 6,
				`Expected at least 6 distinct root words for ${level}, got ${rootSignatures.size}`,
			);
		}
	});
});

describe('shuffleRack', () => {
	it('preserves the tile multiset without mutating the input', () => {
		const rack = ['a', 'b', 'b', 'c'];
		const shuffled = shuffleRack(rack);
		assert.deepEqual([...shuffled].sort(), [...rack].sort());
		assert.deepEqual(rack, ['a', 'b', 'b', 'c']);
	});
});
