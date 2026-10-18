import type { AchievementDefinition } from '../types/index.js';

export const SUDOKU_MEDAL_DEFINITIONS: readonly AchievementDefinition<'sudoku'>[] = [
	{
		id: 'sudoku_first_win',
		tier: 'bronze',
		titleKey: 'medals.sudoku.first_win.title',
		descriptionKey: 'medals.sudoku.first_win.desc',
		icon: 'trophy-bronze',
		evaluate: ({ updatedBaseStats }) => ({
			unlocked: updatedBaseStats.gamesWon >= 1,
			progress: Math.min(1, updatedBaseStats.gamesWon),
			target: 1,
		}),
	},
	{
		id: 'sudoku_win_streak_3',
		tier: 'silver',
		titleKey: 'medals.sudoku.win_streak_3.title',
		descriptionKey: 'medals.sudoku.win_streak_3.desc',
		icon: 'trophy-silver',
		evaluate: ({ updatedBaseStats }) => ({
			unlocked: updatedBaseStats.bestStreak >= 3,
			progress: Math.min(3, updatedBaseStats.bestStreak),
			target: 3,
		}),
	},
	{
		id: 'sudoku_expert_master',
		tier: 'gold',
		titleKey: 'medals.sudoku.expert_master.title',
		descriptionKey: 'medals.sudoku.expert_master.desc',
		icon: 'trophy-gold',
		evaluate: ({ updatedCustomStats }) => {
			const expertWon = updatedCustomStats.difficulties.expert.gamesWon;
			return {
				unlocked: expertWon >= 10,
				progress: Math.min(10, expertWon),
				target: 10,
			};
		},
	},
	{
		id: 'sudoku_speed_demon',
		tier: 'gold',
		titleKey: 'medals.sudoku.speed_demon.title',
		descriptionKey: 'medals.sudoku.speed_demon.desc',
		icon: 'sparkles',
		evaluate: ({ result }) => ({
			unlocked: result.won && result.playTimeSeconds > 0 && result.playTimeSeconds <= 180,
		}),
	},
	{
		id: 'sudoku_flawless',
		tier: 'gold',
		titleKey: 'medals.sudoku.flawless.title',
		descriptionKey: 'medals.sudoku.flawless.desc',
		icon: 'star',
		evaluate: ({ result }) => ({
			unlocked:
				result.won && (result.roundContext?.mistakesCount === 0 || result.roundContext?.errorsCount === 0),
		}),
	},
];
