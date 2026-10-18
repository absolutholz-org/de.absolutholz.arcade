import type { MedalsTranslationContract } from '../../schemas/medals.schema.js';

export const deMedals = {
	showcase: {
		title: 'Medaillen-Vitrine',
		description: 'Verfolge deine Trophäen, persönlichen Erfolge und deinen Spielfortschritt.',
		trophiesSummary: 'Trophäensammlung',
		allGames: 'Alle Spiele',
		games: {
			sudoku: 'Sudoku',
			nonogram: 'Nonogramm',
			minesweeper: 'Minesweeper',
			queens: 'Queens',
			tracks: 'Tracks',
		},
		status: {
			unlocked: 'Freigeschaltet',
			locked: 'Gesperrt',
			unlockedOn: 'Freigeschaltet am {{date}}',
			progress: 'Fortschritt: {{current}} / {{target}} ({{percent}}%)',
		},
		tiers: {
			gold: 'Gold',
			silver: 'Silber',
			bronze: 'Bronze',
		},
		empty: 'Keine Medaillen für diesen Filter gefunden.',
		widget: {
			bannerTitle: 'Deine Trophäensammlung',
			guestTitle: 'Medaillen-Vitrine',
			guestDescription:
				'Meistere Puzzle-Meilensteine, verfolge deinen Fortschritt und verdiene Trophäen in allen Spielen.',
			viewShowcase: 'Vitrine öffnen',
		},
	},
	sudoku: {
		first_win: {
			title: 'Erster Sieg',
			desc: 'Gewinne dein erstes Sudoku-Spiel.',
		},
		win_streak_3: {
			title: 'Rätsel-Serie',
			desc: 'Gewinne 3 Sudoku-Spiele in Folge.',
		},
		expert_master: {
			title: 'Großmeister',
			desc: 'Gewinne 10 Sudoku-Spiele auf Schwierigkeitsstufe Experte.',
		},
		speed_demon: {
			title: 'Geschwindigkeitsteufel',
			desc: 'Löse ein Sudoku-Rätsel in unter 3 Minuten.',
		},
		flawless: {
			title: 'Fehlerfreie Logik',
			desc: 'Löse ein Sudoku-Rätsel ohne einen einzigen Fehler.',
		},
	},
	nonogram: {
		first_solve: {
			title: 'Erstes Bild',
			desc: 'Löse dein erstes Nonogramm-Rätsel.',
		},
		gallery_curator: {
			title: 'Galerie-Kurator',
			desc: 'Löse 5 verschiedene Nonogramm-Bilder.',
		},
		perfectionist: {
			title: 'Perfektionist',
			desc: 'Löse 10 Nonogramm-Rätsel fehlerfrei.',
		},
		swift_mind: {
			title: 'Scharfer Verstand',
			desc: 'Löse ein Nonogramm in unter 60 Sekunden.',
		},
	},
	minesweeper: {
		first_clear: {
			title: 'Minenräumung begonnen',
			desc: 'Gewinne dein erstes Minesweeper-Spiel.',
		},
		veteran: {
			title: 'Minenfeld-Veteran',
			desc: 'Gewinne 10 Minesweeper-Spiele.',
		},
		demolition_expert: {
			title: 'Sprengstoffexperte',
			desc: 'Räume ein Minenfeld auf Stufe Experte.',
		},
	},
	queens: {
		first_win: {
			title: 'Königliche Platzierung',
			desc: 'Löse dein erstes Queens-Brett.',
		},
		reign: {
			title: 'Ewige Regentschaft',
			desc: 'Löse 15 Queens-Bretter.',
		},
	},
	tracks: {
		first_departure: {
			title: 'Erste Abfahrt',
			desc: 'Schließe deine erste Zugstrecke ab.',
		},
		transcontinental: {
			title: 'Transkontinental',
			desc: 'Schließe 15 Zugstrecken ab.',
		},
	},
} as const satisfies MedalsTranslationContract;
