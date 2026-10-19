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
		first_victory: {
			title: 'Erster Sieg',
			desc: 'Gewinne dein erstes Sudoku-Spiel auf einer beliebigen Schwierigkeitsstufe.',
		},
		streak: {
			title: 'Siegesserie',
			desc: 'Erziele aufeinanderfolgende Siege: Bronze bei 3, Silber bei 5 und Gold bei 10 Spielen.',
		},
		campaign_foundations: {
			title: 'Grundlagen-Kampagne',
			desc: 'Meistere kuratierte Rätsel: Bronze für alle 6 leichten, Silber für alle 6 mittleren, Gold für alle 12 ohne Hinweise.',
		},
		campaign_gauntlet: {
			title: 'Spießrutenlauf-Kampagne',
			desc: 'Bezwinge schwere kuratierte Rätsel: Bronze für beliebige 3 schwere, Silber für alle 6 schweren, Gold für alle 6 sehr schweren.',
		},
		speed_demon: {
			title: 'Geschwindigkeitsteufel',
			desc: 'Löse ein Sudoku-Rätsel auf Stufe Mittel oder höher in unter 3 Minuten.',
		},
		flawless_logic: {
			title: 'Fehlerfreie Logik',
			desc: 'Löse ein Sudoku auf Stufe Schwer oder höher ohne Fehler und ohne Hinweise.',
		},
		beyond_mortal: {
			title: 'Übermenschlich',
			desc: 'Löse ein Sudoku-Rätsel auf der Stufe Insane oder Inhuman.',
		},
		living_on_edge: {
			title: 'Am seidenen Faden',
			desc: 'Gewinne ein Spiel mit genau 2 Fehlern – haarscharf am Scheitern vorbei.',
		},
		participation: {
			title: 'Teilnehmermedaille',
			desc: 'Löse ein beliebiges Rätsel auf einer beliebigen Stufe. Du hast es geschafft!',
		},
		old_college_try: {
			title: 'Hauptsache versucht',
			desc: 'Erleide deine erste Niederlage. Du hast es versucht, und das zählt.',
		},
		speedrun_failure: {
			title: 'Speedrun ins Verderben',
			desc: 'Scheitere und verliere ein Spiel in unter 20 Sekunden.',
		},
		analysis_paralysis: {
			title: 'Paralyse durch Analyse',
			desc: 'Verbringe über 20 Minuten mit einem leichten Rätsel. Doppelt genäht hält besser.',
		},
		are_you_sure: {
			title: 'Bist du dir da sicher?',
			desc: 'Mache in einer einzigen Partie 10 Züge hintereinander rückgängig.',
		},
		living_on_prayer: {
			title: 'Auf gut Glück',
			desc: 'Mache zwei Fehler in der ersten Minute und hole trotzdem noch den Sieg.',
		},
		pencil_pusher: {
			title: 'Notizenmeister',
			desc: 'Setze 60 Notizen, bevor du deine erste feste Zahl einträgst.',
		},
		surgical_precision: {
			title: 'Chirurgische Präzision',
			desc: 'Löse ein schweres oder höheres Rätsel ganz ohne Notizen, Hinweise und Fehler.',
		},
		insomnia: {
			title: 'Schlaflos-Spezial',
			desc: 'Schließe ein Rätsel zwischen 2:00 Uhr und 4:00 Uhr morgens ab.',
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
