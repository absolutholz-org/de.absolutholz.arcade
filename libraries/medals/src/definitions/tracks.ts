import type { AchievementDefinition, MedalTier } from '../types/index.js';

const EASY_PRESETS = Array.from({ length: 15 }, (_, i) => `easy-${i + 1}`);
const MEDIUM_PRESETS = Array.from({ length: 15 }, (_, i) => `medium-${i + 1}`);
const HARD_PRESETS = Array.from({ length: 15 }, (_, i) => `hard-${i + 1}`);
const EXPERT_PRESETS = Array.from({ length: 15 }, (_, i) => `expert-${i + 1}`);
const MEDIUM_AND_HARD_PRESETS = [...MEDIUM_PRESETS, ...HARD_PRESETS];

export const TRACKS_MEDAL_DEFINITIONS: readonly AchievementDefinition<'tracks'>[] = [
	{
		id: 'tracks_first_departure',
		type: 'standalone',
		tier: 'bronze',
		titleKey: 'medals.tracks.first_departure.title',
		descriptionKey: 'medals.tracks.first_departure.desc',
		icon: 'trophy-bronze',
		evaluate: ({ updatedBaseStats }) => ({
			unlocked: updatedBaseStats.gamesWon >= 1,
			progress: Math.min(1, updatedBaseStats.gamesWon),
			target: 1,
		}),
	},
	{
		id: 'tracks_transcontinental',
		type: 'ladder',
		tier: 'gold',
		metric: 'total_wins',
		thresholds: {
			bronze: 5,
			silver: 25,
			gold: 100,
		},
		titleKey: 'medals.tracks.transcontinental.title',
		descriptionKey: 'medals.tracks.transcontinental.desc',
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
		id: 'tracks_grand_line',
		type: 'ladder',
		tier: 'gold',
		thresholds: {
			bronze: 15,
			silver: 30,
			gold: 15,
		},
		titleKey: 'medals.tracks.grand_line.title',
		descriptionKey: 'medals.tracks.grand_line.desc',
		icon: 'trophy-gold',
		evaluate: ({ updatedCustomStats }) => {
			const completed = new Set(updatedCustomStats.completedPresetIds ?? []);
			const easyCount = EASY_PRESETS.filter((id) => completed.has(id)).length;
			const mediumAndHardCount = MEDIUM_AND_HARD_PRESETS.filter((id) => completed.has(id)).length;
			const expertCount = EXPERT_PRESETS.filter((id) => completed.has(id)).length;

			const bronze = easyCount >= 15;
			const silver = bronze && mediumAndHardCount >= 30;
			const gold = silver && expertCount >= 15;

			let currentTier: MedalTier | null = null;
			let currentProgress = easyCount;
			let nextThreshold: number | null = 15;

			if (gold) {
				currentTier = 'gold';
				currentProgress = 15;
				nextThreshold = null;
			} else if (silver) {
				currentTier = 'silver';
				currentProgress = expertCount;
				nextThreshold = 15;
			} else if (bronze) {
				currentTier = 'bronze';
				currentProgress = mediumAndHardCount;
				nextThreshold = 30;
			} else {
				currentTier = null;
				currentProgress = easyCount;
				nextThreshold = 15;
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
		id: 'tracks_express_service',
		type: 'ladder',
		tier: 'gold',
		metric: 'win_streak',
		thresholds: {
			bronze: 3,
			silver: 5,
			gold: 10,
		},
		titleKey: 'medals.tracks.express_service.title',
		descriptionKey: 'medals.tracks.express_service.desc',
		icon: 'trophy-gold',
		evaluate: ({ priorState, updatedBaseStats, updatedCustomStats }) => {
			const prior = priorState.medalProgress.tracks_express_service;
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
		id: 'tracks_bullet_train',
		type: 'standalone',
		tier: 'silver',
		titleKey: 'medals.tracks.bullet_train.title',
		descriptionKey: 'medals.tracks.bullet_train.desc',
		icon: 'trophy-silver',
		evaluate: ({ result }) => {
			const isSize6 =
				result.sizeKey === '6x6' || result.levelKey === 'easy' || result.roundContext?.size === '6x6';
			return {
				unlocked: Boolean(result.won && isSize6 && result.playTimeSeconds > 0 && result.playTimeSeconds <= 30),
			};
		},
	},
	{
		id: 'tracks_trans_siberian',
		type: 'standalone',
		tier: 'gold',
		titleKey: 'medals.tracks.trans_siberian.title',
		descriptionKey: 'medals.tracks.trans_siberian.desc',
		icon: 'trophy-gold',
		evaluate: ({ result }) => {
			const isSize10 =
				result.sizeKey === '10x10' || result.levelKey === 'expert' || result.roundContext?.size === '10x10';
			return {
				unlocked: Boolean(
					result.won && isSize10 && result.playTimeSeconds > 0 && result.playTimeSeconds <= 180,
				),
			};
		},
	},
	{
		id: 'tracks_direct_line',
		type: 'standalone',
		tier: 'silver',
		titleKey: 'medals.tracks.direct_line.title',
		descriptionKey: 'medals.tracks.direct_line.desc',
		icon: 'trophy-silver',
		evaluate: ({ result }) => {
			const size = result.sizeKey ?? (result.roundContext?.size as string | undefined);
			const isEligible =
				size === '8x8' ||
				size === '10x10' ||
				result.levelKey === 'medium' ||
				result.levelKey === 'hard' ||
				result.levelKey === 'expert';
			const crossMarkers = (result.roundContext?.crossMarkersPlaced as number | undefined) ?? 0;
			return {
				unlocked: Boolean(result.won && isEligible && crossMarkers === 0),
			};
		},
	},
	{
		id: 'tracks_smooth_rail',
		type: 'standalone',
		tier: 'gold',
		titleKey: 'medals.tracks.smooth_rail.title',
		descriptionKey: 'medals.tracks.smooth_rail.desc',
		icon: 'trophy-gold',
		evaluate: ({ result }) => {
			const size = result.sizeKey ?? (result.roundContext?.size as string | undefined);
			const isEligible =
				size === '8x8' ||
				size === '10x10' ||
				result.levelKey === 'medium' ||
				result.levelKey === 'hard' ||
				result.levelKey === 'expert';
			const erased = (result.roundContext?.tracksErasedCount as number | undefined) ?? 0;
			return {
				unlocked: Boolean(result.won && isEligible && erased === 0),
			};
		},
	},
	{
		id: 'tracks_college_try',
		type: 'standalone',
		tier: 'bronze',
		titleKey: 'medals.tracks.college_try.title',
		descriptionKey: 'medals.tracks.college_try.desc',
		icon: 'trophy-bronze',
		evaluate: ({ result, updatedBaseStats }) => {
			const losses = updatedBaseStats.gamesPlayed - updatedBaseStats.gamesWon;
			return {
				unlocked: Boolean(!result.won && losses === 1),
			};
		},
	},
	{
		id: 'tracks_derailment',
		type: 'standalone',
		tier: 'bronze',
		titleKey: 'medals.tracks.derailment.title',
		descriptionKey: 'medals.tracks.derailment.desc',
		icon: 'trophy-bronze',
		evaluate: ({ result }) => {
			const collisions = (result.roundContext?.wallCollisionsCount as number | undefined) ?? 0;
			return {
				unlocked: collisions >= 1,
			};
		},
	},
	{
		id: 'tracks_infinite_loop',
		type: 'standalone',
		tier: 'bronze',
		titleKey: 'medals.tracks.infinite_loop.title',
		descriptionKey: 'medals.tracks.infinite_loop.desc',
		icon: 'trophy-bronze',
		evaluate: ({ result }) => {
			const loop = Boolean(result.roundContext?.closedLoopCreated);
			return {
				unlocked: loop,
			};
		},
	},
	{
		id: 'tracks_wrong_way',
		type: 'standalone',
		tier: 'bronze',
		titleKey: 'medals.tracks.wrong_way.title',
		descriptionKey: 'medals.tracks.wrong_way.desc',
		icon: 'trophy-bronze',
		evaluate: ({ result }) => {
			const startedFromExit = Boolean(result.roundContext?.startedFromExit);
			return {
				unlocked: startedFromExit,
			};
		},
	},
	{
		id: 'tracks_signal_failure',
		type: 'standalone',
		tier: 'bronze',
		titleKey: 'medals.tracks.signal_failure.title',
		descriptionKey: 'medals.tracks.signal_failure.desc',
		icon: 'trophy-bronze',
		evaluate: ({ result }) => {
			const violations = (result.roundContext?.maxSimultaneousRowColumnViolations as number | undefined) ?? 0;
			return {
				unlocked: violations >= 3,
			};
		},
	},
	{
		id: 'tracks_indecisive_conductor',
		type: 'standalone',
		tier: 'bronze',
		titleKey: 'medals.tracks.indecisive_conductor.title',
		descriptionKey: 'medals.tracks.indecisive_conductor.desc',
		icon: 'trophy-bronze',
		evaluate: ({ result }) => {
			const changes = (result.roundContext?.maxSameCellTrackChanges as number | undefined) ?? 0;
			return {
				unlocked: changes >= 5,
				progress: Math.min(5, changes),
				target: 5,
			};
		},
	},
];
