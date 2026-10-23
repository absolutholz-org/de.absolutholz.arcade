import type { AchievementDefinition, MedalTier } from '../types/index.js';

export const WATERSORT_MEDAL_DEFINITIONS: readonly AchievementDefinition<'watersort'>[] = [
	{
		id: 'watersort_chemist_ladder',
		type: 'ladder',
		tier: 'gold',
		metric: 'total_wins',
		thresholds: {
			bronze: 5,
			silver: 25,
			gold: 100,
		},
		titleKey: 'medals.watersort.chemist_ladder.title',
		descriptionKey: 'medals.watersort.chemist_ladder.desc',
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
				progress: wins,
				bronzeUnlocked: wins >= 5,
				silverUnlocked: wins >= 25,
				goldUnlocked: wins >= 100,
			};
		},
	},
	{
		id: 'watersort_perfect_ladder',
		type: 'ladder',
		tier: 'gold',
		metric: 'wins_without_undo',
		thresholds: {
			bronze: 3,
			silver: 10,
			gold: 25,
		},
		titleKey: 'medals.watersort.perfect_ladder.title',
		descriptionKey: 'medals.watersort.perfect_ladder.desc',
		icon: 'trophy-gold',
		evaluate: ({ updatedCustomStats }) => {
			const wins = updatedCustomStats.winsWithoutUndo ?? 0;
			let currentTier: MedalTier | null = null;
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
				progress: wins,
				bronzeUnlocked: wins >= 3,
				silverUnlocked: wins >= 10,
				goldUnlocked: wins >= 25,
			};
		},
	},
	{
		id: 'watersort_first_sort',
		type: 'standalone',
		tier: 'bronze',
		titleKey: 'medals.watersort.first_sort.title',
		descriptionKey: 'medals.watersort.first_sort.desc',
		icon: 'trophy-bronze',
		evaluate: ({ updatedBaseStats }) => ({
			unlocked: updatedBaseStats.gamesWon >= 1,
			progress: Math.min(1, updatedBaseStats.gamesWon),
			target: 1,
		}),
	},
	{
		id: 'watersort_medium_clear',
		type: 'standalone',
		tier: 'bronze',
		titleKey: 'medals.watersort.medium_clear.title',
		descriptionKey: 'medals.watersort.medium_clear.desc',
		icon: 'trophy-bronze',
		evaluate: ({ updatedCustomStats }) => {
			const wins = updatedCustomStats.mediumWins ?? 0;
			return {
				unlocked: wins >= 5,
				progress: Math.min(5, wins),
				target: 5,
			};
		},
	},
	{
		id: 'watersort_hard_clear',
		type: 'standalone',
		tier: 'silver',
		titleKey: 'medals.watersort.hard_clear.title',
		descriptionKey: 'medals.watersort.hard_clear.desc',
		icon: 'trophy-silver',
		evaluate: ({ updatedCustomStats }) => {
			const wins = updatedCustomStats.hardWins ?? 0;
			return {
				unlocked: wins >= 5,
				progress: Math.min(5, wins),
				target: 5,
			};
		},
	},
	{
		id: 'watersort_expert_clear',
		type: 'standalone',
		tier: 'gold',
		titleKey: 'medals.watersort.expert_clear.title',
		descriptionKey: 'medals.watersort.expert_clear.desc',
		icon: 'trophy-gold',
		evaluate: ({ updatedCustomStats }) => {
			const wins = updatedCustomStats.expertWins ?? 0;
			return {
				unlocked: wins >= 1,
				progress: Math.min(1, wins),
				target: 1,
			};
		},
	},
	{
		id: 'watersort_master_suite',
		type: 'standalone',
		tier: 'gold',
		titleKey: 'medals.watersort.master_suite.title',
		descriptionKey: 'medals.watersort.master_suite.desc',
		icon: 'trophy-gold',
		evaluate: ({ updatedCustomStats }) => {
			const clearedTiers =
				((updatedCustomStats.easyWins ?? 0) > 0 ? 1 : 0) +
				((updatedCustomStats.mediumWins ?? 0) > 0 ? 1 : 0) +
				((updatedCustomStats.hardWins ?? 0) > 0 ? 1 : 0) +
				((updatedCustomStats.expertWins ?? 0) > 0 ? 1 : 0);
			return {
				unlocked: clearedTiers >= 4,
				progress: clearedTiers,
				target: 4,
			};
		},
	},
	{
		id: 'watersort_speed_pourer',
		type: 'standalone',
		tier: 'bronze',
		titleKey: 'medals.watersort.speed_pourer.title',
		descriptionKey: 'medals.watersort.speed_pourer.desc',
		icon: 'trophy-bronze',
		evaluate: ({ result }) => {
			const elapsed = (result.roundContext?.elapsedSeconds as number | undefined) ?? result.playTimeSeconds;
			const unlocked = Boolean(result.won && elapsed < 45);
			return {
				unlocked,
				progress: unlocked ? 1 : 0,
				target: 1,
			};
		},
	},
	{
		id: 'watersort_blitz_chemist',
		type: 'standalone',
		tier: 'silver',
		titleKey: 'medals.watersort.blitz_chemist.title',
		descriptionKey: 'medals.watersort.blitz_chemist.desc',
		icon: 'trophy-silver',
		evaluate: ({ result }) => {
			const difficulty = (result.roundContext?.difficulty as string | undefined) ?? result.levelKey;
			const elapsed = (result.roundContext?.elapsedSeconds as number | undefined) ?? result.playTimeSeconds;
			const unlocked = Boolean(result.won && difficulty === 'medium' && elapsed < 30);
			return {
				unlocked,
				progress: unlocked ? 1 : 0,
				target: 1,
			};
		},
	},
	{
		id: 'watersort_expert_speed',
		type: 'standalone',
		tier: 'gold',
		titleKey: 'medals.watersort.expert_speed.title',
		descriptionKey: 'medals.watersort.expert_speed.desc',
		icon: 'trophy-gold',
		evaluate: ({ result }) => {
			const difficulty = (result.roundContext?.difficulty as string | undefined) ?? result.levelKey;
			const elapsed = (result.roundContext?.elapsedSeconds as number | undefined) ?? result.playTimeSeconds;
			const unlocked = Boolean(result.won && difficulty === 'hard' && elapsed < 60);
			return {
				unlocked,
				progress: unlocked ? 1 : 0,
				target: 1,
			};
		},
	},
	{
		id: 'watersort_par_perfection',
		type: 'standalone',
		tier: 'silver',
		titleKey: 'medals.watersort.par_perfection.title',
		descriptionKey: 'medals.watersort.par_perfection.desc',
		icon: 'trophy-silver',
		evaluate: ({ result }) => {
			const difficulty = (result.roundContext?.difficulty as string | undefined) ?? result.levelKey;
			const isEligible = difficulty === 'medium' || difficulty === 'hard';
			const moves = (result.roundContext?.moves as number | undefined) ?? 0;
			const parMoves = (result.roundContext?.parMoves as number | undefined) ?? 0;
			const unlocked = Boolean(result.won && isEligible && moves > 0 && parMoves > 0 && moves <= parMoves);
			return {
				unlocked,
				progress: unlocked ? 1 : 0,
				target: 1,
			};
		},
	},
	{
		id: 'watersort_theoretical_limit',
		type: 'standalone',
		tier: 'gold',
		titleKey: 'medals.watersort.theoretical_limit.title',
		descriptionKey: 'medals.watersort.theoretical_limit.desc',
		icon: 'trophy-gold',
		evaluate: ({ result }) => {
			const difficulty = (result.roundContext?.difficulty as string | undefined) ?? result.levelKey;
			const moves = (result.roundContext?.moves as number | undefined) ?? 0;
			const unlocked = Boolean(result.won && difficulty === 'expert' && moves > 0 && moves <= 34);
			return {
				unlocked,
				progress: unlocked ? 1 : 0,
				target: 1,
			};
		},
	},
	{
		id: 'watersort_flawless',
		type: 'standalone',
		tier: 'bronze',
		titleKey: 'medals.watersort.flawless.title',
		descriptionKey: 'medals.watersort.flawless.desc',
		icon: 'trophy-bronze',
		evaluate: ({ result }) => {
			const undos = (result.roundContext?.undosUsed as number | undefined) ?? 0;
			const hints = (result.roundContext?.hintsUsed as number | undefined) ?? 0;
			const unlocked = Boolean(result.won && undos === 0 && hints === 0);
			return {
				unlocked,
				progress: unlocked ? 1 : 0,
				target: 1,
			};
		},
	},
	{
		id: 'watersort_comeback_kid',
		type: 'standalone',
		tier: 'bronze',
		titleKey: 'medals.watersort.comeback_kid.title',
		descriptionKey: 'medals.watersort.comeback_kid.desc',
		icon: 'trophy-bronze',
		evaluate: ({ result }) => {
			const undos = (result.roundContext?.undosUsed as number | undefined) ?? 0;
			const unlocked = Boolean(result.won && undos >= 6);
			return {
				unlocked,
				progress: Math.min(6, undos),
				target: 6,
			};
		},
	},
	{
		id: 'watersort_color_cascade',
		type: 'standalone',
		tier: 'silver',
		titleKey: 'medals.watersort.color_cascade.title',
		descriptionKey: 'medals.watersort.color_cascade.desc',
		icon: 'trophy-silver',
		evaluate: ({ result }) => {
			const consecutive = (result.roundContext?.maxConsecutiveTubeCompletions as number | undefined) ?? 0;
			const unlocked = Boolean(result.won && consecutive >= 4);
			return {
				unlocked,
				progress: Math.min(4, consecutive),
				target: 4,
			};
		},
	},
	{
		id: 'watersort_single_buffer',
		type: 'standalone',
		tier: 'silver',
		titleKey: 'medals.watersort.single_buffer.title',
		descriptionKey: 'medals.watersort.single_buffer.desc',
		icon: 'trophy-silver',
		evaluate: ({ result }) => {
			const emptyBuffersUsed = (result.roundContext?.emptyBuffersUsed as number | undefined) ?? 2;
			const unlocked = Boolean(result.won && emptyBuffersUsed <= 1);
			return {
				unlocked,
				progress: unlocked ? 1 : 0,
				target: 1,
			};
		},
	},
];
