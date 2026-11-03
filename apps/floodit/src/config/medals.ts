import type { AchievementDefinition, MedalTier } from '@arcade/lib-medals';

interface FloodItRoundMetadata {
	readonly moves?: number;
	readonly maxMoves?: number;
	readonly spareMoves?: number;
	readonly isWireToWire?: boolean;
	readonly isCleanSweep?: boolean;
	readonly isNoRegrets?: boolean;
	readonly isCornerToCorner?: boolean;
	readonly isGiantLeap?: boolean;
	readonly isTsunami?: boolean;
	readonly isSymbolSurveyor?: boolean;
	readonly cellsFlooded?: number;
	readonly maxSingleMoveDelta?: number;
	readonly tierWins?: Record<string, boolean>;
	readonly lifetimeCellsFlooded?: number;
	readonly finalColor?: number;
}

interface FloodItRoundContext {
	readonly roundMetadata?: FloodItRoundMetadata;
}

export const FLOODIT_MEDAL_DEFINITIONS: readonly AchievementDefinition<'floodit'>[] = [
	{
		id: 'floodit_first_win',
		type: 'standalone',
		tier: 'bronze',
		target: 1,
		titleKey: 'medals.floodit.first_win.title',
		descriptionKey: 'medals.floodit.first_win.desc',
		icon: 'trophy-bronze',
		evaluate: ({ updatedBaseStats }) => ({
			unlocked: updatedBaseStats.gamesWon >= 1,
			progress: Math.min(1, updatedBaseStats.gamesWon),
			target: 1,
		}),
	},
	{
		id: 'floodit_veteran',
		type: 'ladder',
		tier: 'gold',
		metric: 'total_wins',
		thresholds: {
			bronze: 5,
			silver: 25,
			gold: 50,
		},
		titleKey: 'medals.floodit.veteran.title',
		descriptionKey: 'medals.floodit.veteran.desc',
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
		id: 'floodit_wire_to_wire',
		type: 'standalone',
		tier: 'silver',
		target: 1,
		titleKey: 'medals.floodit.wire_to_wire.title',
		descriptionKey: 'medals.floodit.wire_to_wire.desc',
		icon: 'trophy-silver',
		evaluate: ({ result }) => {
			const roundContext = result?.roundContext as FloodItRoundContext | undefined;
			const unlocked = Boolean(result?.won && roundContext?.roundMetadata?.isWireToWire);
			return {
				unlocked,
				progress: unlocked ? 1 : 0,
				target: 1,
			};
		},
	},
	{
		id: 'floodit_clean_sweep',
		type: 'standalone',
		tier: 'gold',
		target: 1,
		titleKey: 'medals.floodit.clean_sweep.title',
		descriptionKey: 'medals.floodit.clean_sweep.desc',
		icon: 'trophy-gold',
		evaluate: ({ result }) => {
			const roundContext = result?.roundContext as FloodItRoundContext | undefined;
			const unlocked = Boolean(result?.won && roundContext?.roundMetadata?.isCleanSweep);
			return {
				unlocked,
				progress: unlocked ? 1 : 0,
				target: 1,
			};
		},
	},
	{
		id: 'floodit_no_regrets',
		type: 'standalone',
		tier: 'silver',
		target: 1,
		titleKey: 'medals.floodit.no_regrets.title',
		descriptionKey: 'medals.floodit.no_regrets.desc',
		icon: 'trophy-silver',
		evaluate: ({ result }) => {
			const roundContext = result?.roundContext as FloodItRoundContext | undefined;
			const unlocked = Boolean(result?.won && roundContext?.roundMetadata?.isNoRegrets);
			return {
				unlocked,
				progress: unlocked ? 1 : 0,
				target: 1,
			};
		},
	},
	{
		id: 'floodit_corner_to_corner',
		type: 'standalone',
		tier: 'bronze',
		target: 1,
		titleKey: 'medals.floodit.corner_to_corner.title',
		descriptionKey: 'medals.floodit.corner_to_corner.desc',
		icon: 'trophy-bronze',
		evaluate: ({ result }) => {
			const roundContext = result?.roundContext as FloodItRoundContext | undefined;
			const unlocked = Boolean(result?.won && roundContext?.roundMetadata?.isCornerToCorner);
			return {
				unlocked,
				progress: unlocked ? 1 : 0,
				target: 1,
			};
		},
	},
	{
		id: 'floodit_giant_leap',
		type: 'standalone',
		tier: 'silver',
		target: 1,
		titleKey: 'medals.floodit.giant_leap.title',
		descriptionKey: 'medals.floodit.giant_leap.desc',
		icon: 'trophy-silver',
		evaluate: ({ result }) => {
			const roundContext = result?.roundContext as FloodItRoundContext | undefined;
			const unlocked = Boolean(roundContext?.roundMetadata?.isGiantLeap);
			return {
				unlocked,
				progress: unlocked ? 1 : 0,
				target: 1,
			};
		},
	},
	{
		id: 'floodit_prism_master',
		type: 'standalone',
		tier: 'gold',
		target: 6,
		titleKey: 'medals.floodit.prism_master.title',
		descriptionKey: 'medals.floodit.prism_master.desc',
		icon: 'trophy-gold',
		evaluate: ({ result, updatedCustomStats }) => {
			const roundContext = result?.roundContext as FloodItRoundContext | undefined;
			const winningColors: number[] = Array.isArray(updatedCustomStats?.winningColors)
				? [...updatedCustomStats.winningColors]
				: [];

			if (result?.won && typeof roundContext?.roundMetadata?.finalColor === 'number') {
				const color = roundContext.roundMetadata.finalColor;
				if (!winningColors.includes(color)) {
					winningColors.push(color);
				}
			}

			const count = winningColors.length;
			return {
				unlocked: count >= 6,
				progress: Math.min(6, count),
				target: 6,
			};
		},
	},
	{
		id: 'floodit_tsunami',
		type: 'standalone',
		tier: 'gold',
		target: 1,
		titleKey: 'medals.floodit.tsunami.title',
		descriptionKey: 'medals.floodit.tsunami.desc',
		icon: 'trophy-gold',
		evaluate: ({ result }) => {
			const roundContext = result?.roundContext as FloodItRoundContext | undefined;
			const unlocked = Boolean(
				roundContext?.roundMetadata?.isTsunami ||
					(typeof roundContext?.roundMetadata?.maxSingleMoveDelta === 'number' &&
						roundContext.roundMetadata.maxSingleMoveDelta >= 0.4),
			);
			return {
				unlocked,
				progress: unlocked ? 1 : 0,
				target: 1,
			};
		},
	},
	{
		id: 'floodit_grand_tour',
		type: 'standalone',
		tier: 'gold',
		target: 4,
		titleKey: 'medals.floodit.grand_tour.title',
		descriptionKey: 'medals.floodit.grand_tour.desc',
		icon: 'trophy-gold',
		evaluate: ({ result, updatedCustomStats }) => {
			const roundContext = result?.roundContext as FloodItRoundContext | undefined;
			const tierWins: Record<string, boolean> = {
				...((updatedCustomStats?.tierWins as Record<string, boolean> | undefined) ?? {}),
				...((roundContext?.roundMetadata?.tierWins as Record<string, boolean> | undefined) ?? {}),
			};
			if (result?.won && result?.levelKey) {
				tierWins[result.levelKey] = true;
			}
			const tiers = ['beginner', 'easy', 'medium', 'hard'] as const;
			const wonCount = tiers.filter((t) => Boolean(tierWins[t])).length;
			const unlocked = wonCount >= 4;
			return {
				unlocked,
				progress: wonCount,
				target: 4,
			};
		},
	},
	{
		id: 'floodit_the_deluge',
		type: 'ladder',
		tier: 'gold',
		metric: 'lifetime_cells',
		thresholds: {
			bronze: 1000,
			silver: 5000,
			gold: 15000,
		},
		titleKey: 'medals.floodit.the_deluge.title',
		descriptionKey: 'medals.floodit.the_deluge.desc',
		icon: 'trophy-gold',
		evaluate: ({ result, updatedCustomStats }) => {
			const roundContext = result?.roundContext as FloodItRoundContext | undefined;
			const priorCells =
				typeof updatedCustomStats?.lifetimeCellsFlooded === 'number'
					? updatedCustomStats.lifetimeCellsFlooded
					: 0;
			const addedCells =
				typeof roundContext?.roundMetadata?.cellsFlooded === 'number'
					? roundContext.roundMetadata.cellsFlooded
					: 0;
			const total =
				typeof roundContext?.roundMetadata?.lifetimeCellsFlooded === 'number'
					? roundContext.roundMetadata.lifetimeCellsFlooded
					: priorCells + addedCells;

			let currentTier: MedalTier | null = null;
			let nextThreshold: number | null = 1000;

			if (total >= 15000) {
				currentTier = 'gold';
				nextThreshold = null;
			} else if (total >= 5000) {
				currentTier = 'silver';
				nextThreshold = 15000;
			} else if (total >= 1000) {
				currentTier = 'bronze';
				nextThreshold = 5000;
			}

			return {
				currentProgress: total,
				currentTier,
				nextThreshold,
				bronzeUnlocked: total >= 1000,
				silverUnlocked: total >= 5000,
				goldUnlocked: total >= 15000,
			};
		},
	},
	{
		id: 'floodit_symbol_surveyor',
		type: 'standalone',
		tier: 'bronze',
		target: 1,
		titleKey: 'medals.floodit.symbol_surveyor.title',
		descriptionKey: 'medals.floodit.symbol_surveyor.desc',
		icon: 'trophy-bronze',
		evaluate: ({ result }) => {
			const roundContext = result?.roundContext as FloodItRoundContext | undefined;
			const unlocked = Boolean(result?.won && roundContext?.roundMetadata?.isSymbolSurveyor);
			return {
				unlocked,
				progress: unlocked ? 1 : 0,
				target: 1,
			};
		},
	},
];

export default FLOODIT_MEDAL_DEFINITIONS;
