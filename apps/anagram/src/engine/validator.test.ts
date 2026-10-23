import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { getAnagramData } from './lexicon.ts';
import { canFormWord, isRoundCleared, isRoundMastered, scoreWord, validateGuess } from './validator.ts';

const stare = getAnagramData(['s', 't', 'a', 'r', 'e'], 'easy');

describe('canFormWord', () => {
	it('treats rack tiles as single-use', () => {
		assert.equal(canFormWord('tear', ['t', 'e', 'a', 'r']), true);
		assert.equal(canFormWord('tee', ['t', 'e', 'a', 'r']), false);
	});

	it('supports umlauts and ß as single tiles', () => {
		assert.equal(canFormWord('füß', ['ß', 'ü', 'f']), true);
		assert.equal(canFormWord('füß', ['s', 's', 'ü', 'f']), false);
	});
});

describe('validateGuess', () => {
	it('classifies guesses', () => {
		assert.equal(validateGuess('star', stare, [], 'easy'), 'accepted');
		assert.equal(validateGuess('star', stare, ['star'], 'easy'), 'duplicate');
		assert.equal(validateGuess('st', stare, [], 'easy'), 'tooShort');
		assert.equal(validateGuess('mart', stare, [], 'easy'), 'notInRack');
		assert.equal(validateGuess('sate', stare, [], 'easy'), 'notAWord');
	});

	it('enforces the expert minimum length of 4', () => {
		assert.equal(validateGuess('art', stare, [], 'expert'), 'tooShort');
	});

	it('is case-insensitive', () => {
		assert.equal(validateGuess('STAR', stare, [], 'easy'), 'accepted');
	});
});

describe('round outcome', () => {
	it('clears Zen with a full-length word or 50% of words', () => {
		assert.equal(isRoundCleared(stare, ['stare'], 'zen'), true);
		assert.equal(isRoundCleared(stare, stare.words.slice(0, Math.ceil(stare.words.length / 2)), 'zen'), true);
		assert.equal(isRoundCleared(stare, ['star'], 'zen'), false);
	});

	it('requires a full-length word in Timed', () => {
		const nonFull = stare.words.filter((word) => !stare.fullLengthWords.includes(word));
		assert.equal(isRoundCleared(stare, nonFull, 'timed'), false);
		assert.equal(isRoundCleared(stare, ['aster'], 'timed'), true);
	});

	it('detects a 100% sweep', () => {
		assert.equal(isRoundMastered(stare, stare.words), true);
		assert.equal(isRoundMastered(stare, stare.words.slice(1)), false);
	});

	it('scores longer words quadratically', () => {
		assert.equal(scoreWord('art'), 90);
		assert.equal(scoreWord('star'), 160);
	});
});
