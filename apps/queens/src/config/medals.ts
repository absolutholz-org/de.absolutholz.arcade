import type { AchievementDefinition, MedalTier } from '@arcade/lib-medals';

const EASY_PRESETS = Array.from({ length: 25 }, (_, i) => `easy-${i + 1}`);
const MEDIUM_PRESETS = Array.from({ length: 25 }, (_, i) => `medium-${i + 1}`);
const HARD_PRESETS = Array.from({ length: 25 }, (_, i) => `hard-${i + 1}`);
const EXPERT_PRESETS = Array.from({ length: 25 }, (_, i) => `expert-${i + 1}`);
const HARD_AND_EXPERT_PRESETS = [...HARD_PRESETS, ...EXPERT_PRESETS];

export const QUEENS_MEDAL_DEFINITIONS: readonly AchievementDefinition<'queens'>[] = [
	{
		id: 'queens_royal_placement',
		type: 'standalone',
		tier: 'bronze',
		target: 1,
		titleKey: 'medals.queens.royal_placement.title',
		descriptionKey: 'medals.queens.royal_placement.desc',
		icon: 'trophy-bronze',
		evaluate: ({ updatedBaseStats }) => ({
			unlocked: updatedBaseStats.gamesWon >= 1,
			progress: Math.min(1, updatedBaseStats.gamesWon),
			target: 1,
		}),
	},
	{
		id: 'queens_reign_supreme',
		type: 'ladder',
		tier: 'gold',
		metric: 'total_wins',
		thresholds: {
			bronze: 5,
			silver: 25,
			gold: 100,
		},
		titleKey: 'medals.queens.reign_supreme.title',
		descriptionKey: 'medals.queens.reign_supreme.desc',
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
		id: 'queens_coronation_tour',
		type: 'ladder',
		tier: 'gold',
		thresholds: {
			bronze: 25,
			silver: 25,
			gold: 50,
		},
		titleKey: 'medals.queens.coronation_tour.title',
		descriptionKey: 'medals.queens.coronation_tour.desc',
		icon: 'trophy-gold',
		evaluate: ({ updatedCustomStats }) => {
			const completed = new Set(updatedCustomStats.completedPresetIds ?? []);
			const easyCount = EASY_PRESETS.filter((id) => completed.has(id)).length;
			const mediumCount = MEDIUM_PRESETS.filter((id) => completed.has(id)).length;
			const hardAndExpertCount = HARD_AND_EXPERT_PRESETS.filter((id) => completed.has(id)).length;

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
		id: 'queens_succession_streak',
		type: 'ladder',
		tier: 'gold',
		metric: 'win_streak',
		thresholds: {
			bronze: 3,
			silver: 5,
			gold: 10,
		},
		titleKey: 'medals.queens.succession_streak.title',
		descriptionKey: 'medals.queens.succession_streak.desc',
		icon: 'trophy-gold',
		evaluate: ({ priorState, updatedBaseStats, updatedCustomStats }) => {
			const prior = priorState.medalProgress.queens_succession_streak;
			const bronze = Boolean(
				prior?.bronzeUnlocked || updatedBaseStats.bestStreak >= 3 || updatedBaseStats.currentStreak >= 3,
			);
			const silver = Boolean(
				prior?.silverUnlocked ||
					(updatedCustomStats.bestMediumStreak ?? 0) >= 5 ||
					(updatedCustomStats.currentMediumStreak ?? 0) >= 5,
			);
			const gold = Boolean(
				prior?.goldUnlocked ||
					(updatedCustomStats.bestHardStreak ?? 0) >= 10 ||
					(updatedCustomStats.currentHardStreak ?? 0) >= 10,
			);

			const displayStreak = Math.max(
				updatedBaseStats.currentStreak,
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
		id: 'queens_speed_easy',
		type: 'standalone',
		tier: 'silver',
		titleKey: 'medals.queens.speed_easy.title',
		descriptionKey: 'medals.queens.speed_easy.desc',
		icon: 'trophy-silver',
		evaluate: ({ result }) => {
			const isSize6 =
				result.sizeKey === '6x6' || result.levelKey === 'easy' || result.roundContext?.size === '6x6';
			return {
				unlocked: Boolean(result.won && isSize6 && result.playTimeSeconds > 0 && result.playTimeSeconds <= 20),
			};
		},
	},
	{
		id: 'queens_speed_expert',
		type: 'standalone',
		tier: 'gold',
		titleKey: 'medals.queens.speed_expert.title',
		descriptionKey: 'medals.queens.speed_expert.desc',
		icon: 'trophy-gold',
		evaluate: ({ result }) => {
			const isSize12 =
				result.sizeKey === '12x12' || result.levelKey === 'expert' || result.roundContext?.size === '12x12';
			return {
				unlocked: Boolean(
					result.won && isSize12 && result.playTimeSeconds > 0 && result.playTimeSeconds <= 120,
				),
			};
		},
	},
	{
		id: 'queens_blind_faith',
		type: 'standalone',
		tier: 'silver',
		titleKey: 'medals.queens.blind_faith.title',
		descriptionKey: 'medals.queens.blind_faith.desc',
		icon: 'trophy-silver',
		evaluate: ({ result }) => {
			const size = result.sizeKey ?? (result.roundContext?.size as string | undefined);
			const isEligible =
				size === '8x8' ||
				size === '10x10' ||
				size === '12x12' ||
				result.levelKey === 'medium' ||
				result.levelKey === 'hard' ||
				result.levelKey === 'expert';
			const xMarkers = (result.roundContext?.xMarkersPlaced as number | undefined) ?? 0;
			return {
				unlocked: Boolean(result.won && isEligible && xMarkers === 0),
			};
		},
	},
	{
		id: 'queens_coup_detat',
		type: 'standalone',
		tier: 'gold',
		titleKey: 'medals.queens.coup_detat.title',
		descriptionKey: 'medals.queens.coup_detat.desc',
		icon: 'star',
		evaluate: ({ result }) => {
			const size = result.sizeKey ?? (result.roundContext?.size as string | undefined);
			const isEligible =
				size === '10x10' || size === '12x12' || result.levelKey === 'hard' || result.levelKey === 'expert';
			const collisions = (result.roundContext?.crownCollisionsTriggered as number | undefined) ?? 0;
			const removed = (result.roundContext?.crownsRemovedCount as number | undefined) ?? 0;
			return {
				unlocked: Boolean(result.won && isEligible && collisions === 0 && removed === 0),
			};
		},
	},
	{
		id: 'queens_college_try',
		type: 'standalone',
		tier: 'bronze',
		target: 1,
		titleKey: 'medals.queens.college_try.title',
		descriptionKey: 'medals.queens.college_try.desc',
		icon: 'trophy-bronze',
		evaluate: ({ result, updatedBaseStats }) => {
			const losses = updatedBaseStats.gamesPlayed - updatedBaseStats.gamesWon;
			return {
				unlocked: Boolean(!result.won && losses === 1),
			};
		},
	},
	{
		id: 'queens_civil_war',
		type: 'standalone',
		tier: 'bronze',
		target: 1,
		titleKey: 'medals.queens.civil_war.title',
		descriptionKey: 'medals.queens.civil_war.desc',
		icon: 'trophy-bronze',
		evaluate: ({ result }) => {
			const collisions = (result.roundContext?.crownCollisionsTriggered as number | undefined) ?? 0;
			return {
				unlocked: collisions >= 1,
			};
		},
	},
	{
		id: 'queens_abdication',
		type: 'standalone',
		tier: 'bronze',
		titleKey: 'medals.queens.abdication.title',
		descriptionKey: 'medals.queens.abdication.desc',
		icon: 'trophy-bronze',
		evaluate: ({ result }) => {
			const sizeStr = result.sizeKey ?? (result.roundContext?.size as string | undefined) ?? '';
			const parsedSize = Number.parseInt(sizeStr.split('x')[0], 10);
			const gridSize =
				(result.roundContext?.gridSize as number | undefined) ||
				(!Number.isNaN(parsedSize) && parsedSize > 0 ? parsedSize : 0);
			const crownsPlaced = (result.roundContext?.crownsPlacedBeforeSurrender as number | undefined) ?? 0;
			const threshold = gridSize > 0 ? Math.floor(gridSize / 2) : 1;
			return {
				unlocked: Boolean(!result.won && crownsPlaced >= threshold),
			};
		},
	},
	{
		id: 'queens_paranoid_monarch',
		type: 'standalone',
		tier: 'bronze',
		titleKey: 'medals.queens.paranoid_monarch.title',
		descriptionKey: 'medals.queens.paranoid_monarch.desc',
		icon: 'trophy-bronze',
		evaluate: ({ result }) => {
			const sizeStr = result.sizeKey ?? (result.roundContext?.size as string | undefined) ?? '';
			const parsedSize = Number.parseInt(sizeStr.split('x')[0], 10);
			const gridSize =
				(result.roundContext?.gridSize as number | undefined) ||
				(!Number.isNaN(parsedSize) && parsedSize > 0 ? parsedSize : 0);
			const xBeforeFirst = (result.roundContext?.xMarkersBeforeFirstCrown as number | undefined) ?? 0;
			const threshold = gridSize > 0 ? Math.floor(gridSize * gridSize * 0.8) : 0;
			return {
				unlocked: Boolean(gridSize > 0 && xBeforeFirst >= threshold),
			};
		},
	},
	{
		id: 'queens_royal_indecision',
		type: 'standalone',
		tier: 'bronze',
		target: 4,
		titleKey: 'medals.queens.royal_indecision.title',
		descriptionKey: 'medals.queens.royal_indecision.desc',
		icon: 'trophy-bronze',
		evaluate: ({ result }) => {
			const toggles = (result.roundContext?.maxSameCellCrownToggles as number | undefined) ?? 0;
			return {
				unlocked: toggles >= 4,
				progress: Math.min(4, toggles),
				target: 4,
			};
		},
	},
];

export default QUEENS_MEDAL_DEFINITIONS;
