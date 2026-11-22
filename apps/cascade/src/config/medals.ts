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

export const CASCADE_MEDAL_DEFINITIONS: readonly AchievementDefinition<'cascade'>[] = [
	{
		id: 'cascade_tile_clearer',
		type: 'ladder',
		tier: 'gold',
		metric: 'games_played',
		thresholds: {
			bronze: 1,
			silver: 10,
			gold: 50,
		},
		titleKey: 'medals.cascade.tile_clearer.title',
		descriptionKey: 'medals.cascade.tile_clearer.desc',
		icon: 'trophy-gold',
		evaluate: ({ updatedBaseStats }) => evaluateLadder(updatedBaseStats.gamesPlayed, 1, 10, 50),
	},
	{
		id: 'cascade_score_chaser',
		type: 'ladder',
		tier: 'gold',
		metric: 'best_score',
		thresholds: {
			bronze: 1500,
			silver: 3500,
			gold: 6000,
		},
		titleKey: 'medals.cascade.score_chaser.title',
		descriptionKey: 'medals.cascade.score_chaser.desc',
		icon: 'star',
		evaluate: ({ updatedCustomStats }) => evaluateLadder(updatedCustomStats.bestScore ?? 0, 1500, 3500, 6000),
	},
	{
		id: 'cascade_chain_reaction',
		type: 'ladder',
		tier: 'gold',
		metric: 'max_cluster',
		thresholds: {
			bronze: 10,
			silver: 20,
			gold: 35,
		},
		titleKey: 'medals.cascade.chain_reaction.title',
		descriptionKey: 'medals.cascade.chain_reaction.desc',
		icon: 'sparkles',
		evaluate: ({ updatedCustomStats }) => evaluateLadder(updatedCustomStats.maxClusterCleared ?? 0, 10, 20, 35),
	},
	{
		id: 'cascade_perfect_clear',
		type: 'standalone',
		tier: 'gold',
		target: 1,
		titleKey: 'medals.cascade.perfect_clear.title',
		descriptionKey: 'medals.cascade.perfect_clear.desc',
		icon: 'trophy-gold',
		evaluate: ({ updatedCustomStats }) => ({
			unlocked: (updatedCustomStats.perfectClears ?? 0) >= 1,
			progress: Math.min(1, updatedCustomStats.perfectClears ?? 0),
			target: 1,
		}),
	},
	{
		id: 'cascade_five_color_master',
		type: 'standalone',
		tier: 'silver',
		target: 2000,
		titleKey: 'medals.cascade.five_color_master.title',
		descriptionKey: 'medals.cascade.five_color_master.desc',
		icon: 'star',
		evaluate: ({ updatedCustomStats }) => ({
			unlocked: (updatedCustomStats.hardBestScore ?? 0) >= 2000,
			progress: Math.min(2000, updatedCustomStats.hardBestScore ?? 0),
			target: 2000,
		}),
	},
	{
		id: 'cascade_no_looking_back',
		type: 'standalone',
		tier: 'gold',
		target: 1,
		titleKey: 'medals.cascade.no_looking_back.title',
		descriptionKey: 'medals.cascade.no_looking_back.desc',
		icon: 'sparkles',
		evaluate: ({ updatedCustomStats }) => ({
			unlocked: (updatedCustomStats.perfectClearsWithoutUndo ?? 0) >= 1,
			progress: Math.min(1, updatedCustomStats.perfectClearsWithoutUndo ?? 0),
			target: 1,
		}),
	},
];

export default CASCADE_MEDAL_DEFINITIONS;
