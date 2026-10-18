import type { AchievementDefinition } from '../types/index.js';

export const NONOGRAM_MEDAL_DEFINITIONS: readonly AchievementDefinition<'nonogram'>[] = [
	{
		id: 'nonogram_first_solve',
		tier: 'bronze',
		titleKey: 'medals.nonogram.first_solve.title',
		descriptionKey: 'medals.nonogram.first_solve.desc',
		icon: 'trophy-bronze',
		evaluate: ({ updatedCustomStats }) => {
			const count = Object.values(updatedCustomStats.puzzles).filter((p) => p.completed).length;
			return {
				unlocked: count >= 1,
				progress: Math.min(1, count),
				target: 1,
			};
		},
	},
	{
		id: 'nonogram_gallery_curator',
		tier: 'silver',
		titleKey: 'medals.nonogram.gallery_curator.title',
		descriptionKey: 'medals.nonogram.gallery_curator.desc',
		icon: 'trophy-silver',
		evaluate: ({ updatedCustomStats }) => {
			const count = Object.values(updatedCustomStats.puzzles).filter((p) => p.completed).length;
			return {
				unlocked: count >= 5,
				progress: Math.min(5, count),
				target: 5,
			};
		},
	},
	{
		id: 'nonogram_perfectionist',
		tier: 'gold',
		titleKey: 'medals.nonogram.perfectionist.title',
		descriptionKey: 'medals.nonogram.perfectionist.desc',
		icon: 'trophy-gold',
		evaluate: ({ updatedCustomStats }) => {
			const count = Object.values(updatedCustomStats.puzzles).filter((p) => p.completedWithoutErrors).length;
			return {
				unlocked: count >= 10,
				progress: Math.min(10, count),
				target: 10,
			};
		},
	},
	{
		id: 'nonogram_swift_mind',
		tier: 'gold',
		titleKey: 'medals.nonogram.swift_mind.title',
		descriptionKey: 'medals.nonogram.swift_mind.desc',
		icon: 'sparkles',
		evaluate: ({ result }) => ({
			unlocked: result.won && result.playTimeSeconds > 0 && result.playTimeSeconds <= 60,
		}),
	},
];
