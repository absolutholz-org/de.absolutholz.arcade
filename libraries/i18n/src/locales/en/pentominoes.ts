import type { PentominoesTranslationContract } from '../../schemas/pentominoes.schema.js';

export const enPentominoes: PentominoesTranslationContract = {
	title: 'Pentominoes',
	subtitle: 'Polyomino spatial packing puzzle',
	description: 'Fit polyomino tile pieces perfectly into defined geometric frames without overlaps or voids.',
	difficulty: {
		label: 'Difficulty',
		easy: 'Easy',
		easyDesc: 'Introductory 3–5 piece puzzle boards for quick spatial reasoning',
		medium: 'Medium',
		mediumDesc: 'Balanced 5–8 piece packing challenges with contoured frames',
		hard: 'Hard',
		hardDesc: 'Dense 8–10 piece frames requiring deep planning and rotation',
		expert: 'Expert',
		expertDesc: 'Grand 12-piece canonical packing challenges (60 tiles total)',
	},
	lobby: {
		title: 'Pentominoes Challenges',
		subtitle: 'Select a puzzle pack to begin packing polyominoes',
		selectDifficulty: 'Choose Difficulty Level',
		completed: 'Completed',
		quickPlay: 'Quick Play',
		quickPlayDesc: 'Jump directly into the next uncompleted challenge',
		selectLevel: 'Select Puzzle',
	},
	status: {
		placed: 'Pieces placed',
		moves: 'Moves',
		noneSelected: 'None selected',
		timer: 'Elapsed Time',
		time: 'Time',
		newBestTime: 'New Best Time!',
	},
	controls: {
		rotateCw: 'Rotate CW (90°)',
		rotateCcw: 'Rotate CCW (90°)',
		flipH: 'Flip Horizontal',
		returnToTray: 'Return to Tray',
		hint: 'Hint',
		undo: 'Undo',
		redo: 'Redo',
		backToLobby: 'Lobby',
		newGame: 'New Game',
		resume: 'Resume',
	},
	tray: {
		activePieceTitle: 'Active Piece',
		keyboardHint: 'Arrow keys: move cursor • Enter/Space: place piece • R: rotate • F: flip • Esc: deselect',
		pieceStatusAvailable: 'Available in tray',
		pieceStatusPlaced: 'Placed on board',
		pieceStatusSelected: 'Currently selected',
	},
	a11y: {
		boardLabel: 'Pentominoes Board',
		trayLabel: 'Polyomino Tray',
		cellEmpty: 'Row {{row}}, Column {{col}}, Empty',
		cellOccupied: 'Row {{row}}, Column {{col}}, Occupied by piece {{pieceId}}',
		cellVoid: 'Row {{row}}, Column {{col}}, Void cell outside boundary',
		puzzleSolved: 'Congratulations! All target pieces have been packed and the board is solved!',
		pickedUpFromTray: 'Selected piece {{pieceId}} from tray',
		returnedToTray: 'Returned piece {{pieceId}} to tray',
		rotatedPiece: 'Rotated piece {{pieceId}} to {{rotation}} degrees',
		flippedPiece: 'Flipped piece {{pieceId}}',
		placedPiece: 'Placed piece {{pieceId}} at row {{row}}, column {{col}}',
		invalidOutOfBounds: 'Cannot place piece {{pieceId}}: extends outside the board',
		invalidVoidCell: 'Cannot place piece {{pieceId}}: overlaps a void cell',
		invalidOverlap: 'Cannot place piece {{pieceId}}: overlaps an already placed piece',
		pickedUpFromBoard: 'Picked up piece {{pieceId}} from row {{row}}, column {{col}}',
		hintPlaced: 'Hint placed piece {{pieceId}} at row {{row}}, column {{col}}',
	},
	victory: {
		title: 'Puzzle Solved!',
		congratulations: 'Splendid spatial deduction! The frame has been packed perfectly.',
		playAgain: 'Play Again',
		nextPuzzle: 'Next Puzzle',
		viewLobby: 'Lobby',
	},
	settings: {
		title: 'Pentominoes Settings',
		showPieceLabels: 'Show Piece Labels',
		showPieceLabelsDescription: 'Display canonical letter designations directly on the center of placed tiles.',
		showSurfacePatterns: 'Tactile Patterns',
		showSurfacePatternsDescription: 'Render distinctive accessible hatch and dot patterns across piece surfaces.',
		highlightGhostValidity: 'Placement Preview',
		highlightGhostValidityDescription:
			'Highlight green or red valid/invalid silhouette previews as pieces hover over the board.',
		showGridCoordinates: 'Grid Coordinates',
		showGridCoordinatesDescription:
			'Display alphanumeric chess-style coordinate markers along the board boundaries.',
	},
	levels: {
		procedural: {
			title: 'Procedural Challenge',
			description: 'Algorithmic polyomino spatial packing configuration',
		},
		'rect-3x5': {
			title: '3×5 Rectangle',
			description: 'Introductory 3-pentomino packing puzzle',
		},
		'rect-4x5': {
			title: '4×5 Rectangle',
			description: 'Compact 4-pentomino rectangle',
		},
		'rect-5x5': {
			title: '5×5 Square',
			description: 'Classic 5-pentomino square frame',
		},
		'rect-5x6': {
			title: '5×6 Rectangle',
			description: 'Balanced 6-pentomino rectangular field',
		},
		'rect-5x7': {
			title: '5×7 Rectangle',
			description: 'Engaging 7-pentomino rectangular board',
		},
		'rect-5x8': {
			title: '5×8 Rectangle',
			description: 'Expansive 8-pentomino packing grid',
		},
		'rect-5x9': {
			title: '5×9 Rectangle',
			description: 'Challenging 9-pentomino rectangular layout',
		},
		'rect-5x10': {
			title: '5×10 Rectangle',
			description: 'Dense 10-pentomino spatial test',
		},
		'rect-5x11': {
			title: '5×11 Rectangle',
			description: 'Complex 11-pentomino board configuration',
		},
		'rect-5x12': {
			title: '5×12 Grand Rectangle',
			description: 'The monumental 12-pentomino 60-cell canonical challenge',
		},
		'rect-6x10': {
			title: '6×10 Grand Rectangle',
			description: 'Canonical 12-pentomino 6×10 packing board',
		},
		'rect-8x8-ring': {
			title: '8×8 Central Void',
			description: 'Full 12 pentominoes enclosing a central 2×2 square void',
		},
		'rect-8x8-notched': {
			title: '8×8 Notched Cross',
			description: 'Full 12 pentominoes framed with perimeter side notches',
		},
		'silhouette-cross': {
			title: 'Cruciform Silhouette',
			description: 'Symmetric cruciform contour packed with 5 pentominoes',
		},
		'silhouette-staircase': {
			title: 'Staircase Silhouette',
			description: 'Stepped pyramid contour requiring 6 polyomino pieces',
		},
		'silhouette-archway': {
			title: 'Archway Portal',
			description: 'Grand architectural archway filled with 7 polyominoes',
		},
	},
};
