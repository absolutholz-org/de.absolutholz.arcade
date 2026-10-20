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
			bridges: 'Brücken',
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
		first_brushstroke: {
			title: 'Erster Pinselstrich',
			desc: 'Löse dein allererstes Bilderrätsel.',
		},
		gallery: {
			title: 'Die Galerie',
			desc: 'Schließe kuratierte Rätsel in den Sammlungen Einfach, Mittel und Schwer ab.',
		},
		artist: {
			title: 'Pixelkünstler',
			desc: 'Löse Rätsel und fülle deine lebenslange Galerie.',
		},
		streak: {
			title: 'Durchgehende Linie',
			desc: 'Baue aufeinanderfolgende Siegesserien auf, ohne auszuscheiden.',
		},
		speed_easy: {
			title: 'Schnellzeichner',
			desc: 'Löse ein 5x5-Raster in unter 20 Sekunden.',
		},
		speed_hard: {
			title: 'Großmuralist',
			desc: 'Löse ein 15x15-Raster in unter 3 Minuten.',
		},
		direct_painter: {
			title: 'Direktmaler',
			desc: 'Vervollständige ein 10x10- oder 15x15-Bild, ohne ein einziges Kreuz zu setzen.',
		},
		flawless_canvas: {
			title: 'Makellose Leinwand',
			desc: 'Schließe ein 15x15-Raster ohne Fehler und ohne Hinweise ab.',
		},
		college_try: {
			title: 'Aller Anfang ist schwer',
			desc: 'Erleide dein erstes Ausscheiden. Jeder Künstler hat Skizzen verworfen.',
		},
		speedrun_ruin: {
			title: 'Speedrun ins Verderben',
			desc: 'Scheide in unter 15 Sekunden aus.',
		},
		abstract: {
			title: 'Abstrakter Expressionismus',
			desc: 'Fülle über drei Viertel des Spielfelds, bevor du verlierst.',
		},
		playing_safe: {
			title: 'Auf Nummer sicher',
			desc: 'Setze 15 Kreuze, bevor du ein einziges gefülltes Pixel platzierst.',
		},
		indecisive: {
			title: 'Unentschlossener Maler',
			desc: 'Ändere deine Meinung auf demselben Feld fünfmal in einer Runde.',
		},
	},
	minesweeper: {
		clearance_initiated: {
			title: 'Räumung eingeleitet',
			desc: 'Gewinne dein erstes Spiel Minesweeper.',
		},
		veteran: {
			title: 'Minenfeld-Veteran',
			desc: 'Erreiche Gesamtsiege: Bronze bei 5, Silber bei 25 und Gold bei 100 Spielen.',
		},
		tour: {
			title: 'Minenfeld-Tournee',
			desc: 'Meistere größere und schwerere Minenfelder: Bronze ab Klein, Silber auf Groß (Schwer+), Gold auf Extra Groß (Experte).',
		},
		streak: {
			title: 'Entschärfungsserie',
			desc: 'Erziele Siege in Serie: Bronze bei 3, Silber bei 5 (Mittel+) und Gold bei 10 (Mittel+).',
		},
		flagless: {
			title: 'Guck mal, ohne Flaggen!',
			desc: 'Gewinne eine Partie auf Mittel, Groß oder Extra Groß, ohne eine einzige Flagge zu setzen.',
		},
		speed_small: {
			title: 'Rascher Räumer',
			desc: 'Räume ein kleines Feld auf Mittlerer Stufe in höchstens 15 Sekunden ab.',
		},
		expert_gold: {
			title: 'Meister-Entschärfer',
			desc: 'Räume ein Extra Großes Feld auf Expertenstufe in höchstens 90 Sekunden ab.',
		},
		college_try: {
			title: 'Hauptsache probiert',
			desc: 'Tritt auf eine Mine und erleide deine erste Niederlage. Der Wille zählt!',
		},
		speedrun_failure: {
			title: 'Der erste Schritt tut weh',
			desc: 'Tritt innerhalb von 3 Sekunden nach Spielbeginn auf eine Mine.',
		},
		chord_master: {
			title: 'Akkord-Meister',
			desc: 'Gewinne eine Partie mit mindestens 15 Akkord-Klicks.',
		},
		the_ocho: {
			title: 'Die mythische Acht',
			desc: 'Decke ein Feld mit der Zahl 8 auf und entschärfe das Spielfeld.',
		},
		mine_magnet: {
			title: 'Minen-Magnet',
			desc: 'Tritt in 5 Spielen hintereinander auf eine Mine. Vielleicht mal kurz durchatmen?',
		},
		great_cascade: {
			title: 'Die große Kaskade',
			desc: 'Löse eine Kettenreaktion aus, die mit einem Klick 20 oder mehr Felder freilegt.',
		},
		flag_hoarder: {
			title: 'Flaggen-Hamster',
			desc: 'Setze Flaggen auf 150 % der tatsächlichen Minenanzahl. Sicher ist sicher!',
		},
		marathon: {
			title: 'Sichere Hände',
			desc: 'Insgesamt geräumte sichere Felder über alle Minenfelder hinweg.',
		},
		corner_to_corner: {
			title: 'Von Ecke zu Ecke',
			desc: 'Öffne auf einem großen Feld alle vier Ecken in deinen ersten vier Zügen und gewinne.',
		},
		bomb_technician: {
			title: 'Bombenentschärfer',
			desc: 'Räume ein Extra Großes Experten-Minenfeld ohne eine einzige falsch gesetzte Flagge ab.',
		},
		first_clear: {
			title: 'Minenräumung begonnen',
			desc: 'Gewinne dein erstes Minesweeper-Spiel.',
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
	bridges: {
		first_span: {
			title: 'Erste Brücke',
			desc: 'Verbinde dein allererstes Inselnetzwerk.',
		},
		archipelago: {
			title: 'Archipel-Architekt',
			desc: 'Meistere kuratierte Brückennetzwerke über alle Spielfeldgrößen.',
		},
		builder: {
			title: 'Baumeister',
			desc: 'Baue Brücken und verbinde Inseln im Laufe deiner Karriere.',
		},
		streak: {
			title: 'Unterbrechungsfreier Verkehr',
			desc: 'Löse aufeinanderfolgende Spielfelder, ohne eine Verbindung zu trennen.',
		},
		speed_beginner: {
			title: 'Schnellverbindung',
			desc: 'Verbinde ein 6x6-Anfänger-Feld in unter 20 Sekunden.',
		},
		speed_expert: {
			title: 'Meister des Ingenieurwesens',
			desc: 'Löse ein 18x18-Experten-Gitter in unter 4 Minuten.',
		},
		flawless_network: {
			title: 'Makelloses Netzwerk',
			desc: 'Schließe ein schweres oder Experten-Spielfeld ab, ohne eine einzige Brücke abzureißen.',
		},
		double_trouble: {
			title: 'Doppelt hält besser',
			desc: 'Errichte alle Doppelbrücken, bevor du eine einfache Brücke ziehst.',
		},
		college_try: {
			title: 'Ein guter Versuch',
			desc: 'Erlebe deine erste gescheiterte Verbindungslinie.',
		},
		bridge_to_nowhere: {
			title: 'Brücke ins Nirgendwo',
			desc: 'Baue eine isolierte Schleife, die das Festland abschneidet.',
		},
		traffic_jam: {
			title: 'Verkehrschaos',
			desc: 'Versuche fünfmal in einem Spiel, kreuzende Brücken zu bauen.',
		},
		indecisive_engineer: {
			title: 'Unentschlossener Ingenieur',
			desc: 'Schalte die Verbindung zwischen zwei Inseln sechsmal hin und her.',
		},
		speedrun_collapse: {
			title: 'Blitz-Einsturz',
			desc: 'Gib ein Brückenprojekt innerhalb von 10 Sekunden auf.',
		},
	},
} as const satisfies MedalsTranslationContract;
