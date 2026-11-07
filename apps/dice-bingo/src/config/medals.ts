import type { AchievementDefinition } from '@arcade/lib-medals';
import { TIER_SCORE_THRESHOLDS } from '../engine/medals.ts';
import type { DifficultyLevel } from '../engine/types.ts';

export interface DiceBingoRoundMetadata {
	readonly score?: number;
	readonly difficulty?: DifficultyLevel;
	readonly feats?: readonly string[];
	readonly turns?: number;
	readonly maxTurns?: number;
	readonly cleanSweep?: boolean;
}

export interface DiceBingoRoundContext {
	readonly roundMetadata?: DiceBingoRoundMetadata;
}

export const DICE_BINGO_MEDAL_DEFINITIONS: readonly AchievementDefinition<'dice-bingo'>[] = [
	{
		id: 'dice_bingo_lucky_guess',
		type: 'standalone',
		tier: 'bronze',
		target: 1,
		titleKey: 'medals.dice-bingo.lucky_guess.title',
		descriptionKey: 'medals.dice-bingo.lucky_guess.desc',
		icon: 'trophy-bronze',
		evaluate: ({ result }) => {
			const ctx = result?.roundContext as DiceBingoRoundContext | undefined;
			const meta = ctx?.roundMetadata;
			if (!meta?.difficulty || meta.score === undefined) return { unlocked: false, progress: 0, target: 1 };
			const threshold = TIER_SCORE_THRESHOLDS[meta.difficulty].lucky_guess;
			const unlocked = meta.score >= threshold;
			return { unlocked, progress: unlocked ? 1 : 0, target: 1 };
		},
	},
	{
		id: 'dice_bingo_calculated_chaos',
		type: 'standalone',
		tier: 'silver',
		target: 1,
		titleKey: 'medals.dice-bingo.calculated_chaos.title',
		descriptionKey: 'medals.dice-bingo.calculated_chaos.desc',
		icon: 'trophy-silver',
		evaluate: ({ result }) => {
			const ctx = result?.roundContext as DiceBingoRoundContext | undefined;
			const meta = ctx?.roundMetadata;
			if (!meta?.difficulty || meta.score === undefined) return { unlocked: false, progress: 0, target: 1 };
			const threshold = TIER_SCORE_THRESHOLDS[meta.difficulty].calculated_chaos;
			const unlocked = meta.score >= threshold;
			return { unlocked, progress: unlocked ? 1 : 0, target: 1 };
		},
	},
	{
		id: 'dice_bingo_probability_defier',
		type: 'standalone',
		tier: 'gold',
		target: 1,
		titleKey: 'medals.dice-bingo.probability_defier.title',
		descriptionKey: 'medals.dice-bingo.probability_defier.desc',
		icon: 'trophy-gold',
		evaluate: ({ result }) => {
			const ctx = result?.roundContext as DiceBingoRoundContext | undefined;
			const meta = ctx?.roundMetadata;
			if (!meta?.difficulty || meta.score === undefined) return { unlocked: false, progress: 0, target: 1 };
			const threshold = TIER_SCORE_THRESHOLDS[meta.difficulty].probability_defier;
			const unlocked = meta.score >= threshold;
			return { unlocked, progress: unlocked ? 1 : 0, target: 1 };
		},
	},
	{
		id: 'dice_bingo_dice_whisperer',
		type: 'standalone',
		tier: 'gold',
		target: 1,
		titleKey: 'medals.dice-bingo.dice_whisperer.title',
		descriptionKey: 'medals.dice-bingo.dice_whisperer.desc',
		icon: 'trophy-gold',
		evaluate: ({ result }) => {
			const ctx = result?.roundContext as DiceBingoRoundContext | undefined;
			const meta = ctx?.roundMetadata;
			if (!meta?.difficulty || meta.score === undefined) return { unlocked: false, progress: 0, target: 1 };
			const threshold = TIER_SCORE_THRESHOLDS[meta.difficulty].dice_whisperer;
			const unlocked = meta.score >= threshold;
			return { unlocked, progress: unlocked ? 1 : 0, target: 1 };
		},
	},
	{
		id: 'dice_bingo_yahtzee_wrong_game',
		type: 'standalone',
		tier: 'silver',
		target: 1,
		titleKey: 'medals.dice-bingo.yahtzee_wrong_game.title',
		descriptionKey: 'medals.dice-bingo.yahtzee_wrong_game.desc',
		icon: 'trophy-silver',
		evaluate: ({ result }) => {
			const ctx = result?.roundContext as DiceBingoRoundContext | undefined;
			const unlocked = Boolean(ctx?.roundMetadata?.feats?.includes('yahtzee_wrong_game'));
			return { unlocked, progress: unlocked ? 1 : 0, target: 1 };
		},
	},
	{
		id: 'dice_bingo_the_landfill',
		type: 'standalone',
		tier: 'bronze',
		target: 1,
		titleKey: 'medals.dice-bingo.the_landfill.title',
		descriptionKey: 'medals.dice-bingo.the_landfill.desc',
		icon: 'trophy-bronze',
		evaluate: ({ result }) => {
			const ctx = result?.roundContext as DiceBingoRoundContext | undefined;
			const unlocked = Boolean(ctx?.roundMetadata?.feats?.includes('the_landfill'));
			return { unlocked, progress: unlocked ? 1 : 0, target: 1 };
		},
	},
	{
		id: 'dice_bingo_dead_center',
		type: 'standalone',
		tier: 'bronze',
		target: 1,
		titleKey: 'medals.dice-bingo.dead_center.title',
		descriptionKey: 'medals.dice-bingo.dead_center.desc',
		icon: 'trophy-bronze',
		evaluate: ({ result }) => {
			const ctx = result?.roundContext as DiceBingoRoundContext | undefined;
			const unlocked = Boolean(ctx?.roundMetadata?.feats?.includes('dead_center'));
			return { unlocked, progress: unlocked ? 1 : 0, target: 1 };
		},
	},
	{
		id: 'dice_bingo_diagonally_gifted',
		type: 'standalone',
		tier: 'silver',
		target: 1,
		titleKey: 'medals.dice-bingo.diagonally_gifted.title',
		descriptionKey: 'medals.dice-bingo.diagonally_gifted.desc',
		icon: 'trophy-silver',
		evaluate: ({ result }) => {
			const ctx = result?.roundContext as DiceBingoRoundContext | undefined;
			const unlocked = Boolean(ctx?.roundMetadata?.feats?.includes('diagonally_gifted'));
			return { unlocked, progress: unlocked ? 1 : 0, target: 1 };
		},
	},
	{
		id: 'dice_bingo_against_all_odds',
		type: 'standalone',
		tier: 'gold',
		target: 1,
		titleKey: 'medals.dice-bingo.against_all_odds.title',
		descriptionKey: 'medals.dice-bingo.against_all_odds.desc',
		icon: 'trophy-gold',
		evaluate: ({ result }) => {
			const ctx = result?.roundContext as DiceBingoRoundContext | undefined;
			const unlocked = Boolean(ctx?.roundMetadata?.feats?.includes('against_all_odds'));
			return { unlocked, progress: unlocked ? 1 : 0, target: 1 };
		},
	},
	{
		id: 'dice_bingo_the_hoarder',
		type: 'standalone',
		tier: 'silver',
		target: 1,
		titleKey: 'medals.dice-bingo.the_hoarder.title',
		descriptionKey: 'medals.dice-bingo.the_hoarder.desc',
		icon: 'trophy-silver',
		evaluate: ({ result }) => {
			const ctx = result?.roundContext as DiceBingoRoundContext | undefined;
			const unlocked = Boolean(ctx?.roundMetadata?.feats?.includes('the_hoarder'));
			return { unlocked, progress: unlocked ? 1 : 0, target: 1 };
		},
	},
	{
		id: 'dice_bingo_clutch_finish',
		type: 'standalone',
		tier: 'silver',
		target: 1,
		titleKey: 'medals.dice-bingo.clutch_finish.title',
		descriptionKey: 'medals.dice-bingo.clutch_finish.desc',
		icon: 'trophy-silver',
		evaluate: ({ result }) => {
			const ctx = result?.roundContext as DiceBingoRoundContext | undefined;
			const unlocked = Boolean(ctx?.roundMetadata?.feats?.includes('clutch_finish'));
			return { unlocked, progress: unlocked ? 1 : 0, target: 1 };
		},
	},
	{
		id: 'dice_bingo_clean_sweep',
		type: 'standalone',
		tier: 'gold',
		target: 1,
		titleKey: 'medals.dice-bingo.clean_sweep.title',
		descriptionKey: 'medals.dice-bingo.clean_sweep.desc',
		icon: 'trophy-gold',
		evaluate: ({ result }) => {
			const ctx = result?.roundContext as DiceBingoRoundContext | undefined;
			const unlocked = Boolean(ctx?.roundMetadata?.feats?.includes('clean_sweep'));
			return { unlocked, progress: unlocked ? 1 : 0, target: 1 };
		},
	},
];
