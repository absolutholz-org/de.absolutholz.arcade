import type { SchemaToTranslationContract } from './common.schema.js';

export const pentominoesSchema = {
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
		expert: 'difficulty.expert',
		expertDesc: 'difficulty.expertDesc',
	},
	lobby: {
		title: 'lobby.title',
		subtitle: 'lobby.subtitle',
		selectDifficulty: 'lobby.selectDifficulty',
		completed: 'lobby.completed',
		quickPlay: 'lobby.quickPlay',
		quickPlayDesc: 'lobby.quickPlayDesc',
		selectLevel: 'lobby.selectLevel',
	},
	status: {
		placed: 'status.placed',
		moves: 'status.moves',
		noneSelected: 'status.noneSelected',
		timer: 'status.timer',
		time: 'status.time',
		newBestTime: 'status.newBestTime',
	},
	controls: {
		rotateCw: 'controls.rotateCw',
		rotateCcw: 'controls.rotateCcw',
		flipH: 'controls.flipH',
		returnToTray: 'controls.returnToTray',
		clearBoard: 'controls.clearBoard',
		hint: 'controls.hint',
		undo: 'controls.undo',
		redo: 'controls.redo',
		backToLobby: 'controls.backToLobby',
		newGame: 'controls.newGame',
		resume: 'controls.resume',
	},
	tray: {
		activePieceTitle: 'tray.activePieceTitle',
		keyboardHint: 'tray.keyboardHint',
		pieceStatusAvailable: 'tray.pieceStatusAvailable',
		pieceStatusPlaced: 'tray.pieceStatusPlaced',
		pieceStatusSelected: 'tray.pieceStatusSelected',
	},
	a11y: {
		boardLabel: 'a11y.boardLabel',
		trayLabel: 'a11y.trayLabel',
		cellEmpty: 'a11y.cellEmpty',
		cellOccupied: 'a11y.cellOccupied',
		cellVoid: 'a11y.cellVoid',
		puzzleSolved: 'a11y.puzzleSolved',
		pickedUpFromTray: 'a11y.pickedUpFromTray',
		returnedToTray: 'a11y.returnedToTray',
		rotatedPiece: 'a11y.rotatedPiece',
		flippedPiece: 'a11y.flippedPiece',
		placedPiece: 'a11y.placedPiece',
		invalidOutOfBounds: 'a11y.invalidOutOfBounds',
		invalidVoidCell: 'a11y.invalidVoidCell',
		invalidOverlap: 'a11y.invalidOverlap',
		pickedUpFromBoard: 'a11y.pickedUpFromBoard',
		hintPlaced: 'a11y.hintPlaced',
	},
	victory: {
		title: 'victory.title',
		congratulations: 'victory.congratulations',
		playAgain: 'victory.playAgain',
		nextPuzzle: 'victory.nextPuzzle',
		viewLobby: 'victory.viewLobby',
	},
	settings: {
		title: 'settings.title',
		showPieceLabels: 'settings.showPieceLabels',
		showPieceLabelsDescription: 'settings.showPieceLabelsDescription',
		showSurfacePatterns: 'settings.showSurfacePatterns',
		showSurfacePatternsDescription: 'settings.showSurfacePatternsDescription',
		highlightGhostValidity: 'settings.highlightGhostValidity',
		highlightGhostValidityDescription: 'settings.highlightGhostValidityDescription',
		showGridCoordinates: 'settings.showGridCoordinates',
		showGridCoordinatesDescription: 'settings.showGridCoordinatesDescription',
	},
	levels: {
		procedural: {
			title: 'levels.procedural.title',
			description: 'levels.procedural.description',
		},
		'rect-3x5': {
			title: 'levels.rect-3x5.title',
			description: 'levels.rect-3x5.description',
		},
		'rect-4x5': {
			title: 'levels.rect-4x5.title',
			description: 'levels.rect-4x5.description',
		},
		'rect-5x5': {
			title: 'levels.rect-5x5.title',
			description: 'levels.rect-5x5.description',
		},
		'rect-5x6': {
			title: 'levels.rect-5x6.title',
			description: 'levels.rect-5x6.description',
		},
		'rect-5x7': {
			title: 'levels.rect-5x7.title',
			description: 'levels.rect-5x7.description',
		},
		'rect-5x8': {
			title: 'levels.rect-5x8.title',
			description: 'levels.rect-5x8.description',
		},
		'rect-5x9': {
			title: 'levels.rect-5x9.title',
			description: 'levels.rect-5x9.description',
		},
		'rect-5x10': {
			title: 'levels.rect-5x10.title',
			description: 'levels.rect-5x10.description',
		},
		'rect-5x11': {
			title: 'levels.rect-5x11.title',
			description: 'levels.rect-5x11.description',
		},
		'rect-5x12': {
			title: 'levels.rect-5x12.title',
			description: 'levels.rect-5x12.description',
		},
		'rect-6x10': {
			title: 'levels.rect-6x10.title',
			description: 'levels.rect-6x10.description',
		},
		'rect-8x8-ring': {
			title: 'levels.rect-8x8-ring.title',
			description: 'levels.rect-8x8-ring.description',
		},
		'rect-8x8-notched': {
			title: 'levels.rect-8x8-notched.title',
			description: 'levels.rect-8x8-notched.description',
		},
		'silhouette-cross': {
			title: 'levels.silhouette-cross.title',
			description: 'levels.silhouette-cross.description',
		},
		'silhouette-staircase': {
			title: 'levels.silhouette-staircase.title',
			description: 'levels.silhouette-staircase.description',
		},
		'silhouette-archway': {
			title: 'levels.silhouette-archway.title',
			description: 'levels.silhouette-archway.description',
		},
	},
} as const;

export type PentominoesSchema = typeof pentominoesSchema;
export type PentominoesTranslationContract = SchemaToTranslationContract<PentominoesSchema>;
