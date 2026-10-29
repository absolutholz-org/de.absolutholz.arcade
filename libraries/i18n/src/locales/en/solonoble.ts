import type { SoloNobleTranslationContract } from '../../schemas/solonoble.schema.js';

export const enSoloNoble: SoloNobleTranslationContract = {
	title: 'Solo Noble',
	description: 'The noble peg solitaire puzzle. Jump over pegs to clear the board until only one peg remains.',
	layouts: {
		label: 'Board Layout',
		english: 'Classic English (33)',
		european: 'European / French (37)',
		triangular: 'Triangular (15)',
		diamond: 'Diamond (41)',
		wiegleb: 'Wiegleb German (45)',
	},
	variants: {
		label: 'Gameplay Variant',
		classicCentral: 'Classic Central',
		classicCentralDesc: 'Finish with exactly 1 peg remaining in the center hole.',
		clearOut: 'Clear Out',
		clearOutDesc: 'Eliminate as many pegs as possible; win with 1 peg anywhere.',
		customStart: 'Custom Start',
		customStartDesc: 'Choose any starting hole to be empty.',
	},
	status: {
		ready: 'Select Empty Hole',
		readyInstruction: 'Click any hole to remove the first peg and begin the game.',
		playing: 'Playing',
		won: 'Noble Victory!',
		wonDesc: 'Masterful play! You solved the puzzle with 1 single peg remaining.',
		stuck: 'No Moves Left',
		stuckDesc: 'No further legal jumps exist. Reset to try again.',
	},
	stats: {
		pegsRemaining: 'Pegs Left',
		movesCount: 'Moves',
		bestPegs: 'Best Pegs',
		bestMoves: 'Best Moves',
	},
	controls: {
		undo: 'Undo',
		redo: 'Redo',
		reset: 'Reset',
		newGame: 'New Game',
		backToLobby: 'Back to Lobby',
	},
	settings: {
		title: 'Game Settings',
	},
};
