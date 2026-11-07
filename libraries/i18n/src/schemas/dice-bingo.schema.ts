import type { SchemaToTranslationContract } from './common.schema.js';

export const diceBingoSchema = {
	title: 'title',
	subtitle: 'subtitle',
	description: 'description',
	difficulty: {
		label: 'difficulty.label',
		easy: 'difficulty.easy',
		easyDesc: 'difficulty.easyDesc',
		medium: 'difficulty.medium',
		mediumDesc: 'difficulty.mediumDesc',
		hard: 'difficulty.hard',
		hardDesc: 'difficulty.hardDesc',
	},
	lobby: {
		title: 'lobby.title',
		subtitle: 'lobby.subtitle',
		selectDifficulty: 'lobby.selectDifficulty',
		easy: 'lobby.easy',
		easyDesc: 'lobby.easyDesc',
		medium: 'lobby.medium',
		mediumDesc: 'lobby.mediumDesc',
		hard: 'lobby.hard',
		hardDesc: 'lobby.hardDesc',
		completed: 'lobby.completed',
		play: 'lobby.play',
		quickPlay: 'lobby.quickPlay',
		quickPlayDesc: 'lobby.quickPlayDesc',
	},
	game: {
		rollDice: 'game.rollDice',
		rolling: 'game.rolling',
		currentRoll: 'game.currentRoll',
		sum: 'game.sum',
		turnsRemaining: 'game.turnsRemaining',
		currentScore: 'game.currentScore',
		placeDiceHint: 'game.placeDiceHint',
		cellLabel: 'game.cellLabel',
		blockedCell: 'game.blockedCell',
		winTitle: 'game.winTitle',
		winDescription: 'game.winDescription',
		boardLabel: 'game.boardLabel',
		linesScored: 'game.linesScored',
		totalScore: 'game.totalScore',
	},
	controls: {
		undo: 'controls.undo',
		restart: 'controls.restart',
		newGame: 'controls.newGame',
		backToLobby: 'controls.backToLobby',
		keyboardHint: 'controls.keyboardHint',
	},
	settings: {
		title: 'settings.title',
		confirmRestart: {
			label: 'settings.confirmRestart.label',
			description: 'settings.confirmRestart.description',
		},
		highlightPotentialLines: {
			label: 'settings.highlightPotentialLines.label',
			description: 'settings.highlightPotentialLines.description',
		},
		showPointPreview: {
			label: 'settings.showPointPreview.label',
			description: 'settings.showPointPreview.description',
		},
	},
	hands: {
		five_of_a_kind: 'hands.five_of_a_kind',
		straight_no_seven: 'hands.straight_no_seven',
		straight_with_seven: 'hands.straight_with_seven',
		full_house: 'hands.full_house',
		four_of_a_kind: 'hands.four_of_a_kind',
		straight_four: 'hands.straight_four',
		three_of_a_kind: 'hands.three_of_a_kind',
		two_pair: 'hands.two_pair',
		one_pair: 'hands.one_pair',
		none: 'hands.none',
	},
} as const;

export type DiceBingoSchema = typeof diceBingoSchema;
export type DiceBingoTranslationContract = SchemaToTranslationContract<DiceBingoSchema>;
