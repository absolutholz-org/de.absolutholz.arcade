import type { AchievementDefinition, MedalTier } from '@arcade/lib-medals';

interface PentominoesRoundMetadata {
	readonly pentaLadderSolved?: number;
	readonly silhouettesSolved?: number;
	readonly fullSet60Solved?: number;
	readonly isFlawless?: boolean;
	readonly isSpeedPacker?: boolean;
}

interface PentominoesRoundContext {
	readonly roundMetadata?: PentominoesRoundMetadata;
}

export const PENTOMINOES_MEDAL_DEFINITIONS: readonly AchievementDefinition<'pentominoes'>[] = [
	{
		id: 'pentominoes_first_fit',
		type: 'standalone',
		tier: 'bronze',
		target: 1,
		titleKey: 'medals.pentominoes.first_fit.title',
		descriptionKey: 'medals.pentominoes.first_fit.desc',
		icon: 'trophy-bronze',
		evaluate: ({ updatedBaseStats }) => ({
			unlocked: updatedBaseStats.gamesWon >= 1,
			progress: Math.min(1, updatedBaseStats.gamesWon),
			target: 1,
		}),
	},
	{
		id: 'pentominoes_penta_ladder',
		type: 'ladder',
		tier: 'gold',
		metric: 'penta_ladder',
		thresholds: {
			bronze: 3,
			silver: 7,
			gold: 10,
		},
		titleKey: 'medals.pentominoes.penta_ladder.title',
		descriptionKey: 'medals.pentominoes.penta_ladder.desc',
		icon: 'trophy-gold',
		evaluate: ({ result }) => {
			const roundContext = result?.roundContext as PentominoesRoundContext | undefined;
			const count = roundContext?.roundMetadata?.pentaLadderSolved ?? 0;
			let currentTier: MedalTier | null = null;
			let nextThreshold: number | null = 3;

			if (count >= 10) {
				currentTier = 'gold';
				nextThreshold = null;
			} else if (count >= 7) {
				currentTier = 'silver';
				nextThreshold = 10;
			} else if (count >= 3) {
				currentTier = 'bronze';
				nextThreshold = 7;
			}

			return {
				currentProgress: count,
				currentTier,
				nextThreshold,
				bronzeUnlocked: count >= 3,
				silverUnlocked: count >= 7,
				goldUnlocked: count >= 10,
			};
		},
	},
	{
		id: 'pentominoes_silhouette_sculptor',
		type: 'standalone',
		tier: 'silver',
		target: 3,
		titleKey: 'medals.pentominoes.silhouette_sculptor.title',
		descriptionKey: 'medals.pentominoes.silhouette_sculptor.desc',
		icon: 'trophy-silver',
		evaluate: ({ result }) => {
			const roundContext = result?.roundContext as PentominoesRoundContext | undefined;
			const count = roundContext?.roundMetadata?.silhouettesSolved ?? 0;
			return {
				unlocked: count >= 3,
				progress: Math.min(3, count),
				target: 3,
			};
		},
	},
	{
		id: 'pentominoes_full_set_master',
		type: 'standalone',
		tier: 'gold',
		target: 1,
		titleKey: 'medals.pentominoes.full_set_master.title',
		descriptionKey: 'medals.pentominoes.full_set_master.desc',
		icon: 'trophy-gold',
		evaluate: ({ result }) => {
			const roundContext = result?.roundContext as PentominoesRoundContext | undefined;
			const count = roundContext?.roundMetadata?.fullSet60Solved ?? 0;
			return {
				unlocked: count >= 1,
				progress: Math.min(1, count),
				target: 1,
			};
		},
	},
	{
		id: 'pentominoes_spatial_intuitive',
		type: 'standalone',
		tier: 'silver',
		target: 1,
		titleKey: 'medals.pentominoes.spatial_intuitive.title',
		descriptionKey: 'medals.pentominoes.spatial_intuitive.desc',
		icon: 'trophy-silver',
		evaluate: ({ result }) => {
			const roundContext = result?.roundContext as PentominoesRoundContext | undefined;
			const unlocked = Boolean(result?.won && roundContext?.roundMetadata?.isFlawless);
			return {
				unlocked,
				progress: unlocked ? 1 : 0,
				target: 1,
			};
		},
	},
	{
		id: 'pentominoes_speed_packer',
		type: 'standalone',
		tier: 'gold',
		target: 1,
		titleKey: 'medals.pentominoes.speed_packer.title',
		descriptionKey: 'medals.pentominoes.speed_packer.desc',
		icon: 'trophy-gold',
		evaluate: ({ result }) => {
			const roundContext = result?.roundContext as PentominoesRoundContext | undefined;
			const unlocked = Boolean(result?.won && roundContext?.roundMetadata?.isSpeedPacker);
			return {
				unlocked,
				progress: unlocked ? 1 : 0,
				target: 1,
			};
		},
	},
	{
		id: 'pentominoes_grand_architect',
		type: 'ladder',
		tier: 'gold',
		metric: 'total_wins',
		thresholds: {
			bronze: 5,
			silver: 20,
			gold: 50,
		},
		titleKey: 'medals.pentominoes.grand_architect.title',
		descriptionKey: 'medals.pentominoes.grand_architect.desc',
		icon: 'trophy-gold',
		evaluate: ({ updatedBaseStats }) => {
			const wins = updatedBaseStats.gamesWon;
			let currentTier: MedalTier | null = null;
			let nextThreshold: number | null = 5;

			if (wins >= 50) {
				currentTier = 'gold';
				nextThreshold = null;
			} else if (wins >= 20) {
				currentTier = 'silver';
				nextThreshold = 50;
			} else if (wins >= 5) {
				currentTier = 'bronze';
				nextThreshold = 20;
			}

			return {
				currentProgress: wins,
				currentTier,
				nextThreshold,
				bronzeUnlocked: wins >= 5,
				silverUnlocked: wins >= 20,
				goldUnlocked: wins >= 50,
			};
		},
	},
];
