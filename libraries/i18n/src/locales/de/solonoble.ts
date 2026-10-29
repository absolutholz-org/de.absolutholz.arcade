import type { SoloNobleTranslationContract } from '../../schemas/solonoble.schema.js';

export const deSoloNoble: SoloNobleTranslationContract = {
	title: 'Solo Noble',
	description:
		'Das edle Solitair-Brettspiel. Überspringe Stifte, um das Brett zu leeren, bis nur ein einziger Stift übrig bleibt.',
	layouts: {
		label: 'Brettform',
		english: 'Klassisch Englisch (33)',
		european: 'Europäisch / Französisch (37)',
		triangular: 'Dreieckig (15)',
		diamond: 'Diamant (41)',
		wiegleb: 'Wiegleb Deutsch (45)',
	},
	variants: {
		label: 'Spielvariante',
		classicCentral: 'Klassisch Zentral',
		classicCentralDesc: 'Beende das Spiel mit genau 1 Stift im Zentrum.',
		clearOut: 'Abräumen',
		clearOutDesc: 'Entferne so viele Stifte wie möglich; Gewinn bei 1 Stift beliebig.',
		customStart: 'Freie Wahl',
		customStartDesc: 'Wähle ein beliebiges Loch für den ersten freien Platz.',
	},
	status: {
		ready: 'Startloch wählen',
		readyInstruction: 'Klicke auf ein beliebiges Loch, um den ersten Stift zu entfernen.',
		playing: 'Im Spiel',
		won: 'Edler Sieg!',
		wonDesc: 'Meisterhaft! Du hast das Rätsel mit nur einem verbleibenden Stift gelöst.',
		stuck: 'Keine Züge mehr',
		stuckDesc: 'Keine gültigen Sprünge mehr möglich. Starte neu, um es erneut zu versuchen.',
	},
	stats: {
		pegsRemaining: 'Stifte übrig',
		movesCount: 'Züge',
		bestPegs: 'Beste Stifte',
		bestMoves: 'Beste Züge',
	},
	controls: {
		undo: 'Rückgängig',
		redo: 'Wiederholen',
		reset: 'Zurücksetzen',
		newGame: 'Neues Spiel',
		backToLobby: 'Zurück zur Lobby',
	},
	settings: {
		title: 'Einstellungen',
	},
};
