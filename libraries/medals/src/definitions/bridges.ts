import type { AchievementDefinition, MedalTier } from '../types/index.js';

const BEGINNER_PRESETS = ['b-1', 'b-2', 'b-3', 'b-4', 'b-5', 'b-6', 'b-7', 'b-8', 'b-9', 'b-10'] as const;
const EASY_PRESETS = ['e-1', 'e-2', 'e-3', 'e-4', 'e-5', 'e-6', 'e-7', 'e-8', 'e-9', 'e-10'] as const;
const MEDIUM_PRESETS = ['m-1', 'm-2', 'm-3', 'm-4', 'm-5', 'm-6', 'm-7', 'm-8', 'm-9', 'm-10'] as const;
const HARD_PRESETS = ['h-1', 'h-2', 'h-3', 'h-4', 'h-5', 'h-6', 'h-7', 'h-8', 'h-9', 'h-10'] as const;
const EXPERT_PRESETS = ['x-1', 'x-2', 'x-3', 'x-4', 'x-5', 'x-6', 'x-7', 'x-8', 'x-9', 'x-10'] as const;

export const BRIDGES_MEDAL_DEFINITIONS: readonly AchievementDefinition<'bridges'>[] = [
	{
		id: 'bridges_first_span',
		type: 'standalone',
		tier: 'bronze',
		titleKey: 'medals.bridges.first_span.title',
		descriptionKey: 'medals.bridges.first_span.desc',
		icon: 'trophy-bronze',
		evaluate: ({ updatedBaseStats }) => ({
			unlocked: updatedBaseStats.gamesWon >= 1,
			progress: Math.min(1, updatedBaseStats.gamesWon),
			target: 1,
		}),
	},
	{
		id: 'bridges_archipelago',
		type: 'ladder',
		tier: 'gold',
		thresholds: {
			bronze: 10,
			silver: 20,
			gold: 20,
		},
		titleKey: 'medals.bridges.archipelago.title',
		descriptionKey: 'medals.bridges.archipelago.desc',
		icon: 'trophy-gold',
		evaluate: ({ updatedCustomStats }) => {
			const completed = new Set(updatedCustomStats.completedPresetIds ?? []);
			const beginnerCount = BEGINNER_PRESETS.filter((id) => completed.has(id)).length;
			const easyAndMedCount = [...EASY_PRESETS, ...MEDIUM_PRESETS].filter((id) => completed.has(id)).length;
			const hardAndExpertCount = [...HARD_PRESETS, ...EXPERT_PRESETS].filter((id) => completed.has(id)).length;

			const bronze = beginnerCount >= 10;
			const silver = bronze && easyAndMedCount >= 20;
			const gold = silver && hardAndExpertCount >= 20;

			let currentTier: MedalTier | null = null;
			let currentProgress = beginnerCount;
			let nextThreshold: number | null = 10;

			if (gold) {
				currentTier = 'gold';
				currentProgress = 20;
				nextThreshold = null;
			} else if (silver) {
				currentTier = 'silver';
				currentProgress = hardAndExpertCount;
				nextThreshold = 20;
			} else if (bronze) {
				currentTier = 'bronze';
				currentProgress = easyAndMedCount;
				nextThreshold = 20;
			} else {
				currentTier = null;
				currentProgress = beginnerCount;
				nextThreshold = 10;
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
		id: 'bridges_builder',
		type: 'ladder',
		tier: 'gold',
		metric: 'total_wins',
		thresholds: {
			bronze: 5,
			silver: 25,
			gold: 100,
		},
		titleKey: 'medals.bridges.builder.title',
		descriptionKey: 'medals.bridges.builder.desc',
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
		id: 'bridges_streak',
		type: 'ladder',
		tier: 'gold',
		metric: 'win_streak',
		thresholds: {
			bronze: 3,
			silver: 5,
			gold: 10,
		},
		titleKey: 'medals.bridges.streak.title',
		descriptionKey: 'medals.bridges.streak.desc',
		icon: 'trophy-gold',
		evaluate: ({ priorState, updatedBaseStats, updatedCustomStats }) => {
			const prior = priorState.medalProgress.bridges_streak;
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
		id: 'bridges_speed_beginner',
		type: 'standalone',
		tier: 'silver',
		titleKey: 'medals.bridges.speed_beginner.title',
		descriptionKey: 'medals.bridges.speed_beginner.desc',
		icon: 'trophy-silver',
		evaluate: ({ result }) => {
			const isSize6 = result.sizeKey === '6x6' || result.levelKey === 'beginner';
			return {
				unlocked: Boolean(result.won && isSize6 && result.playTimeSeconds > 0 && result.playTimeSeconds <= 20),
			};
		},
	},
	{
		id: 'bridges_speed_expert',
		type: 'standalone',
		tier: 'gold',
		titleKey: 'medals.bridges.speed_expert.title',
		descriptionKey: 'medals.bridges.speed_expert.desc',
		icon: 'trophy-gold',
		evaluate: ({ result }) => {
			const isSize18 = result.sizeKey === '18x18' || result.levelKey === 'expert';
			return {
				unlocked: Boolean(
					result.won && isSize18 && result.playTimeSeconds > 0 && result.playTimeSeconds <= 240,
				),
			};
		},
	},
	{
		id: 'bridges_flawless_network',
		type: 'standalone',
		tier: 'gold',
		titleKey: 'medals.bridges.flawless_network.title',
		descriptionKey: 'medals.bridges.flawless_network.desc',
		icon: 'star',
		evaluate: ({ result }) => {
			const isEligible =
				result.sizeKey === '14x14' ||
				result.sizeKey === '18x18' ||
				result.levelKey === 'hard' ||
				result.levelKey === 'expert';
			const demolished = (result.roundContext?.bridgesDemolishedCount as number | undefined) ?? 0;
			const hints = (result.roundContext?.hintsUsed as number | undefined) ?? 0;

			return {
				unlocked: Boolean(result.won && isEligible && demolished === 0 && hints === 0),
			};
		},
	},
	{
		id: 'bridges_double_trouble',
		type: 'standalone',
		tier: 'bronze',
		titleKey: 'medals.bridges.double_trouble.title',
		descriptionKey: 'medals.bridges.double_trouble.desc',
		icon: 'trophy-bronze',
		evaluate: ({ result }) => ({
			unlocked: Boolean(result.won && result.roundContext?.doubleBridgesDrawnBeforeSingle === true),
		}),
	},
	{
		id: 'bridges_college_try',
		type: 'standalone',
		tier: 'bronze',
		titleKey: 'medals.bridges.college_try.title',
		descriptionKey: 'medals.bridges.college_try.desc',
		icon: 'trophy-bronze',
		evaluate: ({ result, updatedBaseStats }) => {
			const losses = updatedBaseStats.gamesPlayed - updatedBaseStats.gamesWon;
			return {
				unlocked: Boolean(!result.won && losses === 1),
			};
		},
	},
	{
		id: 'bridges_bridge_to_nowhere',
		type: 'standalone',
		tier: 'bronze',
		titleKey: 'medals.bridges.bridge_to_nowhere.title',
		descriptionKey: 'medals.bridges.bridge_to_nowhere.desc',
		icon: 'trophy-bronze',
		evaluate: ({ result }) => ({
			unlocked: Boolean(result.roundContext?.isolatedLoopCreated === true),
		}),
	},
	{
		id: 'bridges_traffic_jam',
		type: 'standalone',
		tier: 'bronze',
		titleKey: 'medals.bridges.traffic_jam.title',
		descriptionKey: 'medals.bridges.traffic_jam.desc',
		icon: 'trophy-bronze',
		evaluate: ({ result }) => {
			const attempts = (result.roundContext?.bridgeCollisionAttempts as number | undefined) ?? 0;
			return {
				unlocked: attempts >= 5,
				progress: Math.min(5, attempts),
				target: 5,
			};
		},
	},
	{
		id: 'bridges_indecisive_engineer',
		type: 'standalone',
		tier: 'bronze',
		titleKey: 'medals.bridges.indecisive_engineer.title',
		descriptionKey: 'medals.bridges.indecisive_engineer.desc',
		icon: 'trophy-bronze',
		evaluate: ({ result }) => {
			const maxToggles = (result.roundContext?.maxSameEdgeToggles as number | undefined) ?? 0;
			return {
				unlocked: maxToggles >= 6,
				progress: Math.min(6, maxToggles),
				target: 6,
			};
		},
	},
	{
		id: 'bridges_speedrun_collapse',
		type: 'standalone',
		tier: 'bronze',
		titleKey: 'medals.bridges.speedrun_collapse.title',
		descriptionKey: 'medals.bridges.speedrun_collapse.desc',
		icon: 'trophy-bronze',
		evaluate: ({ result }) => ({
			unlocked: Boolean(!result.won && result.playTimeSeconds > 0 && result.playTimeSeconds <= 10),
		}),
	},
];
