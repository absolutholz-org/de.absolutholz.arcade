import { type AnagramData, DIFFICULTY_CONFIGS, type DifficultyLevel, type GameMode } from './types.ts';

export type GuessResult = 'accepted' | 'duplicate' | 'tooShort' | 'notInRack' | 'notAWord';

export function canFormWord(word: string, rack: readonly string[]): boolean {
	const available = new Map<string, number>();
	for (const tile of rack) available.set(tile, (available.get(tile) ?? 0) + 1);

	for (const letter of Array.from(word)) {
		const remaining = available.get(letter) ?? 0;
		if (remaining === 0) return false;
		available.set(letter, remaining - 1);
	}
	return true;
}

export function validateGuess(
	guess: string,
	data: AnagramData,
	foundWords: readonly string[],
	difficulty: DifficultyLevel,
): GuessResult {
	const word = guess.toLocaleLowerCase();
	if (Array.from(word).length < DIFFICULTY_CONFIGS[difficulty].minWordLength) return 'tooShort';
	if (!canFormWord(word, data.rack)) return 'notInRack';
	if (foundWords.includes(word)) return 'duplicate';
	return data.words.includes(word) ? 'accepted' : 'notAWord';
}

/**
 * Zen: a full-length word OR at least 50% of all solvable words clears the round.
 * Timed: a full-length word is required.
 */
export function isRoundCleared(data: AnagramData, foundWords: readonly string[], mode: GameMode): boolean {
	const hasFullLengthWord = data.fullLengthWords.some((word) => foundWords.includes(word));
	if (mode === 'timed') return hasFullLengthWord;
	return hasFullLengthWord || foundWords.length * 2 >= data.words.length;
}

export function isRoundMastered(data: AnagramData, foundWords: readonly string[]): boolean {
	return data.words.length > 0 && data.words.every((word) => foundWords.includes(word));
}

export function scoreWord(word: string): number {
	return Array.from(word).length ** 2 * 10;
}
