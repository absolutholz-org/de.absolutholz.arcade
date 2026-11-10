import type { SchemaToTranslationContract } from './common.schema.js';

export const tictactoeSchema = {
	title: 'title',
	subtitle: 'subtitle',
	description: 'description',
	playButton: 'playButton',
	difficulty: {
		standard: 'difficulty.standard',
		standardDesc: 'difficulty.standardDesc',
	},
	lobby: {
		title: 'lobby.title',
		subtitle: 'lobby.subtitle',
		modeSelect: 'lobby.modeSelect',
		passAndPlay: 'lobby.passAndPlay',
		passAndPlayDesc: 'lobby.passAndPlayDesc',
		playOnline: 'lobby.playOnline',
		playOnlineDesc: 'lobby.playOnlineDesc',
		comingSoon: 'lobby.comingSoon',
		player1Label: 'lobby.player1Label',
		player2Label: 'lobby.player2Label',
		player1Default: 'lobby.player1Default',
		player2Default: 'lobby.player2Default',
		startGame: 'lobby.startGame',
	},
	game: {
		turn: 'game.turn',
		winner: 'game.winner',
		draw: 'game.draw',
		boardLabel: 'game.boardLabel',
		cellLabel: 'game.cellLabel',
		emptyCell: 'game.emptyCell',
		playAgain: 'game.playAgain',
		backToMenu: 'game.backToMenu',
		startingTurnInfo: 'game.startingTurnInfo',
		turnDialog: {
			title: 'game.turnDialog.title',
			passDevice: 'game.turnDialog.passDevice',
			waiting: 'game.turnDialog.waiting',
			ok: 'game.turnDialog.ok',
		},
	},
	victory: {
		title: 'victory.title',
		winnerWins: 'victory.winnerWins',
		drawTitle: 'victory.drawTitle',
		drawDescription: 'victory.drawDescription',
		playAgain: 'victory.playAgain',
		backToMenu: 'victory.backToMenu',
	},
	controls: {
		undo: 'controls.undo',
		restart: 'controls.restart',
		rules: 'controls.rules',
		settings: 'controls.settings',
		backToLobby: 'controls.backToLobby',
		keyboardHint: 'controls.keyboardHint',
	},
	settings: {
		title: 'settings.title',
		highlightWinningLine: {
			label: 'settings.highlightWinningLine.label',
			description: 'settings.highlightWinningLine.description',
		},
		showCellCoordinates: {
			label: 'settings.showCellCoordinates.label',
			description: 'settings.showCellCoordinates.description',
		},
		confirmTurnPass: {
			label: 'settings.confirmTurnPass.label',
			description: 'settings.confirmTurnPass.description',
		},
	},
} as const;

export type TicTacToeSchema = typeof tictactoeSchema;
export type TicTacToeTranslationContract = SchemaToTranslationContract<TicTacToeSchema>;
