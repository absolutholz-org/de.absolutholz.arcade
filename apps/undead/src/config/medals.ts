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

export const UNDEAD_MEDAL_DEFINITIONS: readonly AchievementDefinition<'undead'>[] = [
	{
		id: 'undead_first_sighting',
		type: 'standalone',
		tier: 'bronze',
		target: 1,
		titleKey: 'medals.undead.first_sighting.title',
		descriptionKey: 'medals.undead.first_sighting.desc',
		icon: 'trophy-bronze',
		evaluate: ({ updatedBaseStats }) => ({
			unlocked: updatedBaseStats.gamesWon >= 1,
			progress: Math.min(1, updatedBaseStats.gamesWon),
			target: 1,
		}),
	},
	{
		id: 'undead_monster_hunter',
		type: 'ladder',
		tier: 'gold',
		metric: 'games_won',
		thresholds: {
			bronze: 5,
			silver: 25,
			gold: 100,
		},
		titleKey: 'medals.undead.monster_hunter.title',
		descriptionKey: 'medals.undead.monster_hunter.desc',
		icon: 'trophy-gold',
		evaluate: ({ updatedBaseStats }) => evaluateLadder(updatedBaseStats.gamesWon, 5, 25, 100),
	},
	{
		id: 'undead_grid_mastery',
		type: 'ladder',
		tier: 'gold',
		thresholds: {
			bronze: 1,
			silver: 2,
			gold: 3,
		},
		titleKey: 'medals.undead.grid_mastery.title',
		descriptionKey: 'medals.undead.grid_mastery.desc',
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
		id: 'undead_clean_deduction',
		type: 'ladder',
		tier: 'gold',
		metric: 'flawless_wins',
		thresholds: {
			bronze: 1,
			silver: 10,
			gold: 30,
		},
		titleKey: 'medals.undead.clean_deduction.title',
		descriptionKey: 'medals.undead.clean_deduction.desc',
		icon: 'star',
		evaluate: ({ updatedCustomStats }) => evaluateLadder(updatedCustomStats.flawlessWins ?? 0, 1, 10, 30),
	},
	{
		id: 'undead_swift_tracker',
		type: 'standalone',
		tier: 'silver',
		titleKey: 'medals.undead.swift_tracker.title',
		descriptionKey: 'medals.undead.swift_tracker.desc',
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
		id: 'undead_streak',
		type: 'ladder',
		tier: 'gold',
		metric: 'win_streak',
		thresholds: {
			bronze: 3,
			silver: 7,
			gold: 15,
		},
		titleKey: 'medals.undead.streak.title',
		descriptionKey: 'medals.undead.streak.desc',
		icon: 'trophy-gold',
		evaluate: ({ updatedBaseStats }) => evaluateLadder(updatedBaseStats.bestStreak, 3, 7, 15),
	},
];

export default UNDEAD_MEDAL_DEFINITIONS;
