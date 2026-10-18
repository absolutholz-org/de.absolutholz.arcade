import type { AchievementDefinition } from '../types/index.js';

export const QUEENS_MEDAL_DEFINITIONS: readonly AchievementDefinition<'queens'>[] = [
	{
		id: 'queens_first_win',
		tier: 'bronze',
		titleKey: 'medals.queens.first_win.title',
		descriptionKey: 'medals.queens.first_win.desc',
		icon: 'trophy-bronze',
		evaluate: ({ updatedBaseStats }) => ({
			unlocked: updatedBaseStats.gamesWon >= 1,
			progress: Math.min(1, updatedBaseStats.gamesWon),
			target: 1,
		}),
	},
	{
		id: 'queens_reign',
		tier: 'gold',
		titleKey: 'medals.queens.reign.title',
		descriptionKey: 'medals.queens.reign.desc',
		icon: 'trophy-gold',
		evaluate: ({ updatedBaseStats }) => ({
			unlocked: updatedBaseStats.gamesWon >= 15,
			progress: Math.min(15, updatedBaseStats.gamesWon),
			target: 15,
		}),
	},
];
