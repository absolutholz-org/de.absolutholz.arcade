import type { SchemaToTranslationContract } from './common.schema.js';

export const anagramSchema = {
	title: 'title',
	subtitle: 'subtitle',
	description: 'description',
	difficulty: {
		label: 'difficulty.label',
		easy: 'difficulty.easy',
		easyDimensions: 'difficulty.easyDimensions',
		easyDesc: 'difficulty.easyDesc',
		medium: 'difficulty.medium',
		mediumDimensions: 'difficulty.mediumDimensions',
		mediumDesc: 'difficulty.mediumDesc',
		hard: 'difficulty.hard',
		hardDimensions: 'difficulty.hardDimensions',
		hardDesc: 'difficulty.hardDesc',
		expert: 'difficulty.expert',
		expertDimensions: 'difficulty.expertDimensions',
		expertDesc: 'difficulty.expertDesc',
	},
	mode: {
		label: 'mode.label',
		zen: 'mode.zen',
		zenDesc: 'mode.zenDesc',
		timed: 'mode.timed',
		timedDesc: 'mode.timedDesc',
	},
	vocabulary: {
		label: 'vocabulary.label',
		en: 'vocabulary.en',
		de: 'vocabulary.de',
		fr: 'vocabulary.fr',
		pt: 'vocabulary.pt',
	},
	controls: {
		shuffle: 'controls.shuffle',
		play: 'controls.play',
		clear: 'controls.clear',
		submit: 'controls.submit',
		reveal: 'controls.reveal',
		newRound: 'controls.newRound',
		pause: 'controls.pause',
		resume: 'controls.resume',
	},
	hud: {
		score: 'hud.score',
		timeLeft: 'hud.timeLeft',
		wordsFound: 'hud.wordsFound',
		rackLabel: 'hud.rackLabel',
		stagedLabel: 'hud.stagedLabel',
	},
	board: {
		slotsLabel: 'board.slotsLabel',
		wordLength: 'board.wordLength',
	},
	feedback: {
		accepted: 'feedback.accepted',
		baselineCleared: 'feedback.baselineCleared',
		duplicate: 'feedback.duplicate',
		tooShort: 'feedback.tooShort',
		notInRack: 'feedback.notInRack',
		notAWord: 'feedback.notAWord',
	},
	aria: {
		rackTile: 'aria.rackTile',
		stagedTile: 'aria.stagedTile',
		slotHidden: 'aria.slotHidden',
		slotRevealed: 'aria.slotRevealed',
	},
	pause: {
		title: 'pause.title',
		description: 'pause.description',
	},
	victory: {
		title: 'victory.title',
		masteredTitle: 'victory.masteredTitle',
		summary: 'victory.summary',
	},
	defeat: {
		title: 'defeat.title',
		summary: 'defeat.summary',
	},
	navigation: {
		rules: 'navigation.rules',
		lobby: 'navigation.lobby',
	},
} as const;

export type AnagramSchema = typeof anagramSchema;
export type AnagramTranslationContract = SchemaToTranslationContract<AnagramSchema>;
