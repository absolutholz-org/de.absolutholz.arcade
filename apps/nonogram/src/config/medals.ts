import type { AchievementDefinition, MedalTier } from '@arcade/lib-medals';

function getSizeFromResult(result: {
	sizeKey?: string;
	roundContext?: Record<string, unknown>;
	levelKey?: string;
}): string | undefined {
	return (result.roundContext?.size ?? result.sizeKey) as string | undefined;
}

function getDifficultyFromResult(result: {
	levelKey?: string;
	roundContext?: Record<string, unknown>;
}): string | undefined {
	return (result.roundContext?.difficulty ?? result.levelKey) as string | undefined;
}

export const NONOGRAM_MEDAL_DEFINITIONS: readonly AchievementDefinition<'nonogram'>[] = [
	{
		id: 'nonogram_first_brushstroke',
		type: 'standalone',
		tier: 'bronze',
		target: 1,
		titleKey: 'medals.nonogram.first_brushstroke.title',
		descriptionKey: 'medals.nonogram.first_brushstroke.desc',
		icon: 'trophy-bronze',
		evaluate: ({ updatedBaseStats }) => ({
			unlocked: updatedBaseStats.gamesWon >= 1,
			progress: Math.min(1, updatedBaseStats.gamesWon),
			target: 1,
		}),
	},
	{
		id: 'nonogram_gallery',
		type: 'ladder',
		tier: 'gold',
		thresholds: {
			bronze: 10,
			silver: 10,
			gold: 20,
		},
		titleKey: 'medals.nonogram.gallery.title',
		descriptionKey: 'medals.nonogram.gallery.desc',
		icon: 'trophy-gold',
		evaluate: ({ updatedCustomStats }) => {
			const puzzles = updatedCustomStats.puzzles ?? {};
			const easyIds = new Set([
				...(updatedCustomStats.completedEasyPuzzles ?? []),
				...Object.entries(puzzles)
					.filter(
						([id, p]) =>
							p.completed && (id.startsWith('easy-') || p.difficulty === 'easy' || p.size === '5x5'),
					)
					.map(([id]) => id),
			]);
			const mediumIds = new Set([
				...(updatedCustomStats.completedMediumPuzzles ?? []),
				...Object.entries(puzzles)
					.filter(
						([id, p]) =>
							p.completed &&
							(id.startsWith('medium-') ||
								id.startsWith('med-') ||
								p.difficulty === 'medium' ||
								p.size === '10x10'),
					)
					.map(([id]) => id),
			]);
			const hardIds = new Set([
				...(updatedCustomStats.completedHardPuzzles ?? []),
				...Object.entries(puzzles)
					.filter(
						([id, p]) =>
							p.completed && (id.startsWith('hard-') || p.difficulty === 'hard' || p.size === '15x15'),
					)
					.map(([id]) => id),
			]);

			const easyCount = easyIds.size;
			const mediumCount = mediumIds.size;
			const hardCount = hardIds.size;

			const bronze = easyCount >= 10;
			const silver = mediumCount >= 10;
			const gold = hardCount >= 20;

			let currentTier: MedalTier | null = null;
			let currentProgress = easyCount;
			let nextThreshold: number | null = 10;

			if (bronze && silver && gold) {
				currentTier = 'gold';
				currentProgress = 20;
				nextThreshold = null;
			} else if (bronze && silver) {
				currentTier = 'silver';
				currentProgress = hardCount;
				nextThreshold = 20;
			} else if (bronze) {
				currentTier = 'bronze';
				currentProgress = mediumCount;
				nextThreshold = 10;
			} else {
				currentTier = null;
				currentProgress = easyCount;
				nextThreshold = 10;
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
		id: 'nonogram_artist',
		type: 'ladder',
		tier: 'gold',
		metric: 'total_wins',
		thresholds: {
			bronze: 5,
			silver: 25,
			gold: 50,
		},
		titleKey: 'medals.nonogram.artist.title',
		descriptionKey: 'medals.nonogram.artist.desc',
		icon: 'trophy-gold',
		evaluate: ({ updatedBaseStats }) => {
			const wins = updatedBaseStats.gamesWon;
			let currentTier: MedalTier | null = null;
			let nextThreshold: number | null = 5;

			if (wins >= 50) {
				currentTier = 'gold';
				nextThreshold = null;
			} else if (wins >= 25) {
				currentTier = 'silver';
				nextThreshold = 50;
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
				goldUnlocked: wins >= 50,
			};
		},
	},
	{
		id: 'nonogram_streak',
		type: 'ladder',
		tier: 'gold',
		metric: 'win_streak',
		thresholds: {
			bronze: 3,
			silver: 5,
			gold: 10,
		},
		titleKey: 'medals.nonogram.streak.title',
		descriptionKey: 'medals.nonogram.streak.desc',
		icon: 'trophy-gold',
		evaluate: ({ priorState, updatedBaseStats, updatedCustomStats }) => {
			const prior = priorState.medalProgress.nonogram_streak;
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
		id: 'nonogram_speed_easy',
		type: 'standalone',
		tier: 'silver',
		titleKey: 'medals.nonogram.speed_easy.title',
		descriptionKey: 'medals.nonogram.speed_easy.desc',
		icon: 'sparkles',
		evaluate: ({ result }) => {
			const size = getSizeFromResult(result);
			const diff = getDifficultyFromResult(result);
			const isEasySize = size === '5x5' || diff === 'easy';
			return {
				unlocked: Boolean(
					result.won && isEasySize && result.playTimeSeconds > 0 && result.playTimeSeconds <= 20,
				),
			};
		},
	},
	{
		id: 'nonogram_speed_hard',
		type: 'standalone',
		tier: 'gold',
		titleKey: 'medals.nonogram.speed_hard.title',
		descriptionKey: 'medals.nonogram.speed_hard.desc',
		icon: 'trophy-gold',
		evaluate: ({ result }) => {
			const size = getSizeFromResult(result);
			const diff = getDifficultyFromResult(result);
			const isHardSize = size === '15x15' || diff === 'hard';
			return {
				unlocked: Boolean(
					result.won && isHardSize && result.playTimeSeconds > 0 && result.playTimeSeconds <= 180,
				),
			};
		},
	},
	{
		id: 'nonogram_direct_painter',
		type: 'standalone',
		tier: 'silver',
		titleKey: 'medals.nonogram.direct_painter.title',
		descriptionKey: 'medals.nonogram.direct_painter.desc',
		icon: 'trophy-silver',
		evaluate: ({ result }) => {
			const size = getSizeFromResult(result);
			const diff = getDifficultyFromResult(result);
			const isEligibleSize = size === '10x10' || size === '15x15' || diff === 'medium' || diff === 'hard';
			const crosses = (result.roundContext?.crossesPlaced as number | undefined) ?? 0;
			return {
				unlocked: Boolean(result.won && isEligibleSize && crosses === 0),
			};
		},
	},
	{
		id: 'nonogram_flawless_canvas',
		type: 'standalone',
		tier: 'gold',
		titleKey: 'medals.nonogram.flawless_canvas.title',
		descriptionKey: 'medals.nonogram.flawless_canvas.desc',
		icon: 'star',
		evaluate: ({ result }) => {
			const size = getSizeFromResult(result);
			const diff = getDifficultyFromResult(result);
			const isHardSize = size === '15x15' || diff === 'hard';
			const mistakes =
				(result.roundContext?.mistakesCount as number | undefined) ??
				(result.roundContext?.errorsCount as number | undefined) ??
				0;
			const hints = (result.roundContext?.hintsUsed as number | undefined) ?? 0;
			return {
				unlocked: Boolean(result.won && isHardSize && mistakes === 0 && hints === 0),
			};
		},
	},
	{
		id: 'nonogram_college_try',
		type: 'standalone',
		tier: 'bronze',
		target: 1,
		titleKey: 'medals.nonogram.college_try.title',
		descriptionKey: 'medals.nonogram.college_try.desc',
		icon: 'trophy-bronze',
		evaluate: ({ result, updatedBaseStats }) => {
			const totalLosses = updatedBaseStats.gamesPlayed - updatedBaseStats.gamesWon;
			return {
				unlocked: Boolean(!result.won && totalLosses === 1),
			};
		},
	},
	{
		id: 'nonogram_speedrun_ruin',
		type: 'standalone',
		tier: 'bronze',
		titleKey: 'medals.nonogram.speedrun_ruin.title',
		descriptionKey: 'medals.nonogram.speedrun_ruin.desc',
		icon: 'trophy-bronze',
		evaluate: ({ result }) => ({
			unlocked: Boolean(!result.won && result.playTimeSeconds > 0 && result.playTimeSeconds <= 15),
		}),
	},
	{
		id: 'nonogram_abstract',
		type: 'standalone',
		tier: 'bronze',
		titleKey: 'medals.nonogram.abstract.title',
		descriptionKey: 'medals.nonogram.abstract.desc',
		icon: 'trophy-bronze',
		evaluate: ({ result }) => {
			const ratio = (result.roundContext?.boardFillRatioOnDefeat as number | undefined) ?? 0;
			return {
				unlocked: Boolean(!result.won && ratio >= 0.75),
			};
		},
	},
	{
		id: 'nonogram_playing_safe',
		type: 'standalone',
		tier: 'bronze',
		target: 15,
		titleKey: 'medals.nonogram.playing_safe.title',
		descriptionKey: 'medals.nonogram.playing_safe.desc',
		icon: 'trophy-bronze',
		evaluate: ({ result }) => {
			const crosses = (result.roundContext?.crossesBeforeFirstFill as number | undefined) ?? 0;
			return {
				unlocked: crosses >= 15,
				progress: Math.min(15, crosses),
				target: 15,
			};
		},
	},
	{
		id: 'nonogram_indecisive',
		type: 'standalone',
		tier: 'bronze',
		target: 5,
		titleKey: 'medals.nonogram.indecisive.title',
		descriptionKey: 'medals.nonogram.indecisive.desc',
		icon: 'trophy-bronze',
		evaluate: ({ result }) => {
			const toggles = (result.roundContext?.maxSameCellToggles as number | undefined) ?? 0;
			return {
				unlocked: toggles >= 5,
				progress: Math.min(5, toggles),
				target: 5,
			};
		},
	},
];

export default NONOGRAM_MEDAL_DEFINITIONS;
