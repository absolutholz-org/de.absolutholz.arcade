import type { SchemaToTranslationContract } from './common.schema.js';

export const queensSchema = {
	title: 'title',
	description: 'description',
	difficulty: {
		label: 'difficulty.label',
		easy: 'difficulty.easy',
		easyDesc: 'difficulty.easyDesc',
		medium: 'difficulty.medium',
		mediumDesc: 'difficulty.mediumDesc',
		hard: 'difficulty.hard',
		hardDesc: 'difficulty.hardDesc',
		expert: 'difficulty.expert',
		expertDesc: 'difficulty.expertDesc',
	},
	levels: {
		puzzle: 'levels.puzzle',
		puzzleNum: 'levels.puzzleNum',
		selectLevel: 'levels.selectLevel',
		completed: 'levels.completed',
		notCompleted: 'levels.notCompleted',
		bestTime: 'levels.bestTime',
	},
	mode: {
		label: 'mode.label',
		mark: 'mode.mark',
		markDesc: 'mode.markDesc',
		token: 'mode.token',
		tokenDesc: 'mode.tokenDesc',
	},
	controls: {
		undo: 'controls.undo',
		redo: 'controls.redo',
		reset: 'controls.reset',
		autoCross: 'controls.autoCross',
		autoCrossDesc: 'controls.autoCrossDesc',
		pause: 'controls.pause',
		resume: 'controls.resume',
		restart: 'controls.restart',
		play: 'controls.play',
		nextPuzzle: 'controls.nextPuzzle',
		backToLobby: 'controls.backToLobby',
	},
	settings: {
		title: 'settings.title',
		gameplayTab: 'settings.gameplayTab',
		siteTab: 'settings.siteTab',
		autoCross: {
			label: 'settings.autoCross.label',
			description: 'settings.autoCross.description',
		},
		colorScheme: 'settings.colorScheme',
		language: 'settings.language',
	},
	status: {
		paused: 'status.paused',
		pausedDescription: 'status.pausedDescription',
		timer: 'status.timer',
		time: 'status.time',
		bestTime: 'status.bestTime',
		newBestTime: 'status.newBestTime',
		tokensPlaced: 'status.tokensPlaced',
	},
	conflicts: {
		row: 'conflicts.row',
		col: 'conflicts.col',
		region: 'conflicts.region',
		adjacency: 'conflicts.adjacency',
	},
	victory: {
		title: 'victory.title',
		congratulations: 'victory.congratulations',
		playAgain: 'victory.playAgain',
		nextLevel: 'victory.nextLevel',
	},
	aria: {
		board: 'aria.board',
		cell: 'aria.cell',
		cellEmpty: 'aria.cellEmpty',
		cellMarked: 'aria.cellMarked',
		cellToken: 'aria.cellToken',
		conflictNotice: 'aria.conflictNotice',
		headerToolbar: 'aria.headerToolbar',
	},
	navigation: {
		rules: 'navigation.rules',
		lobby: 'navigation.lobby',
	},
} as const;

export type QueensSchema = typeof queensSchema;
export type QueensTranslationContract = SchemaToTranslationContract<QueensSchema>;
