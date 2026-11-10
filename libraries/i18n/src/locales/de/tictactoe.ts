import type { TicTacToeTranslationContract } from '../../schemas/tictactoe.schema.js';

export const deTicTacToe: TicTacToeTranslationContract = {
	title: 'Tic-Tac-Toe',
	subtitle: 'Klassisches 3x3-Duell aus Strategie, Zeichen und Reihenbildung.',
	description:
		'Fordere eine andere Person im lokalen Pass-and-Play Tic-Tac-Toe heraus. Bilde eine Dreierreihe aus X oder O waagerecht, senkrecht oder diagonal.',
	playButton: 'Tic-Tac-Toe spielen',
	difficulty: {
		standard: 'Klassisch 3×3',
		standardDesc: 'Standardmäßiges 3×3-Gitter mit abwechselndem Eröffnungszug',
	},
	lobby: {
		title: 'Tic-Tac-Toe',
		subtitle: 'Wähle deinen Spielmodus und passe die Spielernamen an.',
		modeSelect: 'Spielmodus wählen',
		passAndPlay: 'Pass & Play (Lokal)',
		passAndPlayDesc: 'Gemeinsam an einem Bildschirm spielen – blitzschnell und offline.',
		playOnline: 'Online spielen',
		playOnlineDesc: 'Freunde per Einladungslink oder Raumcode herausfordern.',
		comingSoon: 'Demnächst verfügbar',
		player1Label: 'Spieler 1 (X)',
		player2Label: 'Spieler 2 (O)',
		player1Default: 'Spieler 1',
		player2Default: 'Spieler 2',
		startGame: 'Spiel starten',
	},
	game: {
		turn: '{{name}} ist am Zug ({{mark}})',
		winner: '{{name}} gewinnt!',
		draw: 'Unentschieden!',
		boardLabel: 'Tic-Tac-Toe 3x3 Spielfeld',
		cellLabel: 'Zeile {{row}}, Spalte {{col}}: {{mark}}',
		emptyCell: 'Leer',
		playAgain: 'Nochmal spielen',
		backToMenu: 'Zurück zum Menü',
		startingTurnInfo: 'Das Eröffnungszeichen wechselt nach jedem Durchgang.',
	},
	victory: {
		title: 'Spiel beendet',
		winnerWins: 'Herzlichen Glückwunsch {{name}}, du hast die Runde gewonnen!',
		drawTitle: 'Unentschieden',
		drawDescription: 'Beide Seiten haben souverän bis zum Gleichstand gespielt.',
		playAgain: 'Nochmal spielen',
		backToMenu: 'Zurück zum Menü',
	},
	controls: {
		undo: 'Rückgängig',
		restart: 'Spiel neustarten',
		rules: 'Regeln',
		settings: 'Einstellungen',
		backToLobby: 'Zurück zum Menü',
		keyboardHint: 'Mit den Pfeiltasten über das Gitter bewegen, mit Leertaste oder Eingabetaste setzen.',
	},
	settings: {
		title: 'Tic-Tac-Toe Einstellungen',
		highlightWinningLine: {
			label: 'Gewinnerlinie hervorheben',
			description: 'Hebt die siegreiche Dreierreihe optisch hervor.',
		},
		showCellCoordinates: {
			label: 'Koordinaten anzeigen',
			description: 'Zeigt Zeilen- und Spaltenhinweise auf den Spielfeldern an.',
		},
	},
};
