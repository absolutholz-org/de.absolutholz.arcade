import type { AchievementDefinition, MedalTier } from '@arcade/lib-medals';

export const MINESWEEPER_MEDAL_DEFINITIONS: readonly AchievementDefinition<'minesweeper'>[] = [
	{
		id: 'minesweeper_clearance_initiated',
		type: 'standalone',
		tier: 'bronze',
		target: 1,
		titleKey: 'medals.minesweeper.clearance_initiated.title',
		descriptionKey: 'medals.minesweeper.clearance_initiated.desc',
		icon: 'trophy-bronze',
		evaluate: ({ updatedBaseStats }) => ({
			unlocked: updatedBaseStats.gamesWon >= 1,
			progress: Math.min(1, updatedBaseStats.gamesWon),
			target: 1,
		}),
	},
	{
		id: 'minesweeper_veteran',
		type: 'ladder',
		tier: 'gold',
		metric: 'total_wins',
		thresholds: {
			bronze: 5,
			silver: 25,
			gold: 100,
		},
		titleKey: 'medals.minesweeper.veteran.title',
		descriptionKey: 'medals.minesweeper.veteran.desc',
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
		id: 'minesweeper_tour',
		type: 'ladder',
		tier: 'gold',
		thresholds: {
			bronze: 1,
			silver: 2,
			gold: 3,
		},
		titleKey: 'medals.minesweeper.tour.title',
		descriptionKey: 'medals.minesweeper.tour.desc',
		icon: 'trophy-gold',
		evaluate: ({ priorState, result }) => {
			const prior = priorState.medalProgress.minesweeper_tour;
			const size = (result.roundContext?.boardSize ?? result.roundContext?.size ?? result.sizeKey) as
				| string
				| undefined;
			const diff = (result.roundContext?.difficulty ?? result.levelKey) as string | undefined;
			const won = result.won;

			const isSmallOrLarger = ['small', 'medium', 'large', 'extraLarge', 'sm', 'md', 'lg', 'xl'].includes(
				size ?? '',
			);
			const bronzeNow = won && isSmallOrLarger;
			const bronze = Boolean(prior?.bronzeUnlocked || bronzeNow);

			const isLargeOrLarger = ['large', 'extraLarge', 'lg', 'xl'].includes(size ?? '');
			const isHardOrExpert = ['hard', 'expert'].includes(diff ?? '');
			const silverNow = won && isLargeOrLarger && isHardOrExpert;
			const silver = Boolean(prior?.silverUnlocked || (bronze && silverNow));

			const isExtraLarge = ['extraLarge', 'xl'].includes(size ?? '');
			const isExpert = diff === 'expert';
			const goldNow = won && isExtraLarge && isExpert;
			const gold = Boolean(prior?.goldUnlocked || (bronze && silver && goldNow));

			let currentTier: MedalTier | null = null;
			let currentProgress = 0;
			let nextThreshold: number | null = 1;

			if (gold) {
				currentTier = 'gold';
				currentProgress = 3;
				nextThreshold = null;
			} else if (silver) {
				currentTier = 'silver';
				currentProgress = 2;
				nextThreshold = 3;
			} else if (bronze) {
				currentTier = 'bronze';
				currentProgress = 1;
				nextThreshold = 2;
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
		id: 'minesweeper_streak',
		type: 'ladder',
		tier: 'gold',
		metric: 'win_streak',
		thresholds: {
			bronze: 3,
			silver: 5,
			gold: 10,
		},
		titleKey: 'medals.minesweeper.streak.title',
		descriptionKey: 'medals.minesweeper.streak.desc',
		icon: 'trophy-gold',
		evaluate: ({ priorState, updatedBaseStats, result }) => {
			const prior = priorState.medalProgress.minesweeper_streak;
			const won = result.won;
			const diff = (result.roundContext?.difficulty ?? result.levelKey) as string | undefined;
			const isMediumPlus = ['medium', 'hard', 'expert', 'intermediate'].includes(diff ?? '');

			let currentMedStreak = prior?.currentProgress ?? 0;
			if (!won) {
				currentMedStreak = 0;
			} else if (isMediumPlus) {
				currentMedStreak += 1;
			} else {
				currentMedStreak = 0;
			}

			const bronze = Boolean(
				prior?.bronzeUnlocked || updatedBaseStats.bestStreak >= 3 || updatedBaseStats.currentStreak >= 3,
			);
			const silver = Boolean(prior?.silverUnlocked || currentMedStreak >= 5);
			const gold = Boolean(prior?.goldUnlocked || currentMedStreak >= 10);

			const displayStreak = Math.max(updatedBaseStats.currentStreak, currentMedStreak);

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
		id: 'minesweeper_flagless',
		type: 'standalone',
		tier: 'silver',
		titleKey: 'medals.minesweeper.flagless.title',
		descriptionKey: 'medals.minesweeper.flagless.desc',
		icon: 'trophy-silver',
		evaluate: ({ result }) => {
			const flagsPlaced = (result.roundContext?.flagsPlaced as number) ?? 0;
			const size = (result.roundContext?.boardSize ?? result.roundContext?.size ?? result.sizeKey) as
				| string
				| undefined;
			const isEligibleSize = ['medium', 'large', 'extraLarge', 'md', 'lg', 'xl'].includes(size ?? '');

			return {
				unlocked: Boolean(result.won && flagsPlaced === 0 && isEligibleSize),
			};
		},
	},
	{
		id: 'minesweeper_speed_small',
		type: 'standalone',
		tier: 'silver',
		titleKey: 'medals.minesweeper.speed_small.title',
		descriptionKey: 'medals.minesweeper.speed_small.desc',
		icon: 'trophy-silver',
		evaluate: ({ result }) => {
			const size = (result.roundContext?.boardSize ?? result.roundContext?.size ?? result.sizeKey) as
				| string
				| undefined;
			const diff = (result.roundContext?.difficulty ?? result.levelKey) as string | undefined;
			const isSmall = ['small', 'sm'].includes(size ?? '');
			const isMedium = diff === 'medium';

			return {
				unlocked: Boolean(
					result.won && isSmall && isMedium && result.playTimeSeconds > 0 && result.playTimeSeconds <= 15,
				),
			};
		},
	},
	{
		id: 'minesweeper_expert_gold',
		type: 'standalone',
		tier: 'gold',
		titleKey: 'medals.minesweeper.expert_gold.title',
		descriptionKey: 'medals.minesweeper.expert_gold.desc',
		icon: 'trophy-gold',
		evaluate: ({ result }) => {
			const size = (result.roundContext?.boardSize ?? result.roundContext?.size ?? result.sizeKey) as
				| string
				| undefined;
			const diff = (result.roundContext?.difficulty ?? result.levelKey) as string | undefined;
			const isExtraLarge = ['extraLarge', 'xl'].includes(size ?? '');
			const isExpert = diff === 'expert';

			return {
				unlocked: Boolean(
					result.won &&
						isExtraLarge &&
						isExpert &&
						result.playTimeSeconds > 0 &&
						result.playTimeSeconds <= 90,
				),
			};
		},
	},
	{
		id: 'minesweeper_college_try',
		type: 'standalone',
		tier: 'bronze',
		target: 1,
		titleKey: 'medals.minesweeper.college_try.title',
		descriptionKey: 'medals.minesweeper.college_try.desc',
		icon: 'trophy-bronze',
		evaluate: ({ result, updatedBaseStats }) => {
			const totalLosses = updatedBaseStats.gamesPlayed - updatedBaseStats.gamesWon;
			return {
				unlocked: Boolean(!result.won && totalLosses === 1),
			};
		},
	},
	{
		id: 'minesweeper_speedrun_failure',
		type: 'standalone',
		tier: 'bronze',
		titleKey: 'medals.minesweeper.speedrun_failure.title',
		descriptionKey: 'medals.minesweeper.speedrun_failure.desc',
		icon: 'trophy-bronze',
		evaluate: ({ result }) => {
			const firstMoveLoss = result.roundContext?.firstMoveLoss as boolean | undefined;
			return {
				unlocked: Boolean(!result.won && (firstMoveLoss || result.playTimeSeconds <= 3)),
			};
		},
	},
	{
		id: 'minesweeper_chord_master',
		type: 'standalone',
		tier: 'bronze',
		target: 15,
		titleKey: 'medals.minesweeper.chord_master.title',
		descriptionKey: 'medals.minesweeper.chord_master.desc',
		icon: 'trophy-bronze',
		evaluate: ({ result }) => {
			const chordsUsed = (result.roundContext?.chordsUsed as number) ?? 0;
			return {
				unlocked: Boolean(result.won && chordsUsed >= 15),
				progress: Math.min(15, chordsUsed),
				target: 15,
			};
		},
	},
	{
		id: 'minesweeper_the_ocho',
		type: 'standalone',
		tier: 'gold',
		titleKey: 'medals.minesweeper.the_ocho.title',
		descriptionKey: 'medals.minesweeper.the_ocho.desc',
		icon: 'trophy-gold',
		evaluate: ({ result }) => {
			const hasRevealedEight = Boolean(result.roundContext?.hasRevealedEight);
			return {
				unlocked: Boolean(result.won && hasRevealedEight),
			};
		},
	},
	{
		id: 'minesweeper_mine_magnet',
		type: 'standalone',
		tier: 'bronze',
		titleKey: 'medals.minesweeper.mine_magnet.title',
		descriptionKey: 'medals.minesweeper.mine_magnet.desc',
		icon: 'trophy-bronze',
		evaluate: ({ updatedCustomStats, result }) => {
			const streak =
				(result.roundContext?.currentLossStreak as number) ?? updatedCustomStats.currentLossStreak ?? 0;
			return {
				unlocked: Boolean(!result.won && streak >= 5),
			};
		},
	},
	{
		id: 'minesweeper_great_cascade',
		type: 'standalone',
		tier: 'silver',
		target: 20,
		titleKey: 'medals.minesweeper.great_cascade.title',
		descriptionKey: 'medals.minesweeper.great_cascade.desc',
		icon: 'trophy-silver',
		evaluate: ({ result }) => {
			const maxCascadeTiles = (result.roundContext?.maxCascadeTiles as number) ?? 0;
			return {
				unlocked: maxCascadeTiles >= 20,
				progress: Math.min(20, maxCascadeTiles),
				target: 20,
			};
		},
	},
	{
		id: 'minesweeper_flag_hoarder',
		type: 'standalone',
		tier: 'bronze',
		titleKey: 'medals.minesweeper.flag_hoarder.title',
		descriptionKey: 'medals.minesweeper.flag_hoarder.desc',
		icon: 'trophy-bronze',
		evaluate: ({ result }) => {
			const flagsPlaced = (result.roundContext?.flagsPlaced as number) ?? 0;
			const totalMines = (result.roundContext?.totalMines as number) ?? 10;
			const threshold = Math.floor(totalMines * 1.5);
			return {
				unlocked: flagsPlaced >= threshold,
				progress: Math.min(threshold, flagsPlaced),
				target: threshold,
			};
		},
	},
	{
		id: 'minesweeper_marathon',
		type: 'ladder',
		tier: 'gold',
		metric: 'lifetime_safe_tiles_cleared',
		thresholds: {
			bronze: 500,
			silver: 2500,
			gold: 10000,
		},
		titleKey: 'medals.minesweeper.marathon.title',
		descriptionKey: 'medals.minesweeper.marathon.desc',
		icon: 'trophy-gold',
		evaluate: ({ updatedCustomStats }) => {
			const tiles = updatedCustomStats.lifetimeSafeTilesCleared ?? 0;
			let currentTier: MedalTier | null = null;
			let nextThreshold: number | null = 500;

			if (tiles >= 10000) {
				currentTier = 'gold';
				nextThreshold = null;
			} else if (tiles >= 2500) {
				currentTier = 'silver';
				nextThreshold = 10000;
			} else if (tiles >= 500) {
				currentTier = 'bronze';
				nextThreshold = 2500;
			}

			return {
				currentProgress: tiles,
				currentTier,
				nextThreshold,
				bronzeUnlocked: tiles >= 500,
				silverUnlocked: tiles >= 2500,
				goldUnlocked: tiles >= 10000,
			};
		},
	},
	{
		id: 'minesweeper_corner_to_corner',
		type: 'standalone',
		tier: 'silver',
		titleKey: 'medals.minesweeper.corner_to_corner.title',
		descriptionKey: 'medals.minesweeper.corner_to_corner.desc',
		icon: 'trophy-silver',
		evaluate: ({ result }) => {
			const cornersClearedInFirstFour = Boolean(
				result.roundContext?.cornersClearedInFirstFour ||
					((result.roundContext?.cornerMovesCount as number) ?? 0) >= 4,
			);
			const size = (result.roundContext?.boardSize ?? result.roundContext?.size ?? result.sizeKey) as
				| string
				| undefined;
			const isLargeOrExtra = ['large', 'extraLarge', 'lg', 'xl'].includes(size ?? '');

			return {
				unlocked: Boolean(result.won && cornersClearedInFirstFour && isLargeOrExtra),
			};
		},
	},
	{
		id: 'minesweeper_bomb_technician',
		type: 'standalone',
		tier: 'gold',
		titleKey: 'medals.minesweeper.bomb_technician.title',
		descriptionKey: 'medals.minesweeper.bomb_technician.desc',
		icon: 'trophy-gold',
		evaluate: ({ result }) => {
			const size = (result.roundContext?.boardSize ?? result.roundContext?.size ?? result.sizeKey) as
				| string
				| undefined;
			const diff = (result.roundContext?.difficulty ?? result.levelKey) as string | undefined;
			const isExtraLarge = ['extraLarge', 'xl'].includes(size ?? '');
			const isExpert = diff === 'expert';
			const perfectFlagging = Boolean(result.roundContext?.perfectFlagging);

			return {
				unlocked: Boolean(result.won && isExtraLarge && isExpert && perfectFlagging),
			};
		},
	},
];

export default MINESWEEPER_MEDAL_DEFINITIONS;
