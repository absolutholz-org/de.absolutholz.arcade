import { type AnagramData, DIFFICULTY_CONFIGS, type DifficultyLevel, type GameMode } from './types.ts';

export type GuessResult = 'accepted' | 'duplicate' | 'tooShort' | 'notInRack' | 'notAWord';

const GERMAN_SPECIAL_PATTERN = /[äöüßÄÖÜẞ]/;

export function normalizeTile(tile: string): string {
	return tile === 'ẞ' ? 'ß' : tile.toLocaleLowerCase();
}

export function normalizeWord(word: string): string {
	return (
		word
			.normalize('NFD')
			// biome-ignore lint/suspicious/noMisleadingCharacterClass: NFD combining diacritical marks range
			.replace(/[\u0300-\u036f]/g, '')
			.toLowerCase()
	);
}

export function formatTileUppercase(tile: string): string {
	return tile === 'ß' || tile === 'ẞ' ? 'ẞ' : tile.toLocaleUpperCase();
}

function canFormExact(word: string, rack: readonly string[], transform: (char: string) => string): boolean {
	const available = new Map<string, number>();
	for (const rawTile of rack) {
		const tile = transform(rawTile);
		available.set(tile, (available.get(tile) ?? 0) + 1);
	}

	for (const rawLetter of Array.from(word)) {
		const letter = transform(rawLetter);
		const remaining = available.get(letter) ?? 0;
		if (remaining === 0) return false;
		available.set(letter, remaining - 1);
	}
	return true;
}

export function canFormWord(word: string, rack: readonly string[]): boolean {
	if (canFormExact(word, rack, normalizeTile)) return true;
	if (GERMAN_SPECIAL_PATTERN.test(word) || rack.some((tile) => GERMAN_SPECIAL_PATTERN.test(tile))) {
		return false;
	}
	return canFormExact(word, rack, normalizeWord);
}

export function getMatchingWords(guess: string, data: AnagramData): string[] {
	const word = Array.from(guess).map(normalizeTile).join('');
	const exact = data.words.filter((candidate) => candidate === word);
	if (GERMAN_SPECIAL_PATTERN.test(word) || data.rack.some((tile) => GERMAN_SPECIAL_PATTERN.test(tile))) {
		return exact;
	}
	const normalizedGuess = normalizeWord(word);
	const matches = data.words.filter(
		(candidate) => !GERMAN_SPECIAL_PATTERN.test(candidate) && normalizeWord(candidate) === normalizedGuess,
	);
	return matches.length > 0 ? matches : exact;
}

export function validateGuess(
	guess: string,
	data: AnagramData,
	foundWords: readonly string[],
	difficulty: DifficultyLevel,
): GuessResult {
	const word = Array.from(guess).map(normalizeTile).join('');
	if (Array.from(word).length < DIFFICULTY_CONFIGS[difficulty].minWordLength) return 'tooShort';
	if (!canFormWord(word, data.rack)) return 'notInRack';

	const useNormalized =
		!GERMAN_SPECIAL_PATTERN.test(word) && !data.rack.some((tile) => GERMAN_SPECIAL_PATTERN.test(tile));
	const normalizedGuess = normalizeWord(word);
	const isDuplicate =
		foundWords.includes(word) ||
		(useNormalized &&
			foundWords.some(
				(found) => !GERMAN_SPECIAL_PATTERN.test(found) && normalizeWord(found) === normalizedGuess,
			));
	if (isDuplicate) return 'duplicate';

	return getMatchingWords(word, data).length > 0 ? 'accepted' : 'notAWord';
}

function isTargetWordFound(target: string, foundWords: readonly string[]): boolean {
	if (foundWords.includes(target)) return true;
	if (GERMAN_SPECIAL_PATTERN.test(target)) return false;
	const normalizedTarget = normalizeWord(target);
	return foundWords.some((found) => !GERMAN_SPECIAL_PATTERN.test(found) && normalizeWord(found) === normalizedTarget);
}

/**
 * Zen: a full-length word OR at least 50% of all solvable words clears the round.
 * Timed: a full-length word is required.
 */
export function isRoundCleared(data: AnagramData, foundWords: readonly string[], mode: GameMode): boolean {
	const hasFullLengthWord = data.fullLengthWords.some((word) => isTargetWordFound(word, foundWords));
	if (mode === 'timed') return hasFullLengthWord;
	const foundCount = data.words.filter((word) => isTargetWordFound(word, foundWords)).length;
	return hasFullLengthWord || foundCount * 2 >= data.words.length;
}

export function isRoundMastered(data: AnagramData, foundWords: readonly string[]): boolean {
	return data.words.length > 0 && data.words.every((word) => isTargetWordFound(word, foundWords));
}

export function scoreWord(word: string): number {
	return Array.from(word).length ** 2 * 10;
}
