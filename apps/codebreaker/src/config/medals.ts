import type { AchievementDefinition, MedalTier } from '@arcade/lib-medals';

function evaluateLadder(value: number, bronze: number, silver: number, gold: number) {
	let currentTier: MedalTier | null = null;
	let nextThreshold: number | null = bronze;

	if (value >= gold) {
		currentTier = 'gold';
		nextThreshold = null;
	} else if (value >= silver) {
		currentTier = 'silver';
		nextThreshold = gold;
	} else if (value >= bronze) {
		currentTier = 'bronze';
		nextThreshold = silver;
	}

	return {
		currentProgress: value,
		currentTier,
		nextThreshold,
		bronzeUnlocked: value >= bronze,
		silverUnlocked: value >= silver,
		goldUnlocked: value >= gold,
	};
}

export const CODEBREAKER_MEDAL_DEFINITIONS: readonly AchievementDefinition<'codebreaker'>[] = [
	{
		id: 'codebreaker_first_crack',
		type: 'standalone',
		tier: 'bronze',
		target: 1,
		titleKey: 'medals.codebreaker.first_crack.title',
		descriptionKey: 'medals.codebreaker.first_crack.desc',
		icon: 'trophy-bronze',
		evaluate: ({ updatedBaseStats }) => ({
			unlocked: updatedBaseStats.gamesWon >= 1,
			progress: Math.min(1, updatedBaseStats.gamesWon),
			target: 1,
		}),
	},
	{
		id: 'codebreaker_veteran',
		type: 'ladder',
		tier: 'gold',
		metric: 'games_won',
		thresholds: {
			bronze: 5,
			silver: 25,
			gold: 100,
		},
		titleKey: 'medals.codebreaker.veteran.title',
		descriptionKey: 'medals.codebreaker.veteran.desc',
		icon: 'trophy-gold',
		evaluate: ({ updatedBaseStats }) => evaluateLadder(updatedBaseStats.gamesWon, 5, 25, 100),
	},
	{
		id: 'codebreaker_streak',
		type: 'ladder',
		tier: 'gold',
		metric: 'win_streak',
		thresholds: {
			bronze: 3,
			silver: 7,
			gold: 15,
		},
		titleKey: 'medals.codebreaker.streak.title',
		descriptionKey: 'medals.codebreaker.streak.desc',
		icon: 'trophy-gold',
		evaluate: ({ updatedBaseStats }) => evaluateLadder(updatedBaseStats.bestStreak, 3, 7, 15),
	},
	{
		id: 'codebreaker_pure_logic',
		type: 'ladder',
		tier: 'gold',
		metric: 'hint_free_wins',
		thresholds: {
			bronze: 3,
			silver: 10,
			gold: 25,
		},
		titleKey: 'medals.codebreaker.pure_logic.title',
		descriptionKey: 'medals.codebreaker.pure_logic.desc',
		icon: 'star',
		evaluate: ({ updatedCustomStats }) => evaluateLadder(updatedCustomStats.hintFreeWins ?? 0, 3, 10, 25),
	},
	{
		id: 'codebreaker_sharp_mind',
		type: 'standalone',
		tier: 'silver',
		titleKey: 'medals.codebreaker.sharp_mind.title',
		descriptionKey: 'medals.codebreaker.sharp_mind.desc',
		icon: 'sparkles',
		evaluate: ({ result, updatedCustomStats }) => {
			const guessesUsed = Number(result.roundContext?.guessesUsed ?? 0);
			const hintsUsed = Number(result.roundContext?.hintsUsed ?? 0);
			const thisRound = result.won && hintsUsed === 0 && guessesUsed > 0 && guessesUsed <= 4;
			const bestEver =
				typeof updatedCustomStats.bestGuessesHintFree === 'number' &&
				updatedCustomStats.bestGuessesHintFree <= 4;
			return {
				unlocked: Boolean(thisRound || bestEver),
			};
		},
	},
	{
		id: 'codebreaker_lightning',
		type: 'standalone',
		tier: 'silver',
		titleKey: 'medals.codebreaker.lightning.title',
		descriptionKey: 'medals.codebreaker.lightning.desc',
		icon: 'sparkles',
		evaluate: ({ result, updatedCustomStats }) => {
			const thisRound = result.won && result.playTimeSeconds > 0 && result.playTimeSeconds <= 60;
			const bestEver =
				typeof updatedCustomStats.fastestWinSeconds === 'number' &&
				updatedCustomStats.fastestWinSeconds > 0 &&
				updatedCustomStats.fastestWinSeconds <= 60;
			return {
				unlocked: Boolean(thisRound || bestEver),
			};
		},
	},
	{
		id: 'codebreaker_master_cracker',
		type: 'standalone',
		tier: 'gold',
		titleKey: 'medals.codebreaker.master_cracker.title',
		descriptionKey: 'medals.codebreaker.master_cracker.desc',
		icon: 'star',
		evaluate: ({ result, updatedCustomStats }) => {
			const diff = (result.roundContext?.difficulty as string | undefined) ?? result.levelKey;
			const hintsUsed = Number(result.roundContext?.hintsUsed ?? 0);
			const thisRound = result.won && diff === 'hard' && hintsUsed === 0;
			return {
				unlocked: Boolean(thisRound || (updatedCustomStats.hardHintFreeWins ?? 0) >= 1),
			};
		},
	},
];

export default CODEBREAKER_MEDAL_DEFINITIONS;
