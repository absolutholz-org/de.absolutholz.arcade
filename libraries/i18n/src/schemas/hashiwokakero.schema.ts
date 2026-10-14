import type { SchemaToTranslationContract } from './common.schema.js';

export const hashiwokakeroSchema = {
	title: 'title',
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
		standard: 'mode.standard',
		standardDesc: 'mode.standardDesc',
		zen: 'mode.zen',
		zenDesc: 'mode.zenDesc',
	},
	controls: {
		undo: 'controls.undo',
		redo: 'controls.redo',
		reset: 'controls.reset',
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
		zenMode: {
			label: 'settings.zenMode.label',
			description: 'settings.zenMode.description',
		},
		highlightSatisfied: {
			label: 'settings.highlightSatisfied.label',
			description: 'settings.highlightSatisfied.description',
		},
		highlightOverflow: {
			label: 'settings.highlightOverflow.label',
			description: 'settings.highlightOverflow.description',
		},
		colorScheme: 'settings.colorScheme',
		language: 'settings.language',
	},
	status: {
		paused: 'status.paused',
		pausedDescription: 'status.pausedDescription',
		timer: 'status.timer',
		time: 'status.time',
		islandsRemaining: 'status.islandsRemaining',
		satisfiedIslands: 'status.satisfiedIslands',
		bestTime: 'status.bestTime',
		newBestTime: 'status.newBestTime',
	},
	victory: {
		title: 'victory.title',
		congratulations: 'victory.congratulations',
		playAgain: 'victory.playAgain',
		nextLevel: 'victory.nextLevel',
		completedIn: 'victory.completedIn',
	},
} as const;

export type HashiwokakeroSchema = typeof hashiwokakeroSchema;
export type HashiwokakeroTranslationContract = SchemaToTranslationContract<HashiwokakeroSchema>;
