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

export const LASERS_MEDAL_DEFINITIONS: readonly AchievementDefinition<'lasers'>[] = [
	{
		id: 'lasers_first_beam',
		type: 'standalone',
		tier: 'bronze',
		target: 1,
		titleKey: 'medals.lasers.first_beam.title',
		descriptionKey: 'medals.lasers.first_beam.desc',
		icon: 'star',
		evaluate: ({ updatedBaseStats }) => ({
			unlocked: updatedBaseStats.gamesWon >= 1,
			progress: Math.min(1, updatedBaseStats.gamesWon),
			target: 1,
		}),
	},
	{
		id: 'lasers_optical_engineer',
		type: 'ladder',
		tier: 'gold',
		metric: 'games_won',
		thresholds: {
			bronze: 5,
			silver: 25,
			gold: 100,
		},
		titleKey: 'medals.lasers.optical_engineer.title',
		descriptionKey: 'medals.lasers.optical_engineer.desc',
		icon: 'trophy-gold',
		evaluate: ({ updatedBaseStats }) => evaluateLadder(updatedBaseStats.gamesWon, 5, 25, 100),
	},
	{
		id: 'lasers_spectrum_master',
		type: 'ladder',
		tier: 'gold',
		metric: 'tier_mastery',
		thresholds: {
			bronze: 1,
			silver: 2,
			gold: 3,
		},
		titleKey: 'medals.lasers.spectrum_master.title',
		descriptionKey: 'medals.lasers.spectrum_master.desc',
		icon: 'sparkles',
		evaluate: ({ updatedCustomStats }) => {
			const hasMedium = (updatedCustomStats.mediumWins ?? 0) >= 1;
			const hasHard = (updatedCustomStats.hardWins ?? 0) >= 1;
			const hasExpert = (updatedCustomStats.expertWins ?? 0) >= 1;
			const score = (hasMedium ? 1 : 0) + (hasHard ? 1 : 0) + (hasExpert ? 1 : 0);
			return {
				currentProgress: score,
				currentTier: hasExpert ? 'gold' : hasHard ? 'silver' : hasMedium ? 'bronze' : null,
				nextThreshold: hasExpert ? null : hasHard ? 3 : hasMedium ? 2 : 1,
				bronzeUnlocked: hasMedium,
				silverUnlocked: hasHard,
				goldUnlocked: hasExpert,
			};
		},
	},
	{
		id: 'lasers_par_precision',
		type: 'ladder',
		tier: 'gold',
		metric: 'par_wins',
		thresholds: {
			bronze: 1,
			silver: 10,
			gold: 30,
		},
		titleKey: 'medals.lasers.par_precision.title',
		descriptionKey: 'medals.lasers.par_precision.desc',
		icon: 'star',
		evaluate: ({ updatedCustomStats }) => evaluateLadder(updatedCustomStats.parWins ?? 0, 1, 10, 30),
	},
	{
		id: 'lasers_pure_optics',
		type: 'ladder',
		tier: 'gold',
		metric: 'hint_free_wins',
		thresholds: {
			bronze: 3,
			silver: 15,
			gold: 40,
		},
		titleKey: 'medals.lasers.pure_optics.title',
		descriptionKey: 'medals.lasers.pure_optics.desc',
		icon: 'sparkles',
		evaluate: ({ updatedCustomStats }) => evaluateLadder(updatedCustomStats.hintFreeWins ?? 0, 3, 15, 40),
	},
	{
		id: 'lasers_light_speed',
		type: 'standalone',
		tier: 'silver',
		target: 1,
		titleKey: 'medals.lasers.light_speed.title',
		descriptionKey: 'medals.lasers.light_speed.desc',
		icon: 'trophy-gold',
		evaluate: ({ updatedCustomStats }) => {
			const fastest = updatedCustomStats.fastestMediumPlusSeconds ?? null;
			const unlocked = fastest !== null && fastest > 0 && fastest <= 60;
			return {
				unlocked,
				progress: unlocked ? 1 : 0,
				target: 1,
			};
		},
	},
];

export default LASERS_MEDAL_DEFINITIONS;
