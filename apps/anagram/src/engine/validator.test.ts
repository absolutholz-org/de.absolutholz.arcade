import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { getAnagramData } from './lexicon.ts';
import {
	canFormWord,
	formatTileUppercase,
	isRoundCleared,
	isRoundMastered,
	normalizeTile,
	normalizeWord,
	scoreWord,
	validateGuess,
} from './validator.ts';

const stare = getAnagramData(['s', 't', 'a', 'r', 'e'], 'easy');
const apfel = getAnagramData(['ä', 'p', 'f', 'e', 'l'], 'easy', 'de');
const fuesse = getAnagramData(['f', 'ü', 'ß', 'e', 'n'], 'easy', 'de');
const maca = getAnagramData(['m', 'a', 'c', 'a', 's'], 'easy', 'pt');
const pao = getAnagramData(['p', 'a', 'o', 's', 'r'], 'easy', 'pt');
const coracao = getAnagramData(['c', 'o', 'r', 'a', 'c', 'a', 'o'], 'hard', 'pt');

describe('normalizeWord', () => {
	it('strips Portuguese diacritics via NFD decomposition and lowercases', () => {
		assert.equal(normalizeWord('maçã'), 'maca');
		assert.equal(normalizeWord('MAÇÃ'), 'maca');
		assert.equal(normalizeWord('pão'), 'pao');
		assert.equal(normalizeWord('ÁGUA'), 'agua');
		assert.equal(normalizeWord('CORAÇÃO'), 'coracao');
	});
});

describe('canFormWord', () => {
	it('treats rack tiles as single-use', () => {
		assert.equal(canFormWord('tear', ['t', 'e', 'a', 'r']), true);
		assert.equal(canFormWord('tee', ['t', 'e', 'a', 'r']), false);
	});

	it('supports umlauts and ß as single tiles (not transliterated)', () => {
		assert.equal(canFormWord('füße', ['ß', 'ü', 'f', 'e']), true);
		assert.equal(canFormWord('FÜẞE', ['ß', 'ü', 'f', 'e']), true);
		assert.equal(canFormWord('füße', ['s', 's', 'ü', 'f', 'e']), false);
		assert.equal(canFormWord('äpfel', ['a', 'e', 'p', 'f', 'e', 'l']), false);
	});

	it('matches accented Portuguese words against unaccented rack tiles', () => {
		assert.equal(canFormWord('maçã', ['m', 'a', 'c', 'a']), true);
		assert.equal(canFormWord('pão', ['p', 'a', 'o']), true);
		assert.equal(canFormWord('água', ['a', 'g', 'u', 'a']), true);
		assert.equal(canFormWord('coração', ['c', 'o', 'r', 'a', 'c', 'a', 'o']), true);
	});

	it('normalizes and formats German uppercase tiles including ẞ', () => {
		assert.equal(normalizeTile('ẞ'), 'ß');
		assert.equal(normalizeTile('Ä'), 'ä');
		assert.equal(formatTileUppercase('ß'), 'ẞ');
		assert.equal(formatTileUppercase('ü'), 'Ü');
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

	it('is case-insensitive for English and German words with umlauts and ß', () => {
		assert.equal(validateGuess('STAR', stare, [], 'easy'), 'accepted');
		assert.equal(validateGuess('Äpfel', apfel, [], 'easy'), 'accepted');
		assert.equal(validateGuess('ÄPFEL', apfel, ['äpfel'], 'easy'), 'duplicate');
		assert.equal(validateGuess('Füße', fuesse, [], 'easy'), 'accepted');
		assert.equal(validateGuess('FÜẞE', fuesse, [], 'easy'), 'accepted');
	});

	it('accepts unaccented letter inputs for accented Portuguese words', () => {
		assert.ok(maca.words.includes('maçã'));
		assert.equal(validateGuess('maca', maca, [], 'easy'), 'accepted');
		assert.equal(validateGuess('MACA', maca, [], 'easy'), 'accepted');
		assert.equal(validateGuess('maca', maca, ['maçã'], 'easy'), 'duplicate');
		assert.ok(pao.words.includes('pão'));
		assert.equal(validateGuess('pao', pao, [], 'easy'), 'accepted');
		assert.ok(coracao.words.includes('coração'));
		assert.equal(validateGuess('coracao', coracao, [], 'hard'), 'accepted');
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
