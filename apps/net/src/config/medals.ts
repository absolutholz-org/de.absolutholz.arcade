import type { AchievementDefinition, MedalTier } from '@arcade/lib-medals';

export const NET_MEDAL_DEFINITIONS: readonly AchievementDefinition<'net'>[] = [
	{
		id: 'net_first_online',
		type: 'standalone',
		tier: 'bronze',
		target: 1,
		titleKey: 'medals.net.first_online.title',
		descriptionKey: 'medals.net.first_online.desc',
		icon: 'trophy-bronze',
		evaluate: ({ updatedBaseStats }) => ({
			unlocked: updatedBaseStats.gamesWon >= 1,
			progress: Math.min(1, updatedBaseStats.gamesWon),
			target: 1,
		}),
	},
	{
		id: 'net_network_architect',
		type: 'ladder',
		tier: 'gold',
		metric: 'total_wins',
		thresholds: {
			bronze: 5,
			silver: 25,
			gold: 100,
		},
		titleKey: 'medals.net.network_architect.title',
		descriptionKey: 'medals.net.network_architect.desc',
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
		id: 'net_backbone_engineer',
		type: 'ladder',
		tier: 'gold',
		thresholds: {
			bronze: 3,
			silver: 15,
			gold: 50,
		},
		titleKey: 'medals.net.backbone_engineer.title',
		descriptionKey: 'medals.net.backbone_engineer.desc',
		icon: 'trophy-gold',
		evaluate: ({ updatedCustomStats }) => {
			const backboneWins = Number((updatedCustomStats.hardWins ?? 0) + (updatedCustomStats.expertWins ?? 0));
			let currentTier: MedalTier | null = null;
			let nextThreshold: number | null = 3;

			if (backboneWins >= 50) {
				currentTier = 'gold';
				nextThreshold = null;
			} else if (backboneWins >= 15) {
				currentTier = 'silver';
				nextThreshold = 50;
			} else if (backboneWins >= 3) {
				currentTier = 'bronze';
				nextThreshold = 15;
			}

			return {
				currentProgress: backboneWins,
				currentTier,
				nextThreshold,
				bronzeUnlocked: backboneWins >= 3,
				silverUnlocked: backboneWins >= 15,
				goldUnlocked: backboneWins >= 50,
			};
		},
	},
	{
		id: 'net_speedy_packet',
		type: 'standalone',
		tier: 'silver',
		titleKey: 'medals.net.speedy_packet.title',
		descriptionKey: 'medals.net.speedy_packet.desc',
		icon: 'trophy-silver',
		evaluate: ({ result }) => {
			const isEasy = result.levelKey === 'easy' || result.roundContext?.difficulty === 'easy';
			return {
				unlocked: Boolean(result.won && isEasy && result.playTimeSeconds > 0 && result.playTimeSeconds <= 30),
			};
		},
	},
	{
		id: 'net_hyperscale',
		type: 'standalone',
		tier: 'gold',
		titleKey: 'medals.net.hyperscale.title',
		descriptionKey: 'medals.net.hyperscale.desc',
		icon: 'trophy-gold',
		evaluate: ({ result }) => {
			const diff = result.levelKey ?? (result.roundContext?.difficulty as string | undefined);
			const isEligible = diff === 'hard' || diff === 'expert';
			return {
				unlocked: Boolean(
					result.won && isEligible && result.playTimeSeconds > 0 && result.playTimeSeconds <= 180,
				),
			};
		},
	},
	{
		id: 'net_packet_perfection',
		type: 'standalone',
		tier: 'silver',
		titleKey: 'medals.net.packet_perfection.title',
		descriptionKey: 'medals.net.packet_perfection.desc',
		icon: 'trophy-silver',
		evaluate: ({ result }) => {
			const diff = result.levelKey ?? (result.roundContext?.difficulty as string | undefined);
			const isEligible = diff === 'medium' || diff === 'hard' || diff === 'expert';
			const undoUsed = Boolean(result.roundContext?.undoUsed);
			return {
				unlocked: Boolean(result.won && isEligible && !undoUsed),
			};
		},
	},
	{
		id: 'net_hotline_streak',
		type: 'standalone',
		tier: 'bronze',
		target: 3,
		titleKey: 'medals.net.hotline_streak.title',
		descriptionKey: 'medals.net.hotline_streak.desc',
		icon: 'trophy-bronze',
		evaluate: ({ updatedBaseStats }) => {
			const streak = Math.max(updatedBaseStats.bestStreak, updatedBaseStats.currentStreak);
			return {
				unlocked: streak >= 3,
				progress: Math.min(3, streak),
				target: 3,
			};
		},
	},
];

export default NET_MEDAL_DEFINITIONS;
