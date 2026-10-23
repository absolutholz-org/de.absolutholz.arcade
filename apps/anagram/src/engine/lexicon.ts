import englishLexicon from './lexicon.data.en.json' with { type: 'json' };
import {
	type AnagramData,
	DIFFICULTY_CONFIGS,
	type DifficultyLevel,
	type LanguageCode,
	type LexiconFile,
} from './types.ts';

const LEXICONS: Record<LanguageCode, LexiconFile> = {
	en: englishLexicon,
};

const signatureCache = new Map<LanguageCode, Map<string, string[]>>();

// Array.from splits by code point, so umlauts and ß stay single tiles.
function toTiles(word: string): string[] {
	return Array.from(word);
}

function signatureOf(tiles: readonly string[]): string {
	return [...tiles].sort().join('');
}

function getSignatureIndex(language: LanguageCode): Map<string, string[]> {
	const cached = signatureCache.get(language);
	if (cached) return cached;

	const index = new Map<string, string[]>();
	for (const rawWord of LEXICONS[language].words) {
		const word = rawWord.toLocaleLowerCase(language);
		const signature = signatureOf(toTiles(word));
		const bucket = index.get(signature) ?? [];
		if (!bucket.includes(word)) bucket.push(word);
		index.set(signature, bucket);
	}
	signatureCache.set(language, index);
	return index;
}

/** Returns one root word per signature whose length is closest to `rackSize`. */
export function getRackCandidates(rackSize: number, language: LanguageCode = 'en'): string[] {
	const roots = [...getSignatureIndex(language).values()].map((bucket) => bucket[0]);
	const distance = (word: string) => Math.abs(toTiles(word).length - rackSize);
	const closest = Math.min(...roots.map(distance));
	return roots.filter((word) => distance(word) === closest);
}

export function getAnagramData(
	rackLetters: readonly string[],
	difficulty: DifficultyLevel,
	language: LanguageCode = 'en',
): AnagramData {
	const { minWordLength } = DIFFICULTY_CONFIGS[difficulty];
	const rack = rackLetters.map((letter) => letter.toLocaleLowerCase(language));
	const sortedRack = [...rack].sort();
	const index = getSignatureIndex(language);

	// Enumerate every sub-multiset of the rack (<= 2^7 subsets) and look up its signature.
	const signatures = new Set<string>();
	for (let mask = 1; mask < 1 << sortedRack.length; mask++) {
		const subset = sortedRack.filter((_, position) => mask & (1 << position));
		if (subset.length >= minWordLength) signatures.add(subset.join(''));
	}

	const words = [...signatures]
		.flatMap((signature) => index.get(signature) ?? [])
		.sort((a, b) => a.localeCompare(b, language));

	return {
		rack,
		words,
		fullLengthWords: words.filter((word) => toTiles(word).length === rack.length),
	};
}
