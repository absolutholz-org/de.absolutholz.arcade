import type {
	AchievementDefinition,
	AchievementEvaluationContext,
	AchievementEvaluationResult,
	MedalTier,
} from '../types/index.js';

type AnagramContext = AchievementEvaluationContext<'anagram'>;
type MedalMeta = Pick<AchievementDefinition<'anagram'>, 'id' | 'tier' | 'icon'> & { key: string };

const ICON_BY_TIER: Record<MedalTier, string> = {
	bronze: 'trophy-bronze',
	silver: 'trophy-silver',
	gold: 'trophy-gold',
};

/**
 * Per-round facts supplied by the game UI in `roundContext`:
 * wordsFound, mode ('zen' | 'timed'), secondsLeft, foundFullRack, foundAnagramPair, mastered,
 * shuffles, quickShuffleBurst, invalidGuesses, duplicateGuesses, usedCorrections,
 * surrendered, secondsBeforeSurrender, pausedSeconds, fullRackSecondsLeft, onlyShortWordsPlusRoot.
 */
function flag({ result }: AnagramContext, key: string): boolean {
	return result.roundContext?.[key] === true;
}

function count({ result }: AnagramContext, key: string): number {
	const value = result.roundContext?.[key];
	return typeof value === 'number' ? value : 0;
}

function standalone(
	{ id, tier, key }: MedalMeta,
	isUnlocked: (context: AnagramContext) => boolean,
): AchievementDefinition<'anagram'> {
	return {
		id,
		type: 'standalone',
		tier,
		titleKey: `medals.anagram.${key}.title`,
		descriptionKey: `medals.anagram.${key}.desc`,
		icon: ICON_BY_TIER[tier],
		evaluate: (context): AchievementEvaluationResult => {
			const unlocked = isUnlocked(context);
			return { unlocked, progress: unlocked ? 1 : 0, target: 1 };
		},
	};
}

function ladder(
	{ id, key }: Pick<MedalMeta, 'id' | 'key'>,
	metric: string,
	thresholds: { bronze: number; silver: number; gold: number },
	readValue: (context: AnagramContext) => number,
): AchievementDefinition<'anagram'> {
	return {
		id,
		type: 'ladder',
		tier: 'gold',
		metric,
		thresholds,
		titleKey: `medals.anagram.${key}.title`,
		descriptionKey: `medals.anagram.${key}.desc`,
		icon: ICON_BY_TIER.gold,
		evaluate: (context) => {
			const value = readValue(context);
			let currentTier: MedalTier | null = null;
			let nextThreshold: number | null = thresholds.bronze;

			if (value >= thresholds.gold) {
				currentTier = 'gold';
				nextThreshold = null;
			} else if (value >= thresholds.silver) {
				currentTier = 'silver';
				nextThreshold = thresholds.gold;
			} else if (value >= thresholds.bronze) {
				currentTier = 'bronze';
				nextThreshold = thresholds.silver;
			}

			return {
				currentProgress: value,
				currentTier,
				nextThreshold,
				bronzeUnlocked: value >= thresholds.bronze,
				silverUnlocked: value >= thresholds.silver,
				goldUnlocked: value >= thresholds.gold,
			};
		},
	};
}

