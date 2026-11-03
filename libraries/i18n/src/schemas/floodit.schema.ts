import type { SchemaToTranslationContract } from './common.schema.js';

export const flooditSchema = {
	title: 'title',
	subtitle: 'subtitle',
	description: 'description',
	difficulty: {
		label: 'difficulty.label',
		beginner: 'difficulty.beginner',
		beginnerDesc: 'difficulty.beginnerDesc',
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
		beginner: 'lobby.beginner',
		beginnerDesc: 'lobby.beginnerDesc',
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
		moves: 'game.moves',
		movesRemaining: 'game.movesRemaining',
		percentageFlooded: 'game.percentageFlooded',
		colorCount: 'game.colorCount',
		chooseColor: 'game.chooseColor',
		winTitle: 'game.winTitle',
		winDescription: 'game.winDescription',
		lossTitle: 'game.lossTitle',
		lossDescription: 'game.lossDescription',
		boardLabel: 'game.boardLabel',
		colorOption: 'game.colorOption',
	},
	controls: {
		undo: 'controls.undo',
		redo: 'controls.redo',
		restart: 'controls.restart',
		newGame: 'controls.newGame',
		backToLobby: 'controls.backToLobby',
		keyboardHint: 'controls.keyboardHint',
	},
	settings: {
		title: 'settings.title',
		showColorblindShapes: {
			label: 'settings.showColorblindShapes.label',
			description: 'settings.showColorblindShapes.description',
		},
		confirmRestart: {
			label: 'settings.confirmRestart.label',
			description: 'settings.confirmRestart.description',
		},
	},
} as const;

export type FloodItSchema = typeof flooditSchema;
export type FloodItTranslationContract = SchemaToTranslationContract<FloodItSchema>;
