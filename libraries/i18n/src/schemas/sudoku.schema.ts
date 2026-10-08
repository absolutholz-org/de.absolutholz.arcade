import type { SchemaToTranslationContract } from './common.schema.js';

export const sudokuSchema = {
	title: 'title',
	description: 'description',
	difficulty: {
		label: 'difficulty.label',
		easy: 'difficulty.easy',
		medium: 'difficulty.medium',
		hard: 'difficulty.hard',
		veryHard: 'difficulty.veryHard',
		insane: 'difficulty.insane',
		inhuman: 'difficulty.inhuman',
	},
	controls: {
		undo: 'controls.undo',
		redo: 'controls.redo',
		erase: 'controls.erase',
		notes: 'controls.notes',
		notesOn: 'controls.notesOn',
		notesOff: 'controls.notesOff',
		pause: 'controls.pause',
		resume: 'controls.resume',
		restart: 'controls.restart',
		newGame: 'controls.newGame',
		backToLobby: 'controls.backToLobby',
	},
	settings: {
		title: 'settings.title',
		gameplayTab: 'settings.gameplayTab',
		siteTab: 'settings.siteTab',
		highlightPeerCells: {
			label: 'settings.highlightPeerCells.label',
			description: 'settings.highlightPeerCells.description',
		},
		highlightPeerDigits: {
			label: 'settings.highlightPeerDigits.label',
			description: 'settings.highlightPeerDigits.description',
		},
		highlightErrors: {
			label: 'settings.highlightErrors.label',
			description: 'settings.highlightErrors.description',
		},
		autoClearNotes: {
			label: 'settings.autoClearNotes.label',
			description: 'settings.autoClearNotes.description',
		},
		colorScheme: 'settings.colorScheme',
		language: 'settings.language',
	},
	status: {
		paused: 'status.paused',
		pausedDescription: 'status.pausedDescription',
		resumed: 'status.resumed',
		timer: 'status.timer',
		time: 'status.time',
		bestTime: 'status.bestTime',
		newBestTime: 'status.newBestTime',
	},
	victory: {
		title: 'victory.title',
		congratulations: 'victory.congratulations',
		timeElapsed: 'victory.timeElapsed',
		playAgain: 'victory.playAgain',
		chooseDifficulty: 'victory.chooseDifficulty',
	},
	stats: {
		title: 'stats.title',
		gamesPlayed: 'stats.gamesPlayed',
		gamesWon: 'stats.gamesWon',
		winRate: 'stats.winRate',
		bestTime: 'stats.bestTime',
		noStatsYet: 'stats.noStatsYet',
	},
	rules: {
		title: 'rules.title',
		objectiveTitle: 'rules.objectiveTitle',
		objective: 'rules.objective',
		rule1Title: 'rules.rule1Title',
		rule1: 'rules.rule1',
		rule2Title: 'rules.rule2Title',
		rule2: 'rules.rule2',
		rule3Title: 'rules.rule3Title',
		rule3: 'rules.rule3',
		notesTipTitle: 'rules.notesTipTitle',
		notesTip: 'rules.notesTip',
	},
	aria: {
		cellLabel: 'aria.cellLabel',
		emptyCell: 'aria.emptyCell',
		clueCell: 'aria.clueCell',
		keypadDigit: 'aria.keypadDigit',
		boardGrid: 'aria.boardGrid',
	},
} as const;

export type SudokuSchema = typeof sudokuSchema;

export type SudokuTranslationContract = SchemaToTranslationContract<SudokuSchema>;
