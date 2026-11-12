import type { StarBattleTranslationContract } from '../../schemas/star-battle.schema.js';

export const deStarBattle = {
	title: 'Sternenschlacht',
	description:
		'Platziere neutrale Sterne so, dass jede Zeile, Spalte und Farbzone genau einen Stern enthält, ohne sich zu berühren.',
	difficulty: {
		label: 'Schwierigkeitsgrad',
		easy: 'Einfach',
		easyDesc: '6×6 Gitter mit 6 Zonen und 6 Sternen.',
		medium: 'Mittel',
		mediumDesc: '8×8 Gitter mit 8 Zonen und 8 Sternen.',
		hard: 'Schwer',
		hardDesc: '10×10 Gitter mit 10 Zonen und 10 Sternen.',
		expert: 'Experte',
		expertDesc: '12×12 Gitter mit 12 Zonen und 12 Sternen.',
	},
	levels: {
		puzzle: 'Rätsel',
		puzzleNum: 'Rätsel {{number}}',
		selectLevel: 'Rätsel auswählen',
		completed: 'Gelöst',
		notCompleted: 'Nicht gelöst',
		bestTime: 'Bestzeit: {{time}}',
		quickPlay: 'Schnellstart',
		quickPlayDesc: 'Neues Spielfeld generieren',
	},
	mode: {
		label: 'Eingabemodus',
		mark: 'Markierungsmodus',
		markDesc: 'Setze und entferne X-Markierungen zum Eliminieren',
		token: 'Sternenmodus',
		tokenDesc: 'Setze und entferne Stern-Marker',
	},
	controls: {
		undo: 'Rückgängig',
		redo: 'Wiederholen',
		autoCross: 'Auto-Kreuz',
		autoCrossDesc:
			'Setzt beim Platzieren eines Sterns automatisch X-Markierungen in Zeile, Spalte und Nachbarfeldern',
		pause: 'Pause',
		resume: 'Fortsetzen',
		restart: 'Neu starten',
		play: 'Spielen',
		nextPuzzle: 'Nächstes Rätsel',
		backToLobby: 'Lobby',
	},
	settings: {
		title: 'Spieleinstellungen',
		gameplayTab: 'Spielablauf',
		siteTab: 'Präferenzen',
		autoCross: {
			label: 'Auto-Kreuz Assistent',
			description: 'Platziert beim Setzen eines Sterns automatisch X-Markierungen um den Stern herum.',
		},
		colorScheme: 'Erscheinungsbild',
		language: 'Sprache',
	},
	status: {
		paused: 'Spiel pausiert',
		pausedDescription: 'Dein Spielfortschritt und Timer sind sicher pausiert.',
		timer: 'Verstrichene Zeit',
		time: 'Zeit',
		bestTime: 'Bestzeit',
		newBestTime: 'Neue Bestzeit!',
		tokensPlaced: '{{current}} von {{total}} Sternen platziert',
	},
	conflicts: {
		row: 'Zeilenkonflikt: Mehrere Sterne in dieser Zeile',
		col: 'Spaltenkonflikt: Mehrere Sterne in dieser Spalte',
		region: 'Zonenkonflikt: Mehrere Sterne in dieser Farbzone',
		adjacency: 'Abstandskonflikt: Sterne dürfen sich horizontal, vertikal und diagonal nicht berühren',
	},
	victory: {
		title: 'Rätsel gelöst!',
		congratulations: 'Hervorragende Deduktion! Alle Sterne sind ohne Regelverletzungen platziert.',
		playAgain: 'Nochmal spielen',
		nextLevel: 'Nächstes Rätsel',
	},
	aria: {
		board: 'Sternenschlacht Spielfeld {{size}} mal {{size}}',
		instructions:
			'Mit den Pfeiltasten über das Spielfeld navigieren. Leertaste oder Eingabetaste zum Umschalten. X für Markierung, S, C oder Q für Stern, Rücktaste zum Leeren, Z zum Rückgängigmachen, Y zum Wiederholen und Escape für Pause.',
		cell: 'Zeile {{row}}, Spalte {{col}}, Zone {{region}}',
		cellEmpty: 'leer',
		cellMarked: 'mit X markiert',
		cellToken: 'enthält Stern',
		conflictNotice: 'Regelkonflikt: {{reason}}',
		headerToolbar: 'Steuerungsleiste',
	},
	navigation: {
		rules: 'Regeln',
		lobby: 'Lobby',
	},
} as const satisfies StarBattleTranslationContract;

export const deQueens = deStarBattle;
