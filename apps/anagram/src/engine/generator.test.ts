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
	it('resolves German anagrams with umlauts and ß via the de lexicon', () => {
		const { words } = getAnagramData(['ä', 'p', 'f', 'e', 'l'], 'easy', 'de');
		assert.ok(words.includes('äpfel'), 'Expected äpfel in words');
		const fuesse = getAnagramData(['f', 'ü', 'ß', 'e', 'n'], 'easy', 'de');
		assert.ok(fuesse.words.includes('füße'), 'Expected füße in words');
		assert.ok(fuesse.words.includes('füßen'), 'Expected füßen in words');
	});

	it('resolves Portuguese accented words from unaccented rack tiles via the pt lexicon', () => {
		const { rack, words } = getAnagramData(['m', 'a', 'c', 'a', 's'], 'easy', 'pt');
		assert.deepEqual(rack, ['m', 'a', 'c', 'a', 's']);
		assert.ok(words.includes('maçã'), 'Expected maçã in words');
		const agua = getAnagramData(['a', 'g', 'u', 'a', 's'], 'easy', 'pt');
		assert.ok(agua.words.includes('água'), 'Expected água in words');
	});
});

describe('generateRound', () => {
	const levels = Object.keys(DIFFICULTY_CONFIGS) as DifficultyLevel[];

	it('builds solvable rounds for every tier in English, German, and Portuguese', () => {
		for (const language of ['en', 'de', 'pt'] as const) {
			for (const level of levels) {
				const round = generateRound(level, language);
				assert.ok(round.words.length > 0, `${language}:${level}`);
				if (language === 'de' || language === 'pt') {
					assert.equal(
						round.rack.length,
						DIFFICULTY_CONFIGS[level].rackSize,
						`Expected ${DIFFICULTY_CONFIGS[level].rackSize} tiles for ${language}:${level}`,
					);
					assert.ok(
						round.words.length >= 6,
						`Expected >= 6 sub-words for ${language}:${level}, got ${round.words.length}`,
					);
				}
				assert.ok(
					round.words.every((word) => canFormWord(word, round.rack)),
					`${language}:${level}`,
				);
				assert.ok(
					round.words.every((word) => Array.from(word).length >= DIFFICULTY_CONFIGS[level].minWordLength),
					`${language}:${level}`,
				);
			}
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
		assert.deepEqual(generateRound('medium', 'de', makeRandom()), generateRound('medium', 'de', makeRandom()));
		assert.deepEqual(generateRound('medium', 'pt', makeRandom()), generateRound('medium', 'pt', makeRandom()));
	});

	it('generates diverse root words across seeded rounds (at least 6 distinct words in 10 rounds)', () => {
		const makeRandom = (initialSeed: number) => {
			let seed = initialSeed;
			return () => {
				seed = (seed * 16807) % 2147483647;
				return seed / 2147483647;
			};
		};

		for (const language of ['en', 'de', 'pt'] as const) {
			for (const level of ['easy', 'medium', 'hard', 'expert'] as const) {
				const rootSignatures = new Set<string>();
				for (let i = 1; i <= 10; i++) {
					const round = generateRound(level, language, makeRandom(i * 100 + 7));
					const signature = [...round.rack].sort().join('');
					rootSignatures.add(signature);
				}
				assert.ok(
					rootSignatures.size >= 6,
					`Expected at least 6 distinct root words for ${language}:${level}, got ${rootSignatures.size}`,
				);
			}
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
