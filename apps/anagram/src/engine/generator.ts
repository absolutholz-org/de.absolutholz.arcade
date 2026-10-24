import { getAnagramData, getRackCandidates } from './lexicon.ts';
import { type AnagramData, DIFFICULTY_CONFIGS, type DifficultyLevel, type LanguageCode } from './types.ts';

const VOWELS = new Set(['a', 'e', 'i', 'o', 'u', 'ä', 'ö', 'ü', 'y']);
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
	de: {
		easy: [
			'apfel',
			'blume',
			'stein',
			'sturm',
			'traum',
			'karte',
			'licht',
			'markt',
			'nacht',
			'pferd',
			'kraft',
			'musik',
			'sonne',
			'wolke',
			'tisch',
			'strom',
			'insel',
			'hafen',
			'küste',
			'bäume',
		],
		medium: [
			'garten',
			'winter',
			'silber',
			'planet',
			'freund',
			'sommer',
			'herbst',
			'wasser',
			'himmel',
			'schule',
			'brücke',
			'männer',
			'blüten',
			'häuser',
			'städte',
		],
		hard: [
			'meister',
			'fenster',
			'pflanze',
			'schloss',
			'stunde',
			'spiegel',
			'stimmen',
			'flasche',
			'laterne',
			'brüder',
		],
		expert: [
			'meister',
			'fenster',
			'pflanze',
			'spiegel',
			'stimmen',
			'laterne',
			'forscher',
			'kalender',
			'horizont',
			'geschenk',
		],
	},
	pt: {
		easy: [
			'prato',
			'porta',
			'carta',
			'costa',
			'pedra',
			'festa',
			'vento',
			'plano',
			'corda',
			'barco',
			'campo',
			'livro',
			'ponte',
			'sorte',
			'terra',
			'forma',
			'marca',
			'carro',
			'canto',
			'porto',
		],
		medium: [
			'pratos',
			'portas',
			'cartas',
			'pedras',
			'campos',
			'barcos',
			'ventos',
			'pontes',
			'partes',
			'formas',
			'marcas',
			'cordas',
			'planos',
			'festas',
			'costas',
			'cantos',
		],
		hard: [
			'estrela',
			'planeta',
			'mercado',
			'caminho',
			'coracao',
			'inverno',
			'jardins',
			'janelas',
			'castelo',
			'momento',
			'partido',
			'sistema',
			'palacio',
			'espelho',
		],
		expert: [
			'estrelas',
			'planetas',
			'mercados',
			'caminhos',
			'castelos',
			'momentos',
			'partidos',
			'sistemas',
			'invernos',
			'palacios',
			'coracoes',
			'presente',
			'espelhos',
			'trabalhe',
		],
	},
	fr: {
		easy: [
			'abris',
			'batis',
			'bales',
			'bains',
			'balte',
			'baser',
			'bails',
			'berca',
			'abces',
			'basic',
			'baste',
			'batir',
			'barns',
			'beurs',
			'bacle',
			'becta',
			'cabri',
			'bater',
			'baril',
			'bilat',
		],
		medium: [
			'balise',
			'baiser',
			'abetis',
			'albite',
			'bistra',
			'abetir',
			'benira',
			'baltes',
			'bercas',
			'boitas',
			'baient',
			'braisa',
			'cabris',
			'bilera',
			'abuser',
			'baisat',
		],
		hard: [
			'albites',
			'beniras',
			'abrites',
			'baliser',
			'baients',
			'bercais',
			'aubiers',
			'arabise',
			'bilames',
			'boisera',
			'baisers',
			'abolies',
			'baisote',
			'balaies',
			'balises',
		],
		expert: [
			'abstenir',
			'abruties',
			'abetiras',
			'balisent',
			'baisoter',
			'balisera',
			'batelais',
			'bleutais',
			'badiners',
			'aboients',
			'abolites',
			'baierons',
			'bestiale',
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

const MIN_SOLVABLE_WORDS_BY_LANG: Record<LanguageCode, number> = {
	en: 8,
	de: 6,
	fr: 6,
	pt: 6,
};
const MAX_SAMPLE_ATTEMPTS = 50;

function isValidCandidateRack(rack: readonly string[], difficulty: DifficultyLevel): boolean {
	if (difficulty === 'easy' || difficulty === 'medium') {
		// Disallow candidate roots containing rare letters (Q, X, Z, J) on Easy and Medium tiers.
		if (rack.some((tile) => RARE_LETTERS.has(tile))) return false;
	}

	const vowelCount = rack.filter((tile) => VOWELS.has(tile)).length;
	if (difficulty === 'easy') {
		// Enforce 1 or 2 vowels for Easy roots.
		if (vowelCount < 1 || vowelCount > 2) return false;
		// Require the rack to include high-frequency consonants (R, S, T, L, N, D, P, M, C).
		if (!rack.some((tile) => HIGH_FREQ_CONSONANTS.has(tile))) return false;
	} else {
		// Ensure there is at least one vowel and at least one consonant.
		if (vowelCount === 0 || vowelCount >= rack.length) return false;
	}

	return true;
}

export function generateRound(
	difficulty: DifficultyLevel,
	language: LanguageCode = 'en',
	random: RandomSource = Math.random,
): AnagramData {
	const { rackSize } = DIFFICULTY_CONFIGS[difficulty];
	const curatedPool = (CURATED_ROOT_WORDS[language]?.[difficulty] ?? []).filter(
		(word) => Array.from(word).length === rackSize,
	);
	const minSolvableWords = MIN_SOLVABLE_WORDS_BY_LANG[language] ?? 6;

	// Combine dictionary rack candidates with curated root words
	const dictRoots = getRackCandidates(rackSize, language);
	const pool = Array.from(new Set([...dictRoots, ...curatedPool])).filter((root) =>
		isValidCandidateRack(Array.from(root), difficulty),
	);

	const availablePool = pool.length > 0 ? pool : dictRoots;

	// Randomly sample candidates that satisfy the minimum solvable word threshold
	for (let attempt = 0; attempt < MAX_SAMPLE_ATTEMPTS; attempt++) {
		const randomIndex = Math.floor(random() * availablePool.length);
		const chosenRoot = availablePool[randomIndex];
		const data = getAnagramData(shuffleRack(Array.from(chosenRoot), random), difficulty, language);
		if (data.words.length >= minSolvableWords) {
			return data;
		}
	}

	// Fallback if random sampling didn't find >= minSolvableWords: prefer a curated root that meets threshold
	if (curatedPool.length > 0) {
		const startIndex = Math.floor(random() * curatedPool.length);
		for (let offset = 0; offset < curatedPool.length; offset++) {
			const candidate = curatedPool[(startIndex + offset) % curatedPool.length];
			const data = getAnagramData(shuffleRack(Array.from(candidate), random), difficulty, language);
			if (data.words.length >= minSolvableWords) {
				return data;
			}
		}
	}

	const fallbackIndex = Math.floor(random() * availablePool.length);
	return getAnagramData(shuffleRack(Array.from(availablePool[fallbackIndex]), random), difficulty, language);
}
