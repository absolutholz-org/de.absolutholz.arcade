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
			watersort: 'Water Sort',
			bridges: 'Brücken',
			anagram: 'Anagram Scramble',
			tents: 'Zelte',
			untangle: 'Entwirren',
			net: 'Net',
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
		royal_placement: {
			title: 'Königliche Platzierung',
			desc: 'Kröne dein allererstes Königreich.',
		},
		reign_supreme: {
			title: 'Oberste Herrschaft',
			desc: 'Errichte eine Dynastie im Laufe deiner Karriere als Rätsellöser.',
		},
		coronation_tour: {
			title: 'Krönungsreise',
			desc: 'Löse kuratierte Kampagnen über alle Reichgrößen hinweg.',
		},
		succession_streak: {
			title: 'Königliche Thronfolge',
			desc: 'Halte ungebrochene Siegesserien in kniffligen Reichen aufrecht.',
		},
		speed_easy: {
			title: 'Blitzkrönung',
			desc: 'Löse ein 6x6-Reich in unter 20 Sekunden.',
		},
		speed_expert: {
			title: 'Großer Herrscher',
			desc: 'Löse ein 12x12-Experten-Königreich in unter 2 Minuten.',
		},
		blind_faith: {
			title: 'Blindes Vertrauen',
			desc: 'Schließe ein Brett ab 8x8 ohne eine einzige X-Markierung ab.',
		},
		coup_detat: {
			title: 'Staatsstreich',
			desc: 'Platziere jede Krone mit absoluter Präzision ohne Konflikt oder Entfernen.',
		},
		college_try: {
			title: 'Aller Anfang ist schwer',
			desc: 'Erleide deine erste Niederlage am königlichen Hof.',
		},
		civil_war: {
			title: 'Bürgerkrieg',
			desc: 'Platziere zwei Damen, die sich gegenseitig bedrohen.',
		},
		abdication: {
			title: 'Abdankung',
			desc: 'Gib ein Reich auf, nachdem du mehr als die Hälfte der königlichen Kronen platziert hast.',
		},
		paranoid_monarch: {
			title: 'Paranoider Monarch',
			desc: 'Fülle über 80 % des Königreichs mit X-Markierungen, bevor du deine erste Krone setzt.',
		},
		royal_indecision: {
			title: 'Königliche Unentschlossenheit',
			desc: 'Platziere und entferne viermal eine Krone auf genau demselben Feld.',
		},
		first_win: {
			title: 'Königliche Platzierung',
			desc: 'Löse dein erstes Queens-Brett.',
		},
		reign: {
			title: 'Ewige Regentschaft',
			desc: 'Löse 15 Queens-Bretter.',
		},
	},
	watersort: {
		chemist_ladder: {
			title: 'Laborant',
			desc: 'Löse Reagenzglas-Gestelle im Laufe deiner Karriere (5 / 25 / 100).',
		},
		perfect_ladder: {
			title: 'Präzisions-Chemiker',
			desc: 'Gewinne Rätsel ohne Rückgängig zu nutzen (3 / 10 / 25).',
		},
		first_sort: {
			title: 'Erste Reaktion',
			desc: 'Löse dein erstes Rätsel.',
		},
		medium_clear: {
			title: 'Fortgeschrittene Chemie',
			desc: 'Schließe 5 Mittel-Rätsel ab.',
		},
		hard_clear: {
			title: 'Chromatographie',
			desc: 'Schließe 5 Schwer-Rätsel ab.',
		},
		expert_clear: {
			title: 'Groß-Alchemist',
			desc: 'Schließe dein erstes Experten-Rätsel ab.',
		},
		master_suite: {
			title: 'Meister der Elemente',
			desc: 'Löse mindestens ein Rätsel auf allen 4 Schwierigkeitsgraden.',
		},
		speed_pourer: {
			title: 'Blitz-Guss',
			desc: 'Löse ein beliebiges Rätsel in unter 45 Sekunden.',
		},
		blitz_chemist: {
			title: 'Schnelle Titration',
			desc: 'Löse ein Mittel-Rätsel in unter 30 Sekunden.',
		},
		expert_speed: {
			title: 'Berechnete Geschwindigkeit',
			desc: 'Löse ein Schwer-Rätsel in unter 60 Sekunden.',
		},
		par_perfection: {
			title: 'Null Ausschuss',
			desc: 'Schließe ein Mittel- oder Schwer-Rätsel mit oder unter Par-Zügen ab.',
		},
		theoretical_limit: {
			title: 'Theoretisches Limit',
			desc: 'Schließe ein Experten-Rätsel in 34 oder weniger Zügen ab.',
		},
		flawless: {
			title: 'Saubere Hände',
			desc: 'Löse ein beliebiges Rätsel ohne Rückgängig oder Hinweise.',
		},
		comeback_kid: {
			title: 'Chemische Rettung',
			desc: 'Gewinne ein Rätsel nach mindestens 6-mal Rückgängig ohne Neustart.',
		},
		color_cascade: {
			title: 'Regenbogen-Synthese',
			desc: 'Vervollständige 4 einfarbige Reagenzgläser in aufeinanderfolgenden Zügen.',
		},
		single_buffer: {
			title: 'Enge Margen',
			desc: 'Gewinne ein Rätsel, bei dem nur 1 leeres Glas als Puffer genutzt wurde.',
		},
	},
	tracks: {
		first_departure: {
			title: 'Erste Abfahrt',
			desc: 'Verlege deine erste funktionierende Eisenbahnstrecke.',
		},
		transcontinental: {
			title: 'Transkontinental',
			desc: 'Verlege im Laufe deiner Karriere unzählige Bahnstrecken.',
		},
		grand_line: {
			title: 'Grand Line',
			desc: 'Schließe handverlesene Schienennetze aller Schwierigkeitsgrade ab.',
		},
		express_service: {
			title: 'Expressdienst',
			desc: 'Halte eine ununterbrochene Serie pünktlicher Fahrten aufrecht.',
		},
		bullet_train: {
			title: 'Hochgeschwindigkeitszug',
			desc: 'Verlege eine 6x6-Strecke in unter 30 Sekunden.',
		},
		trans_siberian: {
			title: 'Transsibirische Eisenbahn',
			desc: 'Verbinde eine 10x10-Expertenstrecke in unter 3 Minuten.',
		},
		direct_line: {
			title: 'Direkte Verbindung',
			desc: 'Schließe ein Spielfeld ab 8x8 ab, ohne eine einzige Markierung zu setzen.',
		},
		smooth_rail: {
			title: 'Gleis ohne Makel',
			desc: 'Schließe ein Schwer- oder Experten-Spielfeld ab, ohne ein einziges Schienenteil zu löschen.',
		},
		college_try: {
			title: 'Aller Anfang ist schwer',
			desc: 'Erleide deine erste Streckenaufgabe.',
		},
		derailment: {
			title: 'Entgleisung',
			desc: 'Führe ein Gleis direkt gegen eine Steinmauer.',
		},
		infinite_loop: {
			title: 'Endlosschleife',
			desc: 'Baue ein Gleis, das sich endlos im Kreis dreht.',
		},
		wrong_way: {
			title: 'Falsche Richtung',
			desc: 'Verlege deine Schienen rückwärts ausgehend vom Ausfahrtstor.',
		},
		signal_failure: {
			title: 'Signalstörung',
			desc: 'Überschreite die erlaubte Schienenanzahl auf drei Zeilen oder Spalten gleichzeitig.',
		},
		indecisive_conductor: {
			title: 'Unentschlossener Schaffner',
			desc: 'Ändere die Gleisrichtung auf demselben Feld fünfmal.',
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
	anagram: {
		first_word: {
			title: 'First Word',
			desc: 'Find your very first word.',
		},
		full_rack: {
			title: 'Full Rack',
			desc: 'Use every tile in the rack to form a single word.',
		},
		speed_demon: {
			title: 'Speed Demon',
			desc: 'Win a timed round with at least 60 seconds left on the clock.',
		},
		perfectionist: {
			title: 'Perfectionist',
			desc: 'Find every single word in a round.',
		},
		round_champion: {
			title: 'Round Champion',
			desc: 'Win rounds across your anagram career.',
		},
		wordsmith: {
			title: 'Wordsmith',
			desc: 'Find words across all of your rounds.',
		},
		expert_scholar: {
			title: 'Expert Scholar',
			desc: 'Win rounds on Expert difficulty.',
		},
		hold_my_tiles: {
			title: 'Hold My Tiles',
			desc: 'Shuffle the rack 20 times in a single round.',
		},
		scrambled_egg: {
			title: 'Scrambled Egg',
			desc: 'Shuffle the rack three times within two seconds.',
		},
		cat_person: {
			title: 'Cat Person',
			desc: 'Find a word and its anagram partner in the same round, like "act" and "cat".',
		},
		silent_treatment: {
			title: 'Silent Treatment',
			desc: 'Win a Zen round without using Backspace or Escape.',
		},
		surrender_monkey: {
			title: 'Surrender Monkey',
			desc: 'Reveal the answers within 5 seconds of starting a round.',
		},
		last_second_hero: {
			title: 'Last-Second Hero',
			desc: 'Find the full-length word with one second or less on the clock.',
		},
		typo_tornado: {
			title: 'Typo Tornado',
			desc: 'Submit 10 invalid guesses in a single round.',
		},
		deja_vu: {
			title: 'Déjà Vu',
			desc: 'Submit an already-found word three times in one round.',
		},
		tiny_dictionary: {
			title: 'Tiny Dictionary',
			desc: 'Win an Easy round using only three-letter words plus the full-length word.',
		},
		sleeping_beauty: {
			title: 'Sleeping Beauty',
			desc: 'Pause a round for over 10 minutes, then still win it.',
		},
		polyglot_apprentice: {
			title: 'Polyglotter Lehrling',
			desc: 'Löse mindestens ein Rätsel in zwei verschiedenen Sprachen.',
		},
		polyglot_trio: {
			title: 'Sprachliches Trio',
			desc: 'Löse mindestens ein Rätsel auf Englisch, Deutsch und Portugiesisch.',
		},
		tower_of_babel: {
			title: 'Turm zu Babel',
			desc: 'Löse Rätsel in Fremdsprachen.',
		},
		polyglot_expert: {
			title: 'Meister der Sprachen',
			desc: 'Meistere ein Experten-Rätsel in zwei verschiedenen Sprachen.',
		},
	},
	tents: {
		first_pitch: {
			title: 'Erstes Zelt',
			desc: 'Schlage dein allererstes Zelt im Wald auf.',
		},
		pristine_pitch: {
			title: 'Makelloses Lager',
			desc: 'Löse ein mittleres, schweres oder Experten-Rätsel ohne einen einzigen Fehler.',
		},
		speed_camper: {
			title: 'Blitz-Camper',
			desc: 'Löse einen schweren oder Experten-Zeltplatz in 2 Minuten oder weniger.',
		},
		minimalist: {
			title: 'Natur-Minimalist',
			desc: 'Löse ein Rätsel, ohne ein einziges Grasfeld zu platzieren.',
		},
		master_camper: {
			title: 'Meister-Camper',
			desc: 'Sammle Siege auf dem Zeltplatz im Laufe deiner Karriere.',
		},
		expedition_tour: {
			title: 'Expeditions-Tour',
			desc: 'Meistere handverlesene Zeltplätze über alle Pfadschwierigkeiten hinweg.',
		},
		survivalist_streak: {
			title: 'Überlebenskünstler-Serie',
			desc: 'Halte eine ununterbrochene Siegesserie in der Wildnis aufrecht.',
		},
		grand_outfitter: {
			title: 'Großer Ausrüster',
			desc: 'Schlage im Laufe deiner Karriere Zelte neben Bäumen auf.',
		},
		glamping: {
			title: 'Glamping',
			desc: 'Fülle jede erfüllte Zeilen- und Spaltenlinie per Auto-Gras mit Gras.',
		},
		bear_encounter: {
			title: 'Bärenbegegnung',
			desc: 'Überlebe und siege, nachdem drei oder mehr sich berührende Zelte gleichzeitig Fehler ausgelöst haben.',
		},
		iron_will: {
			title: 'Eiserner Wille',
			desc: 'Meistere einen Experten-Zeltplatz mit komplett deaktivierten Hinweis- und Fehler-Hervorhebungen.',
		},
		quick_pitch: {
			title: 'Schnellaufbau',
			desc: 'Schlage drei Zelte innerhalb der ersten sechs Sekunden nach Ankunft im Lager auf.',
		},
	},
	untangle: {
		first_win: {
			title: 'Erster Knoten gelöst',
			desc: 'Entwirre dein allererstes Netzwerk auf einer beliebigen Schwierigkeitsstufe.',
		},
		wins: {
			title: 'Meister-Entwirrer',
			desc: 'Löse verflochtene Graphen im Laufe deiner Karriere (5 / 25 / 100).',
		},
		hard_wins: {
			title: 'Gordischer Löser',
			desc: 'Entwirre komplexe Netze auf der Schwierigkeitsstufe Schwer (3 / 15 / 50).',
		},
		streak: {
			title: 'Knotenfreie Serie',
			desc: 'Erziele aufeinanderfolgende Siege ohne Unterbrechung (3 / 7 / 15).',
		},
		speed_demon: {
			title: 'Geschwindigkeitsdämon',
			desc: 'Entwirre ein mittleres oder schweres Rätsel in 45 Sekunden oder weniger.',
		},
		no_undo: {
			title: 'Ohne Zweifel',
			desc: 'Löse ein schweres Rätsel, ohne Rückgängig zu verwenden.',
		},
	},
	net: {
		first_online: {
			title: 'Erstes Paket geroutet',
			desc: 'Verbinde jedes Terminal mit dem Hauptserver auf beliebiger Stufe.',
		},
		network_architect: {
			title: 'Netzwerk-Architekt',
			desc: 'Bringe vollständige Netze im Laufe deiner Karriere ans Netz (5 / 25 / 100).',
		},
		backbone_engineer: {
			title: 'Backbone-Ingenieur',
			desc: 'Verdrahte anspruchsvolle Netze auf Schwer oder Experte (3 / 15 / 50).',
		},
		speedy_packet: {
			title: 'Blitzschneller Ping',
			desc: 'Bringe ein einfaches Netzwerk in unter 30 Sekunden vollständig online.',
		},
		hyperscale: {
			title: 'Hyperscale-Infrastruktur',
			desc: 'Schließe ein schweres oder Experten-Netzwerk in unter 3 Minuten ab.',
		},
		packet_perfection: {
			title: 'Fehlerfreie Übertragung',
			desc: 'Löse ein Netzwerk auf Mittel, Schwer oder Experte ohne Rückgängig.',
		},
		hotline_streak: {
			title: 'Uptime-Champion',
			desc: 'Gewinne 3 aufeinanderfolgende Netzwerk-Puzzles in Folge.',
		},
	},
} as const satisfies MedalsTranslationContract;
