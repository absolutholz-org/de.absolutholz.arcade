import type { SchemaToTranslationContract } from './common.schema.js';

export const lasersSchema = {
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
	colors: {
		red: 'colors.red',
		green: 'colors.green',
		blue: 'colors.blue',
		yellow: 'colors.yellow',
		magenta: 'colors.magenta',
		cyan: 'colors.cyan',
		white: 'colors.white',
	},
	orientations: {
		forwardSlash: 'orientations.forwardSlash',
		backslash: 'orientations.backslash',
	},
	hud: {
		targets: 'hud.targets',
		moves: 'hud.moves',
		par: 'hud.par',
		hints: 'hud.hints',
	},
	controls: {
		undo: 'controls.undo',
		redo: 'controls.redo',
		reset: 'controls.reset',
		hint: 'controls.hint',
		newPuzzle: 'controls.newPuzzle',
		pause: 'controls.pause',
		resume: 'controls.resume',
		backToLobby: 'controls.backToLobby',
	},
	settings: {
		title: 'settings.title',
		showColorSymbols: {
			label: 'settings.showColorSymbols.label',
			description: 'settings.showColorSymbols.description',
		},
		showParCounter: {
			label: 'settings.showParCounter.label',
			description: 'settings.showParCounter.description',
		},
	},
	status: {
		paused: 'status.paused',
		resumed: 'status.resumed',
		mirrorRotated: 'status.mirrorRotated',
		splitterRotated: 'status.splitterRotated',
		hintApplied: 'status.hintApplied',
		noHintNeeded: 'status.noHintNeeded',
		undone: 'status.undone',
		redone: 'status.redone',
		boardReset: 'status.boardReset',
		solved: 'status.solved',
	},
	victory: {
		title: 'victory.title',
		message: 'victory.message',
		parBadge: 'victory.parBadge',
		moves: 'victory.moves',
		parMoves: 'victory.parMoves',
		hintsUsed: 'victory.hintsUsed',
		nextPuzzle: 'victory.nextPuzzle',
		playAgain: 'victory.playAgain',
	},
	stats: {
		title: 'stats.title',
		solvedCount: 'stats.solvedCount',
		bestTime: 'stats.bestTime',
	},
	lobby: {
		chooseDifficulty: 'lobby.chooseDifficulty',
		resumeSubtitle: 'lobby.resumeSubtitle',
		howToPlayTitle: 'lobby.howToPlayTitle',
	},
	aria: {
		boardLabel: 'aria.boardLabel',
		emptyCell: 'aria.emptyCell',
		wallCell: 'aria.wallCell',
		emitterCell: 'aria.emitterCell',
		targetLitCell: 'aria.targetLitCell',
		targetUnlitCell: 'aria.targetUnlitCell',
		mirrorCell: 'aria.mirrorCell',
		fixedMirrorCell: 'aria.fixedMirrorCell',
		splitterCell: 'aria.splitterCell',
		fixedSplitterCell: 'aria.fixedSplitterCell',
		beamOverlayTitle: 'aria.beamOverlayTitle',
	},
} as const;

export type LasersSchema = typeof lasersSchema;

export type LasersTranslationContract = SchemaToTranslationContract<LasersSchema>;
