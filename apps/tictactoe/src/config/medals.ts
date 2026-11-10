import type { AchievementDefinition } from '@arcade/lib-medals';

export const TICTACTOE_MEDAL_DEFINITIONS: readonly AchievementDefinition<'tictactoe'>[] = [
	{
		id: 'tictactoe_first_win',
		type: 'standalone',
		tier: 'bronze',
		target: 1,
		titleKey: 'medals.tictactoe.first_win.title',
		descriptionKey: 'medals.tictactoe.first_win.desc',
		icon: 'trophy-bronze',
		evaluate: ({ updatedBaseStats }) => ({
			unlocked: updatedBaseStats.gamesWon >= 1,
			progress: Math.min(1, updatedBaseStats.gamesWon),
			target: 1,
		}),
	},
	{
		id: 'tictactoe_veteran_duelist',
		type: 'ladder',
		tier: 'gold',
		metric: 'total_wins',
		thresholds: {
			bronze: 3,
			silver: 10,
			gold: 25,
		},
		titleKey: 'medals.tictactoe.veteran_duelist.title',
		descriptionKey: 'medals.tictactoe.veteran_duelist.desc',
		icon: 'trophy-gold',
		evaluate: ({ updatedBaseStats }) => {
			const wins = updatedBaseStats.gamesWon;
			let currentTier: 'bronze' | 'silver' | 'gold' | null = null;
			let nextThreshold: number | null = 3;

			if (wins >= 25) {
				currentTier = 'gold';
				nextThreshold = null;
			} else if (wins >= 10) {
				currentTier = 'silver';
				nextThreshold = 25;
			} else if (wins >= 3) {
				currentTier = 'bronze';
				nextThreshold = 10;
			}

			return {
				currentProgress: wins,
				currentTier,
				nextThreshold,
				bronzeUnlocked: wins >= 3,
				silverUnlocked: wins >= 10,
				goldUnlocked: wins >= 25,
			};
		},
	},
];
