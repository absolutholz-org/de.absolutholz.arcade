import germanLexicon from './lexicon.data.de.json' with { type: 'json' };
import englishLexicon from './lexicon.data.en.json' with { type: 'json' };
import frenchLexicon from './lexicon.data.fr.json' with { type: 'json' };
import portugueseLexicon from './lexicon.data.pt.json' with { type: 'json' };
import {
	type AnagramData,
	DIFFICULTY_CONFIGS,
	type DifficultyLevel,
	type LanguageCode,
	type LexiconFile,
} from './types.ts';
import { normalizeWord } from './validator.ts';

const LEXICONS: Record<LanguageCode, LexiconFile> = {
	en: englishLexicon,
	de: germanLexicon,
	fr: frenchLexicon,
	pt: portugueseLexicon,
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

	const lexicon = LEXICONS[language];
	const index = new Map<string, string[]>();

	if (lexicon.normalized) {
		for (const [signature, bucket] of Object.entries(lexicon.normalized)) {
			index.set(signature, [...bucket]);
		}
	} else {
		for (const rawWord of lexicon.words) {
			const word = rawWord.toLocaleLowerCase(language);
			const tileSource = language === 'pt' ? normalizeWord(word) : word;
			const signature = signatureOf(toTiles(tileSource));
			const bucket = index.get(signature) ?? [];
			if (!bucket.includes(word)) bucket.push(word);
			index.set(signature, bucket);
		}
	}
	signatureCache.set(language, index);
	return index;
}

function usesNormalizedTiles(language: LanguageCode): boolean {
	return language === 'pt' || language === 'fr';
}

/** Returns one root word per signature whose length is closest to `rackSize`. */
export function getRackCandidates(rackSize: number, language: LanguageCode = 'en'): string[] {
	const roots = [...getSignatureIndex(language).values()].map((bucket) =>
		usesNormalizedTiles(language) ? normalizeWord(bucket[0]) : bucket[0],
	);
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
	const rack = rackLetters.map((letter) =>
		usesNormalizedTiles(language) ? normalizeWord(letter) : letter.toLocaleLowerCase(language),
	);
	const sortedRack = [...rack].sort();
	const index = getSignatureIndex(language);

	// Enumerate every sub-multiset of the rack (<= 2^8 subsets) and look up its signature.
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
