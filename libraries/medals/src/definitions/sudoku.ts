import type { AchievementDefinition, MedalTier } from '../types/index.js';

const EASY_PRESETS = ['easy-1', 'easy-2', 'easy-3', 'easy-4', 'easy-5', 'easy-6'] as const;
const MEDIUM_PRESETS = ['medium-1', 'medium-2', 'medium-3', 'medium-4', 'medium-5', 'medium-6'] as const;
const HARD_PRESETS = ['hard-1', 'hard-2', 'hard-3', 'hard-4', 'hard-5', 'hard-6'] as const;
const VERY_HARD_PRESETS = ['veryHard-1', 'veryHard-2', 'veryHard-3', 'veryHard-4', 'veryHard-5', 'veryHard-6'] as const;

function getDifficultyFromResult(result: { levelKey?: string; roundContext?: Record<string, unknown> }):
	| string
	| undefined {
	return (result.roundContext?.difficulty ?? result.roundContext?.originalDifficulty ?? result.levelKey) as
		| string
		| undefined;
}

export const SUDOKU_MEDAL_DEFINITIONS: readonly AchievementDefinition<'sudoku'>[] = [
	{
		id: 'sudoku_first_victory',
		type: 'standalone',
		tier: 'bronze',
		titleKey: 'medals.sudoku.first_victory.title',
		descriptionKey: 'medals.sudoku.first_victory.desc',
		icon: 'trophy-bronze',
		evaluate: ({ updatedBaseStats }) => ({
			unlocked: updatedBaseStats.gamesWon >= 1,
			progress: Math.min(1, updatedBaseStats.gamesWon),
			target: 1,
		}),
	},
	{
		id: 'sudoku_streak',
		type: 'ladder',
		tier: 'gold',
		metric: 'win_streak',
		thresholds: {
			bronze: 3,
			silver: 5,
			gold: 10,
		},
		titleKey: 'medals.sudoku.streak.title',
		descriptionKey: 'medals.sudoku.streak.desc',
		icon: 'trophy-gold',
		evaluate: ({ updatedBaseStats }) => {
			const streak = updatedBaseStats.bestStreak;
			let currentTier: MedalTier | null = null;
			let nextThreshold: number | null = 3;

			if (streak >= 10) {
				currentTier = 'gold';
				nextThreshold = null;
			} else if (streak >= 5) {
				currentTier = 'silver';
				nextThreshold = 10;
			} else if (streak >= 3) {
				currentTier = 'bronze';
				nextThreshold = 5;
			}

			return {
				currentProgress: streak,
				currentTier,
				nextThreshold,
				bronzeUnlocked: streak >= 3,
				silverUnlocked: streak >= 5,
				goldUnlocked: streak >= 10,
			};
		},
	},
	{
		id: 'sudoku_campaign_foundations',
		type: 'ladder',
		tier: 'gold',
		thresholds: {
			bronze: 6,
			silver: 6,
			gold: 12,
		},
		titleKey: 'medals.sudoku.campaign_foundations.title',
		descriptionKey: 'medals.sudoku.campaign_foundations.desc',
		icon: 'trophy-gold',
		evaluate: ({ updatedCustomStats }) => {
			const completed = new Set(updatedCustomStats.completedPresetIds ?? []);
			const withoutHints = new Set(updatedCustomStats.completedPresetsWithoutHints ?? []);

			const easyCount = EASY_PRESETS.filter((id) => completed.has(id)).length;
			const mediumCount = MEDIUM_PRESETS.filter((id) => completed.has(id)).length;
			const all12Count = [...EASY_PRESETS, ...MEDIUM_PRESETS].filter((id) => withoutHints.has(id)).length;

			const bronze = easyCount >= 6;
			const silver = mediumCount >= 6;
			const gold = all12Count >= 12;

			let currentTier: MedalTier | null = null;
			let currentProgress = easyCount;
			let nextThreshold: number | null = 6;

			if (bronze && silver && gold) {
				currentTier = 'gold';
				currentProgress = 12;
				nextThreshold = null;
			} else if (bronze && silver) {
				currentTier = 'silver';
				currentProgress = all12Count;
				nextThreshold = 12;
			} else if (bronze) {
				currentTier = 'bronze';
				currentProgress = mediumCount;
				nextThreshold = 6;
			} else {
				currentTier = null;
				currentProgress = easyCount;
				nextThreshold = 6;
			}

			return {
				currentProgress,
				currentTier,
				nextThreshold,
				bronzeUnlocked: bronze,
				silverUnlocked: bronze && silver,
				goldUnlocked: bronze && silver && gold,
			};
		},
	},
	{
		id: 'sudoku_campaign_gauntlet',
		type: 'ladder',
		tier: 'gold',
		thresholds: {
			bronze: 3,
			silver: 6,
			gold: 6,
		},
		titleKey: 'medals.sudoku.campaign_gauntlet.title',
		descriptionKey: 'medals.sudoku.campaign_gauntlet.desc',
		icon: 'trophy-gold',
		evaluate: ({ updatedCustomStats }) => {
			const completed = new Set(updatedCustomStats.completedPresetIds ?? []);
			const hardCount = HARD_PRESETS.filter((id) => completed.has(id)).length;
			const veryHardCount = VERY_HARD_PRESETS.filter((id) => completed.has(id)).length;

			const bronze = hardCount >= 3;
			const silver = hardCount >= 6;
			const gold = veryHardCount >= 6;

			let currentTier: MedalTier | null = null;
			let currentProgress = hardCount;
			let nextThreshold: number | null = 3;

			if (silver && gold) {
				currentTier = 'gold';
				currentProgress = 6;
				nextThreshold = null;
			} else if (silver) {
				currentTier = 'silver';
				currentProgress = veryHardCount;
				nextThreshold = 6;
			} else if (bronze) {
				currentTier = 'bronze';
				currentProgress = hardCount;
				nextThreshold = 6;
			} else {
				currentTier = null;
				currentProgress = hardCount;
				nextThreshold = 3;
			}

			return {
				currentProgress,
				currentTier,
				nextThreshold,
				bronzeUnlocked: bronze,
				silverUnlocked: silver,
				goldUnlocked: silver && gold,
			};
		},
	},
	{
		id: 'sudoku_speed_demon',
		type: 'standalone',
		tier: 'gold',
		titleKey: 'medals.sudoku.speed_demon.title',
		descriptionKey: 'medals.sudoku.speed_demon.desc',
		icon: 'sparkles',
		evaluate: ({ result }) => {
			const diff = getDifficultyFromResult(result);
			const eligibleDifficulties = ['medium', 'hard', 'veryHard', 'insane', 'inhuman'];
			const isEligible = diff !== undefined && eligibleDifficulties.includes(diff);
			return {
				unlocked: Boolean(
					result.won && result.playTimeSeconds > 0 && result.playTimeSeconds <= 180 && isEligible,
				),
			};
		},
	},
	{
		id: 'sudoku_flawless_logic',
		type: 'standalone',
		tier: 'gold',
		titleKey: 'medals.sudoku.flawless_logic.title',
		descriptionKey: 'medals.sudoku.flawless_logic.desc',
		icon: 'star',
		evaluate: ({ result }) => {
			const diff = getDifficultyFromResult(result);
			const eligibleDifficulties = ['hard', 'veryHard', 'insane', 'inhuman'];
			const isEligible = diff !== undefined && eligibleDifficulties.includes(diff);
			const mistakes = (result.roundContext?.mistakesCount ?? result.roundContext?.errorsCount) as
				| number
				| undefined;
			const hints = result.roundContext?.hintsUsed as number | undefined;

			return {
				unlocked: Boolean(result.won && mistakes === 0 && (hints === 0 || hints === undefined) && isEligible),
			};
		},
	},
	{
		id: 'sudoku_beyond_mortal',
		type: 'standalone',
		tier: 'gold',
		titleKey: 'medals.sudoku.beyond_mortal.title',
		descriptionKey: 'medals.sudoku.beyond_mortal.desc',
		icon: 'trophy-gold',
		evaluate: ({ result }) => {
			const diff = getDifficultyFromResult(result);
			const eligibleDifficulties = ['insane', 'inhuman'];
			const isEligible = diff !== undefined && eligibleDifficulties.includes(diff);

			return {
				unlocked: Boolean(result.won && isEligible),
			};
		},
	},
	{
		id: 'sudoku_living_on_edge',
		type: 'standalone',
		tier: 'silver',
		titleKey: 'medals.sudoku.living_on_edge.title',
		descriptionKey: 'medals.sudoku.living_on_edge.desc',
		icon: 'trophy-silver',
		evaluate: ({ result }) => {
			const mistakes = (result.roundContext?.mistakesCount ?? result.roundContext?.errorsCount) as
				| number
				| undefined;
			return {
				unlocked: Boolean(result.won && mistakes === 2),
			};
		},
	},
	{
		id: 'sudoku_participation',
		type: 'standalone',
		tier: 'bronze',
		titleKey: 'medals.sudoku.participation.title',
		descriptionKey: 'medals.sudoku.participation.desc',
		icon: 'trophy-bronze',
		evaluate: ({ result, updatedBaseStats }) => ({
			unlocked: Boolean(result.won && updatedBaseStats.gamesWon >= 1),
			progress: Math.min(1, updatedBaseStats.gamesWon),
			target: 1,
		}),
	},
	{
		id: 'sudoku_old_college_try',
		type: 'standalone',
		tier: 'bronze',
		titleKey: 'medals.sudoku.old_college_try.title',
		descriptionKey: 'medals.sudoku.old_college_try.desc',
		icon: 'trophy-bronze',
		evaluate: ({ result, updatedBaseStats }) => {
			const losses = updatedBaseStats.gamesPlayed - updatedBaseStats.gamesWon;
			return {
				unlocked: Boolean(!result.won && losses === 1),
			};
		},
	},
	{
		id: 'sudoku_speedrun_failure',
		type: 'standalone',
		tier: 'bronze',
		titleKey: 'medals.sudoku.speedrun_failure.title',
		descriptionKey: 'medals.sudoku.speedrun_failure.desc',
		icon: 'trophy-bronze',
		evaluate: ({ result }) => ({
			unlocked: Boolean(!result.won && result.playTimeSeconds > 0 && result.playTimeSeconds <= 20),
		}),
	},
	{
		id: 'sudoku_analysis_paralysis',
		type: 'standalone',
		tier: 'bronze',
		titleKey: 'medals.sudoku.analysis_paralysis.title',
		descriptionKey: 'medals.sudoku.analysis_paralysis.desc',
		icon: 'trophy-bronze',
		evaluate: ({ result }) => {
			const diff = getDifficultyFromResult(result);
			return {
				unlocked: Boolean(result.won && diff === 'easy' && result.playTimeSeconds > 1200),
			};
		},
	},
	{
		id: 'sudoku_are_you_sure',
		type: 'standalone',
		tier: 'bronze',
		titleKey: 'medals.sudoku.are_you_sure.title',
		descriptionKey: 'medals.sudoku.are_you_sure.desc',
		icon: 'trophy-bronze',
		evaluate: ({ result }) => {
			const consecutiveUndos = (result.roundContext?.consecutiveUndosMax as number) ?? 0;
			return {
				unlocked: consecutiveUndos >= 10,
				progress: Math.min(10, consecutiveUndos),
				target: 10,
			};
		},
	},
	{
		id: 'sudoku_living_on_prayer',
		type: 'standalone',
		tier: 'silver',
		titleKey: 'medals.sudoku.living_on_prayer.title',
		descriptionKey: 'medals.sudoku.living_on_prayer.desc',
		icon: 'trophy-silver',
		evaluate: ({ result }) => {
			const mistakes = (result.roundContext?.mistakesCount ?? result.roundContext?.errorsCount) as
				| number
				| undefined;
			const secondMistakeTime = result.roundContext?.secondMistakeTimeSeconds as number | null | undefined;
			return {
				unlocked: Boolean(
					result.won &&
						mistakes === 2 &&
						secondMistakeTime !== null &&
						secondMistakeTime !== undefined &&
						secondMistakeTime <= 60,
				),
			};
		},
	},
	{
		id: 'sudoku_pencil_pusher',
		type: 'standalone',
		tier: 'silver',
		titleKey: 'medals.sudoku.pencil_pusher.title',
		descriptionKey: 'medals.sudoku.pencil_pusher.desc',
		icon: 'trophy-silver',
		evaluate: ({ result }) => {
			const notesCount = (result.roundContext?.notesPlacedBeforeFirstDigit as number) ?? 0;
			return {
				unlocked: notesCount >= 60,
				progress: Math.min(60, notesCount),
				target: 60,
			};
		},
	},
	{
		id: 'sudoku_surgical_precision',
		type: 'standalone',
		tier: 'gold',
		titleKey: 'medals.sudoku.surgical_precision.title',
		descriptionKey: 'medals.sudoku.surgical_precision.desc',
		icon: 'star',
		evaluate: ({ result }) => {
			const diff = getDifficultyFromResult(result);
			const eligibleDifficulties = ['hard', 'veryHard', 'insane', 'inhuman'];
			const isEligible = diff !== undefined && eligibleDifficulties.includes(diff);
			const mistakes = (result.roundContext?.mistakesCount ?? result.roundContext?.errorsCount) as
				| number
				| undefined;
			const hints = (result.roundContext?.hintsUsed as number) ?? 0;
			const totalNotes = (result.roundContext?.totalNotesPlaced as number) ?? 0;

			return {
				unlocked: Boolean(
					result.won &&
						isEligible &&
						hints === 0 &&
						(mistakes === 0 || mistakes === undefined) &&
						totalNotes === 0,
				),
			};
		},
	},
	{
		id: 'sudoku_insomnia',
		type: 'standalone',
		tier: 'bronze',
		titleKey: 'medals.sudoku.insomnia.title',
		descriptionKey: 'medals.sudoku.insomnia.desc',
		icon: 'trophy-bronze',
		evaluate: ({ result }) => {
			const hour =
				typeof result.roundContext?.localHour === 'number'
					? result.roundContext.localHour
					: new Date().getHours();
			return {
				unlocked: Boolean(result.won && hour >= 2 && hour < 4),
			};
		},
	},
];
