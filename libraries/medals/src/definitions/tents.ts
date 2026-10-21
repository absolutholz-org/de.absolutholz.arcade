import type { AchievementDefinition, MedalTier } from '../types/index.js';

const EASY_PRESETS = Array.from({ length: 25 }, (_, i) => `easy-${i + 1}`);
const MEDIUM_PRESETS = Array.from({ length: 25 }, (_, i) => `medium-${i + 1}`);
const HARD_PRESETS = Array.from({ length: 25 }, (_, i) => `hard-${i + 1}`);
const EXPERT_PRESETS = Array.from({ length: 25 }, (_, i) => `expert-${i + 1}`);
const HARD_AND_EXPERT_PRESETS = [...HARD_PRESETS, ...EXPERT_PRESETS];

export const TENTS_MEDAL_DEFINITIONS: readonly AchievementDefinition<'tents'>[] = [
	{
		id: 'tents_first_pitch',
		type: 'standalone',
		tier: 'bronze',
		titleKey: 'medals.tents.first_pitch.title',
		descriptionKey: 'medals.tents.first_pitch.desc',
		icon: 'trophy-bronze',
		evaluate: ({ updatedBaseStats }) => ({
			unlocked: updatedBaseStats.gamesWon >= 1,
			progress: Math.min(1, updatedBaseStats.gamesWon),
			target: 1,
		}),
	},
	{
		id: 'tents_pristine_pitch',
		type: 'standalone',
		tier: 'silver',
		titleKey: 'medals.tents.pristine_pitch.title',
		descriptionKey: 'medals.tents.pristine_pitch.desc',
		icon: 'trophy-silver',
		evaluate: ({ result }) => {
			const mistakes = (result.roundContext?.mistakesCount as number | undefined) ?? 0;
			const level = (result.levelKey ?? result.roundContext?.difficulty) as string | undefined;
			const isEligible = level === 'medium' || level === 'hard' || level === 'expert';
			const unlocked = Boolean(result.won && isEligible && mistakes === 0);
			return {
				unlocked,
				progress: unlocked ? 1 : 0,
				target: 1,
			};
		},
	},
	{
		id: 'tents_speed_camper',
		type: 'standalone',
		tier: 'gold',
		titleKey: 'medals.tents.speed_camper.title',
		descriptionKey: 'medals.tents.speed_camper.desc',
		icon: 'trophy-gold',
		evaluate: ({ result }) => {
			const level = (result.levelKey ?? result.roundContext?.difficulty) as string | undefined;
			const isEligible = level === 'hard' || level === 'expert';
			const unlocked = Boolean(
				result.won && isEligible && result.playTimeSeconds > 0 && result.playTimeSeconds <= 120,
			);
			return {
				unlocked,
				progress: unlocked ? 1 : 0,
				target: 1,
			};
		},
	},
	{
		id: 'tents_minimalist',
		type: 'standalone',
		tier: 'silver',
		titleKey: 'medals.tents.minimalist.title',
		descriptionKey: 'medals.tents.minimalist.desc',
		icon: 'trophy-silver',
		evaluate: ({ result }) => {
			const grassPlaced = (result.roundContext?.grassPlacedCount as number | undefined) ?? 0;
			const unlocked = Boolean(result.won && grassPlaced === 0);
			return {
				unlocked,
				progress: unlocked ? 1 : 0,
				target: 1,
			};
		},
	},
	{
		id: 'tents_master_camper',
		type: 'ladder',
		tier: 'gold',
		metric: 'total_wins',
		thresholds: {
			bronze: 5,
			silver: 25,
			gold: 100,
		},
		titleKey: 'medals.tents.master_camper.title',
		descriptionKey: 'medals.tents.master_camper.desc',
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
		id: 'tents_expedition_tour',
		type: 'ladder',
		tier: 'gold',
		thresholds: {
			bronze: 25,
			silver: 25,
			gold: 50,
		},
		titleKey: 'medals.tents.expedition_tour.title',
		descriptionKey: 'medals.tents.expedition_tour.desc',
		icon: 'trophy-gold',
		evaluate: ({ updatedCustomStats }) => {
			const completed = new Set(updatedCustomStats.completedPresetIds ?? []);
			const easyCount = [...completed].filter((id) => id.startsWith('easy-') || EASY_PRESETS.includes(id)).length;
			const mediumCount = [...completed].filter(
				(id) => id.startsWith('medium-') || MEDIUM_PRESETS.includes(id),
			).length;
			const hardAndExpertCount = [...completed].filter(
				(id) => id.startsWith('hard-') || id.startsWith('expert-') || HARD_AND_EXPERT_PRESETS.includes(id),
			).length;

			const bronze = easyCount >= 25;
			const silver = bronze && mediumCount >= 25;
			const gold = silver && hardAndExpertCount >= 50;

			let currentTier: MedalTier | null = null;
			let currentProgress = easyCount;
			let nextThreshold: number | null = 25;

			if (gold) {
				currentTier = 'gold';
				currentProgress = 50;
				nextThreshold = null;
			} else if (silver) {
				currentTier = 'silver';
				currentProgress = hardAndExpertCount;
				nextThreshold = 50;
			} else if (bronze) {
				currentTier = 'bronze';
				currentProgress = mediumCount;
				nextThreshold = 25;
			} else {
				currentTier = null;
				currentProgress = easyCount;
				nextThreshold = 25;
			}

			return {
				currentProgress,
				currentTier,
				nextThreshold,
				bronzeUnlocked: bronze,
				silverUnlocked: silver,
				goldUnlocked: gold,
			};
		},
	},
	{
		id: 'tents_survivalist_streak',
		type: 'ladder',
		tier: 'gold',
		metric: 'win_streak',
		thresholds: {
			bronze: 3,
			silver: 5,
			gold: 10,
		},
		titleKey: 'medals.tents.survivalist_streak.title',
		descriptionKey: 'medals.tents.survivalist_streak.desc',
		icon: 'trophy-gold',
		evaluate: ({ priorState, updatedBaseStats, updatedCustomStats }) => {
			const prior = priorState.medalProgress.tents_survivalist_streak;
			const bronze = Boolean(
				prior?.bronzeUnlocked || updatedBaseStats.bestStreak >= 3 || updatedBaseStats.currentStreak >= 3,
			);
			const silver = Boolean(
				prior?.silverUnlocked ||
					updatedBaseStats.bestStreak >= 5 ||
					updatedBaseStats.currentStreak >= 5 ||
					(updatedCustomStats.bestMediumStreak ?? 0) >= 5 ||
					(updatedCustomStats.currentMediumStreak ?? 0) >= 5,
			);
			const gold = Boolean(
				prior?.goldUnlocked ||
					updatedBaseStats.bestStreak >= 10 ||
					updatedBaseStats.currentStreak >= 10 ||
					(updatedCustomStats.bestHardStreak ?? 0) >= 10 ||
					(updatedCustomStats.currentHardStreak ?? 0) >= 10,
			);

			const displayStreak = Math.max(
				updatedBaseStats.currentStreak,
				updatedBaseStats.bestStreak,
				updatedCustomStats.currentMediumStreak ?? 0,
				updatedCustomStats.currentHardStreak ?? 0,
			);

			let currentTier: MedalTier | null = null;
			let nextThreshold: number | null = 3;

			if (gold) {
				currentTier = 'gold';
				nextThreshold = null;
			} else if (silver) {
				currentTier = 'silver';
				nextThreshold = 10;
			} else if (bronze) {
				currentTier = 'bronze';
				nextThreshold = 5;
			}

			return {
				currentProgress: displayStreak,
				currentTier,
				nextThreshold,
				bronzeUnlocked: bronze,
				silverUnlocked: silver,
				goldUnlocked: gold,
			};
		},
	},
	{
		id: 'tents_grand_outfitter',
		type: 'ladder',
		tier: 'gold',
		metric: 'total_tents_pitched',
		thresholds: {
			bronze: 100,
			silver: 500,
			gold: 2500,
		},
		titleKey: 'medals.tents.grand_outfitter.title',
		descriptionKey: 'medals.tents.grand_outfitter.desc',
		icon: 'trophy-gold',
		evaluate: ({ updatedCustomStats, result }) => {
			const pitched =
				(updatedCustomStats.totalTentsPitched ?? 0) ||
				((result.roundContext?.totalTentsPitched as number | undefined) ??
					(result.roundContext?.tentsPitched as number | undefined) ??
					(result.roundContext?.tentsCount as number | undefined) ??
					0);

			let currentTier: MedalTier | null = null;
			let nextThreshold: number | null = 100;

			if (pitched >= 2500) {
				currentTier = 'gold';
				nextThreshold = null;
			} else if (pitched >= 500) {
				currentTier = 'silver';
				nextThreshold = 2500;
			} else if (pitched >= 100) {
				currentTier = 'bronze';
				nextThreshold = 500;
			}

			return {
				currentProgress: pitched,
				currentTier,
				nextThreshold,
				bronzeUnlocked: pitched >= 100,
				silverUnlocked: pitched >= 500,
				goldUnlocked: pitched >= 2500,
			};
		},
	},
];
