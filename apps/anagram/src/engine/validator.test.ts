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
	resolveWordTileIds,
	scoreWord,
	validateGuess,
} from './validator.ts';

const stare = getAnagramData(['s', 't', 'a', 'r', 'e'], 'easy');
const apfel = getAnagramData(['ä', 'p', 'f', 'e', 'l'], 'easy', 'de');
const fuesse = getAnagramData(['f', 'ü', 'ß', 'e', 'n'], 'easy', 'de');
const maca = getAnagramData(['m', 'a', 'c', 'a', 's'], 'easy', 'pt');
const pao = getAnagramData(['p', 'a', 'o', 's', 'r'], 'easy', 'pt');
const coracao = getAnagramData(['c', 'o', 'r', 'a', 'c', 'a', 'o'], 'hard', 'pt');
const ecole = getAnagramData(['e', 'c', 'o', 'l', 'e', 's'], 'medium', 'fr');
const facade = getAnagramData(['f', 'a', 'c', 'a', 'd', 'e'], 'medium', 'fr');
const foret = getAnagramData(['f', 'o', 'r', 'e', 't', 's'], 'medium', 'fr');

describe('normalizeWord', () => {
	it('strips Portuguese diacritics via NFD decomposition and lowercases', () => {
		assert.equal(normalizeWord('maçã'), 'maca');
		assert.equal(normalizeWord('MAÇÃ'), 'maca');
		assert.equal(normalizeWord('pão'), 'pao');
		assert.equal(normalizeWord('ÁGUA'), 'agua');
		assert.equal(normalizeWord('CORAÇÃO'), 'coracao');
	});

	it('strips French diacritics via NFD decomposition and lowercases', () => {
		assert.equal(normalizeWord('école'), 'ecole');
		assert.equal(normalizeWord('ÉCOLE'), 'ecole');
		assert.equal(normalizeWord('façade'), 'facade');
		assert.equal(normalizeWord('hôtel'), 'hotel');
		assert.equal(normalizeWord('forêt'), 'foret');
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

	it('matches accented French words against unaccented rack tiles', () => {
		assert.equal(canFormWord('école', ['e', 'c', 'o', 'l', 'e']), true);
		assert.equal(canFormWord('façade', ['f', 'a', 'c', 'a', 'd', 'e']), true);
		assert.equal(canFormWord('hôtel', ['h', 'o', 't', 'e', 'l']), true);
		assert.equal(canFormWord('forêt', ['f', 'o', 'r', 'e', 't']), true);
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

	it('accepts both unaccented and accented inputs for French words', () => {
		assert.ok(ecole.words.includes('école') || ecole.words.includes('écoles'));
		assert.equal(validateGuess('ecole', ecole, [], 'medium'), 'accepted');
		assert.equal(validateGuess('ÉCOLE', ecole, [], 'medium'), 'accepted');
		assert.equal(validateGuess('ecole', ecole, ['école'], 'medium'), 'duplicate');
		assert.ok(facade.words.includes('façade'));
		assert.equal(validateGuess('facade', facade, [], 'medium'), 'accepted');
		assert.equal(validateGuess('FAÇADE', facade, [], 'medium'), 'accepted');
		assert.ok(foret.words.includes('forêt') || foret.words.includes('forêts'));
		assert.equal(validateGuess('foret', foret, [], 'medium'), 'accepted');
		assert.equal(validateGuess('FORÊT', foret, [], 'medium'), 'accepted');
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

describe('resolveWordTileIds', () => {
	const stareTiles = [
		{ id: 10, letter: 's' },
		{ id: 11, letter: 't' },
		{ id: 12, letter: 'a' },
		{ id: 13, letter: 'r' },
		{ id: 14, letter: 'e' },
	];

	it('resolves simple words and returns tile IDs in character order', () => {
		assert.deepEqual(resolveWordTileIds('tar', stareTiles), [11, 12, 13]);
		assert.deepEqual(resolveWordTileIds('rate', stareTiles), [13, 12, 11, 14]);
		assert.deepEqual(resolveWordTileIds('STAR', stareTiles), [10, 11, 12, 13]);
	});

	it('correctly handles duplicate letters in word and rack', () => {
		const eagerTiles = [
			{ id: 1, letter: 'e' },
			{ id: 2, letter: 'a' },
			{ id: 3, letter: 'g' },
			{ id: 4, letter: 'e' },
			{ id: 5, letter: 'r' },
		];
		assert.deepEqual(resolveWordTileIds('eager', eagerTiles), [1, 2, 3, 4, 5]);
		assert.deepEqual(resolveWordTileIds('gee', eagerTiles), [3, 1, 4]);
	});

	it('resolves accented Portuguese words using unaccented rack tiles', () => {
		const macaTiles = [
			{ id: 0, letter: 'm' },
			{ id: 1, letter: 'a' },
			{ id: 2, letter: 'c' },
			{ id: 3, letter: 'a' },
			{ id: 4, letter: 's' },
		];
		assert.deepEqual(resolveWordTileIds('maçã', macaTiles), [0, 1, 2, 3]);
	});

	it('resolves accented French words using unaccented rack tiles', () => {
		const ecoleTiles = [
			{ id: 0, letter: 'e' },
			{ id: 1, letter: 'c' },
			{ id: 2, letter: 'o' },
			{ id: 3, letter: 'l' },
			{ id: 4, letter: 'e' },
			{ id: 5, letter: 's' },
		];
		assert.deepEqual(resolveWordTileIds('école', ecoleTiles), [0, 1, 2, 3, 4]);
	});

	it('resolves German umlauts and ß matching exact tiles', () => {
		const fuesseTiles = [
			{ id: 0, letter: 'f' },
			{ id: 1, letter: 'ü' },
			{ id: 2, letter: 'ß' },
			{ id: 3, letter: 'e' },
			{ id: 4, letter: 'n' },
		];
		assert.deepEqual(resolveWordTileIds('füße', fuesseTiles), [0, 1, 2, 3]);

		const apfelTiles = [
			{ id: 0, letter: 'a' },
			{ id: 1, letter: 'p' },
			{ id: 2, letter: 'f' },
			{ id: 3, letter: 'e' },
			{ id: 4, letter: 'l' },
		];
		// 'ä' cannot use unaccented 'a' in German
		assert.deepEqual(resolveWordTileIds('äpfel', apfelTiles), [1, 2, 3, 4]);
	});

	it('returns empty array when word is empty or tiles are empty', () => {
		assert.deepEqual(resolveWordTileIds('', stareTiles), []);
		assert.deepEqual(resolveWordTileIds('star', []), []);
	});
});
