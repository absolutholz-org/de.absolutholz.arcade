import type { AchievementDefinition } from '../types/index.js';

export const MINESWEEPER_MEDAL_DEFINITIONS: readonly AchievementDefinition<'minesweeper'>[] = [
	{
		id: 'minesweeper_first_clear',
		tier: 'bronze',
		titleKey: 'medals.minesweeper.first_clear.title',
		descriptionKey: 'medals.minesweeper.first_clear.desc',
		icon: 'trophy-bronze',
		evaluate: ({ updatedBaseStats }) => ({
			unlocked: updatedBaseStats.gamesWon >= 1,
			progress: Math.min(1, updatedBaseStats.gamesWon),
			target: 1,
		}),
	},
	{
		id: 'minesweeper_veteran',
		tier: 'silver',
		titleKey: 'medals.minesweeper.veteran.title',
		descriptionKey: 'medals.minesweeper.veteran.desc',
		icon: 'trophy-silver',
		evaluate: ({ updatedBaseStats }) => ({
			unlocked: updatedBaseStats.gamesWon >= 10,
			progress: Math.min(10, updatedBaseStats.gamesWon),
			target: 10,
		}),
	},
	{
		id: 'minesweeper_demolition_expert',
		tier: 'gold',
		titleKey: 'medals.minesweeper.demolition_expert.title',
		descriptionKey: 'medals.minesweeper.demolition_expert.desc',
		icon: 'trophy-gold',
		evaluate: ({ updatedCustomStats }) => ({
			unlocked: updatedCustomStats.difficulties.expert.gamesWon >= 1,
			progress: Math.min(1, updatedCustomStats.difficulties.expert.gamesWon),
			target: 1,
		}),
	},
];
