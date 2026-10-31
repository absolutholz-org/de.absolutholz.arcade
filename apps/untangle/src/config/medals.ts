import type { AchievementDefinition, MedalTier } from '@arcade/lib-medals';

export const UNTANGLE_MEDAL_DEFINITIONS: readonly AchievementDefinition<'untangle'>[] = [
	{
		id: 'untangle_first_win',
		type: 'standalone',
		tier: 'bronze',
		target: 1,
		titleKey: 'medals.untangle.first_win.title',
		descriptionKey: 'medals.untangle.first_win.desc',
		icon: 'trophy-bronze',
		evaluate: ({ updatedBaseStats }) => ({
			unlocked: updatedBaseStats.gamesWon >= 1,
			progress: Math.min(1, updatedBaseStats.gamesWon),
			target: 1,
		}),
	},
	{
		id: 'untangle_wins',
		type: 'ladder',
		tier: 'gold',
		metric: 'total_wins',
		thresholds: {
			bronze: 5,
			silver: 25,
			gold: 100,
		},
		titleKey: 'medals.untangle.wins.title',
		descriptionKey: 'medals.untangle.wins.desc',
		icon: 'trophy-gold',
		evaluate: ({ updatedBaseStats }) => {
			const wins = updatedBaseStats.gamesWon;
			let currentTier: MedalTier | null = null;
			let nextThreshold: number | null = 5;

			if (wins >= 100) {
				currentTier = 'gold';
				nextThreshold = null;
			} else if (wins >= 25) {
				currentTier = 'silver';
				nextThreshold = 100;
			} else if (wins >= 5) {
				currentTier = 'bronze';
				nextThreshold = 25;
			}

			return {
				currentProgress: wins,
				currentTier,
				nextThreshold,
				bronzeUnlocked: wins >= 5,
				silverUnlocked: wins >= 25,
				goldUnlocked: wins >= 100,
			};
		},
	},
	{
		id: 'untangle_hard_wins',
		type: 'ladder',
		tier: 'gold',
		thresholds: {
			bronze: 3,
			silver: 15,
			gold: 50,
		},
		titleKey: 'medals.untangle.hard_wins.title',
		descriptionKey: 'medals.untangle.hard_wins.desc',
		icon: 'trophy-gold',
		evaluate: ({ updatedCustomStats }) => {
			const hardWins = Number(updatedCustomStats.hardWins ?? 0);
			let currentTier: MedalTier | null = null;
			let nextThreshold: number | null = 3;

			if (hardWins >= 50) {
				currentTier = 'gold';
				nextThreshold = null;
			} else if (hardWins >= 15) {
				currentTier = 'silver';
				nextThreshold = 50;
			} else if (hardWins >= 3) {
				currentTier = 'bronze';
				nextThreshold = 15;
			}

			return {
				currentProgress: hardWins,
				currentTier,
				nextThreshold,
				bronzeUnlocked: hardWins >= 3,
				silverUnlocked: hardWins >= 15,
				goldUnlocked: hardWins >= 50,
			};
		},
	},
	{
		id: 'untangle_streak',
		type: 'ladder',
		tier: 'gold',
		metric: 'win_streak',
		thresholds: {
			bronze: 3,
			silver: 7,
			gold: 15,
		},
		titleKey: 'medals.untangle.streak.title',
		descriptionKey: 'medals.untangle.streak.desc',
		icon: 'trophy-gold',
		evaluate: ({ priorState, updatedBaseStats }) => {
			const prior = priorState.medalProgress.untangle_streak;
			const best = Math.max(updatedBaseStats.bestStreak, updatedBaseStats.currentStreak);
			const bronze = Boolean(prior?.bronzeUnlocked || best >= 3);
			const silver = Boolean(prior?.silverUnlocked || best >= 7);
			const gold = Boolean(prior?.goldUnlocked || best >= 15);

			let currentTier: MedalTier | null = null;
			let nextThreshold: number | null = 3;

			if (gold) {
				currentTier = 'gold';
				nextThreshold = null;
			} else if (silver) {
				currentTier = 'silver';
				nextThreshold = 15;
			} else if (bronze) {
				currentTier = 'bronze';
				nextThreshold = 7;
			}

			return {
				currentProgress: updatedBaseStats.currentStreak,
				currentTier,
				nextThreshold,
				bronzeUnlocked: bronze,
				silverUnlocked: silver,
				goldUnlocked: gold,
			};
		},
	},
	{
		id: 'untangle_speed_demon',
		type: 'standalone',
		tier: 'silver',
		titleKey: 'medals.untangle.speed_demon.title',
		descriptionKey: 'medals.untangle.speed_demon.desc',
		icon: 'trophy-silver',
		evaluate: ({ result }) => {
			const isEligible = result.levelKey === 'medium' || result.levelKey === 'hard';
			return {
				unlocked: Boolean(
					result.won && isEligible && result.playTimeSeconds > 0 && result.playTimeSeconds <= 45,
				),
			};
		},
	},
	{
		id: 'untangle_no_undo',
		type: 'standalone',
		tier: 'gold',
		titleKey: 'medals.untangle.no_undo.title',
		descriptionKey: 'medals.untangle.no_undo.desc',
		icon: 'trophy-gold',
		evaluate: ({ result }) => {
			const undoUsed = Boolean(result.roundContext?.undoUsed);
			return {
				unlocked: Boolean(result.won && result.levelKey === 'hard' && !undoUsed),
			};
		},
	},
];

export default UNTANGLE_MEDAL_DEFINITIONS;
