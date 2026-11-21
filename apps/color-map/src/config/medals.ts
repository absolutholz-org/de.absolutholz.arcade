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

export const COLOR_MAP_MEDAL_DEFINITIONS: readonly AchievementDefinition<'color-map'>[] = [
	{
		id: 'color_map_first_atlas',
		type: 'standalone',
		tier: 'bronze',
		target: 1,
		titleKey: 'medals.color-map.first_atlas.title',
		descriptionKey: 'medals.color-map.first_atlas.desc',
		icon: 'trophy-bronze',
		evaluate: ({ updatedBaseStats }) => ({
			unlocked: updatedBaseStats.gamesWon >= 1,
			progress: Math.min(1, updatedBaseStats.gamesWon),
			target: 1,
		}),
	},
	{
		id: 'color_map_cartographer',
		type: 'ladder',
		tier: 'gold',
		metric: 'games_won',
		thresholds: {
			bronze: 5,
			silver: 25,
			gold: 100,
		},
		titleKey: 'medals.color-map.cartographer.title',
		descriptionKey: 'medals.color-map.cartographer.desc',
		icon: 'trophy-gold',
		evaluate: ({ updatedBaseStats }) => evaluateLadder(updatedBaseStats.gamesWon, 5, 25, 100),
	},
	{
		id: 'color_map_tier_mastery',
		type: 'ladder',
		tier: 'gold',
		thresholds: {
			bronze: 1,
			silver: 2,
			gold: 3,
		},
		titleKey: 'medals.color-map.tier_mastery.title',
		descriptionKey: 'medals.color-map.tier_mastery.desc',
		icon: 'star',
		evaluate: ({ updatedCustomStats }) => {
			const hasMedium = (updatedCustomStats.mediumWins ?? 0) >= 1;
			const hasHard = (updatedCustomStats.hardWins ?? 0) >= 1;
			const hasExpert = (updatedCustomStats.expertWins ?? 0) >= 1;

			const bronzeUnlocked = hasMedium || hasHard || hasExpert;
			const silverUnlocked = hasHard || hasExpert;
			const goldUnlocked = hasExpert;

			let currentTier: MedalTier | null = null;
			let currentProgress = 0;
			let nextThreshold: number | null = 1;

			if (goldUnlocked) {
				currentTier = 'gold';
				currentProgress = 3;
				nextThreshold = null;
			} else if (silverUnlocked) {
				currentTier = 'silver';
				currentProgress = 2;
				nextThreshold = 3;
			} else if (bronzeUnlocked) {
				currentTier = 'bronze';
				currentProgress = 1;
				nextThreshold = 2;
			}

			return {
				currentProgress,
				currentTier,
				nextThreshold,
				bronzeUnlocked,
				silverUnlocked,
				goldUnlocked,
			};
		},
	},
	{
		id: 'color_map_zero_conflict',
		type: 'ladder',
		tier: 'gold',
		metric: 'flawless_wins',
		thresholds: {
			bronze: 1,
			silver: 10,
			gold: 30,
		},
		titleKey: 'medals.color-map.zero_conflict.title',
		descriptionKey: 'medals.color-map.zero_conflict.desc',
		icon: 'star',
		evaluate: ({ updatedCustomStats }) => evaluateLadder(updatedCustomStats.flawlessWins ?? 0, 1, 10, 30),
	},
	{
		id: 'color_map_swift_mapper',
		type: 'standalone',
		tier: 'silver',
		titleKey: 'medals.color-map.swift_mapper.title',
		descriptionKey: 'medals.color-map.swift_mapper.desc',
		icon: 'sparkles',
		evaluate: ({ result }) => {
			const diff = (result.roundContext?.difficulty as string | undefined) ?? result.levelKey;
			const eligible = diff === 'medium' || diff === 'hard' || diff === 'expert';
			return {
				unlocked: Boolean(
					result.won && eligible && result.playTimeSeconds > 0 && result.playTimeSeconds <= 120,
				),
			};
		},
	},
	{
		id: 'color_map_streak',
		type: 'ladder',
		tier: 'gold',
		metric: 'win_streak',
		thresholds: {
			bronze: 3,
			silver: 7,
			gold: 15,
		},
		titleKey: 'medals.color-map.streak.title',
		descriptionKey: 'medals.color-map.streak.desc',
		icon: 'trophy-gold',
		evaluate: ({ updatedBaseStats }) => evaluateLadder(updatedBaseStats.bestStreak, 3, 7, 15),
	},
];

export default COLOR_MAP_MEDAL_DEFINITIONS;