export const ANAGRAM_MEDAL_DEFINITIONS: readonly AchievementDefinition<'anagram'>[] = [
	standalone({ id: 'anagram_first_word', key: 'first_word', tier: 'bronze', icon: '' }, (context) => {
		return (context.updatedCustomStats.totalWordsFound ?? 0) >= 1;
	}),
	standalone({ id: 'anagram_full_rack', key: 'full_rack', tier: 'silver', icon: '' }, (context) =>
		flag(context, 'foundFullRack'),
	),
	standalone(
		{ id: 'anagram_speed_demon', key: 'speed_demon', tier: 'gold', icon: '' },
		(context) =>
			context.result.won && context.result.roundContext?.mode === 'timed' && count(context, 'secondsLeft') >= 60,
	),
	standalone({ id: 'anagram_perfectionist', key: 'perfectionist', tier: 'gold', icon: '' }, (context) =>
		flag(context, 'mastered'),
	),
	ladder(
		{ id: 'anagram_round_champion', key: 'round_champion' },
		'total_wins',
		{ bronze: 5, silver: 25, gold: 100 },
		(context) => context.updatedBaseStats.gamesWon,
	),
	ladder(
		{ id: 'anagram_wordsmith', key: 'wordsmith' },
		'total_words_found',
		{ bronze: 50, silver: 250, gold: 1000 },
		(context) => context.updatedCustomStats.totalWordsFound ?? 0,
	),
	ladder(
		{ id: 'anagram_expert_scholar', key: 'expert_scholar' },
		'expert_wins',
		{ bronze: 1, silver: 5, gold: 20 },
		(context) => context.updatedCustomStats.expertWins ?? 0,
	),

	// Easter-egg medals
	standalone(
		{ id: 'anagram_hold_my_tiles', key: 'hold_my_tiles', tier: 'bronze', icon: '' },
		(context) => count(context, 'shuffles') >= 20,
	),
	standalone({ id: 'anagram_scrambled_egg', key: 'scrambled_egg', tier: 'bronze', icon: '' }, (context) =>
		flag(context, 'quickShuffleBurst'),
	),
	standalone({ id: 'anagram_cat_person', key: 'cat_person', tier: 'bronze', icon: '' }, (context) =>
		flag(context, 'foundAnagramPair'),
	),
	standalone(
		{ id: 'anagram_silent_treatment', key: 'silent_treatment', tier: 'silver', icon: '' },
		(context) =>
			context.result.won && context.result.roundContext?.mode === 'zen' && !flag(context, 'usedCorrections'),
	),
	standalone(
		{ id: 'anagram_surrender_monkey', key: 'surrender_monkey', tier: 'bronze', icon: '' },
		(context) =>
			flag(context, 'surrendered') &&
			count(context, 'secondsBeforeSurrender') > 0 &&
			count(context, 'secondsBeforeSurrender') <= 5,
	),
	standalone({ id: 'anagram_last_second_hero', key: 'last_second_hero', tier: 'gold', icon: '' }, (context) => {
		const secondsLeft = context.result.roundContext?.fullRackSecondsLeft;
		return context.result.won && typeof secondsLeft === 'number' && secondsLeft >= 0 && secondsLeft <= 1;
	}),
	standalone(
		{ id: 'anagram_typo_tornado', key: 'typo_tornado', tier: 'bronze', icon: '' },
		(context) => count(context, 'invalidGuesses') >= 10,
	),
	standalone(
		{ id: 'anagram_deja_vu', key: 'deja_vu', tier: 'bronze', icon: '' },
		(context) => count(context, 'duplicateGuesses') >= 3,
	),
	standalone(
		{ id: 'anagram_tiny_dictionary', key: 'tiny_dictionary', tier: 'silver', icon: '' },
		(context) =>
			context.result.won && context.result.levelKey === 'easy' && flag(context, 'onlyShortWordsPlusRoot'),
	),
	standalone(
		{ id: 'anagram_sleeping_beauty', key: 'sleeping_beauty', tier: 'silver', icon: '' },
		(context) => context.result.won && count(context, 'pausedSeconds') > 600,
	),

	// Polyglot medals
	standalone(
		{ id: 'anagram_polyglot_apprentice', key: 'polyglot_apprentice', tier: 'bronze', icon: '' },
		(context) => {
			const languagesPlayed = context.updatedCustomStats.languagesPlayed ?? {};
			return Object.keys(languagesPlayed).filter((lang) => (languagesPlayed[lang] ?? 0) > 0).length >= 2;
		},
	),
	standalone({ id: 'anagram_polyglot_trio', key: 'polyglot_trio', tier: 'silver', icon: '' }, (context) => {
		const languagesPlayed = context.updatedCustomStats.languagesPlayed ?? {};
		return Object.keys(languagesPlayed).filter((lang) => (languagesPlayed[lang] ?? 0) >= 1).length >= 3;
	}),
	ladder(
		{ id: 'anagram_tower_of_babel', key: 'tower_of_babel' },
		'secondary_language_wins',
		{ bronze: 5, silver: 20, gold: 50 },
		(context) => {
			const languagesPlayed = context.updatedCustomStats.languagesPlayed ?? {};
			return (languagesPlayed.de ?? 0) + (languagesPlayed.fr ?? 0) + (languagesPlayed.pt ?? 0);
		},
	),
	standalone({ id: 'anagram_polyglot_expert', key: 'polyglot_expert', tier: 'gold', icon: '' }, (context) => {
		const expertLanguagesWon = context.updatedCustomStats.expertLanguagesWon ?? [];
		return expertLanguagesWon.length >= 2;
	}),
];
