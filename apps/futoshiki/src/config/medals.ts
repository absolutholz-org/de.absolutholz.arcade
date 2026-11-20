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

export const FUTOSHIKI_MEDAL_DEFINITIONS: readonly AchievementDefinition<'futoshiki'>[] = [
	{
		id: 'futoshiki_first_deduction',
		type: 'standalone',
		tier: 'bronze',
		target: 1,
		titleKey: 'medals.futoshiki.first_deduction.title',
		descriptionKey: 'medals.futoshiki.first_deduction.desc',
		icon: 'trophy-bronze',
		evaluate: ({ updatedBaseStats }) => ({
			unlocked: updatedBaseStats.gamesWon >= 1,
			progress: Math.min(1, updatedBaseStats.gamesWon),
			target: 1,
		}),
	},
	{
		id: 'futoshiki_inequality_solver',
		type: 'ladder',
		tier: 'gold',
		metric: 'games_won',
		thresholds: {
			bronze: 5,
			silver: 25,
			gold: 100,
		},
		titleKey: 'medals.futoshiki.inequality_solver.title',
		descriptionKey: 'medals.futoshiki.inequality_solver.desc',
		icon: 'trophy-gold',
		evaluate: ({ updatedBaseStats }) => evaluateLadder(updatedBaseStats.gamesWon, 5, 25, 100),
	},
	{
		id: 'futoshiki_size_mastery',
		type: 'ladder',
		tier: 'gold',
		thresholds: {
			bronze: 1,
			silver: 2,
			gold: 3,
		},
		titleKey: 'medals.futoshiki.size_mastery.title',
		descriptionKey: 'medals.futoshiki.size_mastery.desc',
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
		id: 'futoshiki_pure_logic',
		type: 'ladder',
		tier: 'gold',
		metric: 'pure_logic_wins',
		thresholds: {
			bronze: 1,
			silver: 10,
			gold: 30,
		},
		titleKey: 'medals.futoshiki.pure_logic.title',
		descriptionKey: 'medals.futoshiki.pure_logic.desc',
		icon: 'star',
		evaluate: ({ updatedCustomStats }) => evaluateLadder(updatedCustomStats.pureLogicWins ?? 0, 1, 10, 30),
	},
	{
		id: 'futoshiki_speed_thinker',
		type: 'standalone',
		tier: 'silver',
		titleKey: 'medals.futoshiki.speed_thinker.title',
		descriptionKey: 'medals.futoshiki.speed_thinker.desc',
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
		id: 'futoshiki_streak',
		type: 'ladder',
		tier: 'gold',
		metric: 'win_streak',
		thresholds: {
			bronze: 3,
			silver: 7,
			gold: 15,
		},
		titleKey: 'medals.futoshiki.streak.title',
		descriptionKey: 'medals.futoshiki.streak.desc',
		icon: 'trophy-gold',
		evaluate: ({ updatedBaseStats }) => evaluateLadder(updatedBaseStats.bestStreak, 3, 7, 15),
	},
];

export default FUTOSHIKI_MEDAL_DEFINITIONS;
