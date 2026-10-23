import { getAnagramData, getRackCandidates } from './lexicon.ts';
import { type AnagramData, DIFFICULTY_CONFIGS, type DifficultyLevel, type LanguageCode } from './types.ts';

const VOWELS = new Set(['a', 'e', 'i', 'o', 'u', 'ä', 'ö', 'ü', 'y']);
const COMMON_VOWELS = new Set(['e', 'a', 'o']);
const HIGH_FREQ_CONSONANTS = new Set(['r', 's', 't', 'l', 'n', 'd', 'p', 'm', 'c']);
const RARE_LETTERS = new Set(['q', 'x', 'z', 'j']);

export const CURATED_ROOT_WORDS: Record<LanguageCode, Record<DifficultyLevel, readonly string[]>> = {
	en: {
		easy: [
			'plant',
			'train',
			'stand',
			'bread',
			'water',
			'cloud',
			'stamp',
			'share',
			'horse',
			'beach',
			'house',
			'table',
			'green',
			'heart',
			'dream',
			'smile',
			'point',
			'storm',
			'light',
			'clean',
			'sweet',
		],
		medium: [
			'stream',
			'planet',
			'garden',
			'castle',
			'spring',
			'market',
			'silver',
			'flower',
			'winter',
			'forest',
			'travel',
			'friend',
			'window',
			'bridge',
			'master',
		],
		hard: [
			'painter',
			'monster',
			'blanket',
			'weather',
			'morning',
			'soldier',
			'captain',
			'journey',
			'kitchen',
			'station',
		],
		expert: [
			'painter',
			'monster',
			'blanket',
			'weather',
			'morning',
			'soldier',
			'captain',
			'journey',
			'kitchen',
			'station',
		],
	},
};

type RandomSource = () => number;

export function shuffleRack<T>(rack: readonly T[], random: RandomSource = Math.random): T[] {
	const shuffled = [...rack];
	for (let i = shuffled.length - 1; i > 0; i--) {
		const j = Math.floor(random() * (i + 1));
		[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
	}
	return shuffled;
}

function isValidFallbackCandidateRack(
	rack: readonly string[],
	difficulty: DifficultyLevel,
	data: AnagramData,
): boolean {
	// Require candidate roots to have at least 10 solvable sub-words of 3+ letters.
	if (data.words.length < 10) return false;

	if (difficulty === 'easy' || difficulty === 'medium') {
		// Disallow candidate roots containing rare letters (Q, X, Z, J) on Easy and Medium tiers.
		if (rack.some((tile) => RARE_LETTERS.has(tile))) return false;
	}

	if (difficulty === 'easy') {
		const vowelCount = rack.filter((tile) => VOWELS.has(tile)).length;
		// Enforce exactly 1 or 2 vowels for Easy roots.
		if (vowelCount < 1 || vowelCount > 2) return false;

		// Require the rack to include high-frequency consonants (R, S, T, L, N, D, P, M, C).
		const hasHighFreqConsonant = rack.some((tile) => HIGH_FREQ_CONSONANTS.has(tile));
		if (!hasHighFreqConsonant) return false;
	}
	return true;
}

// Lower is better. Word-count distance dominates; tier flavor only breaks near-ties.
function scoreCandidate(data: AnagramData, difficulty: DifficultyLevel): number {
	const { min, max } = DIFFICULTY_CONFIGS[difficulty].targetWordCount;
	const count = data.words.length;
	const rangeDistance = count < min ? min - count : count > max ? count - max : 0;

	let flavorPenalty = 0;
	if (difficulty === 'easy') {
		const vowelCount = data.rack.filter((tile) => VOWELS.has(tile)).length;
		// Ideal vowel balance for 5-letter easy racks is 2 vowels (40%). Penalize deviations.
		flavorPenalty = Math.abs(vowelCount - 2) * 0.5;
	} else if (difficulty === 'expert') {
		const duplicates = data.rack.length - new Set(data.rack).size;
		flavorPenalty = 1 / (1 + duplicates);
	}
	return rangeDistance + flavorPenalty;
}

export function generateRound(
	difficulty: DifficultyLevel,
	language: LanguageCode = 'en',
	random: RandomSource = Math.random,
): AnagramData {
	const curatedPool = CURATED_ROOT_WORDS[language]?.[difficulty];
	if (curatedPool && curatedPool.length > 0) {
		const candidates = curatedPool.map((root) =>
			getAnagramData(shuffleRack(Array.from(root), random), difficulty, language),
		);
		const bestScore = Math.min(...candidates.map((candidate) => scoreCandidate(candidate, difficulty)));
		const best = candidates.filter((candidate) => scoreCandidate(candidate, difficulty) === bestScore);
		return best[Math.floor(random() * best.length)];
	}

	// Dynamic fallback from dictionary if no curated words are defined
	const { rackSize } = DIFFICULTY_CONFIGS[difficulty];
	const rawRoots = getRackCandidates(rackSize, language);
	const rawCandidates = rawRoots.map((root) =>
		getAnagramData(shuffleRack(Array.from(root), random), difficulty, language),
	);
	const validCandidates = rawCandidates.filter((cand) => isValidFallbackCandidateRack(cand.rack, difficulty, cand));
	const candidates = validCandidates.length > 0 ? validCandidates : rawCandidates;

	const bestScore = Math.min(...candidates.map((candidate) => scoreCandidate(candidate, difficulty)));
	const best = candidates.filter((candidate) => scoreCandidate(candidate, difficulty) === bestScore);
	return best[Math.floor(random() * best.length)];
}
