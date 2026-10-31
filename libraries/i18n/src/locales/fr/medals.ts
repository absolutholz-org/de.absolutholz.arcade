import type { MedalsTranslationContract } from '../../schemas/medals.schema.js';

export const frMedals = {
	showcase: {
		title: 'Vitrine des médailles',
		description: 'Suivez vos trophées, vos succès personnels et votre progression.',
		trophiesSummary: 'Collection de Trophées',
		allGames: 'Tous les Jeux',
		games: {
			sudoku: 'Sudoku',
			nonogram: 'Nonogramme',
			minesweeper: 'Démineur',
			queens: 'Queens',
			tracks: 'Tracks',
			watersort: 'Water Sort',
			bridges: 'Ponts',
			anagram: 'Anagram Scramble',
			tents: 'Tentes',
			untangle: 'Démêler',
		},
		status: {
			unlocked: 'Débloqué',
			locked: 'Verrouillé',
			unlockedOn: 'Débloqué le {{date}}',
			progress: 'Progression : {{current}} / {{target}} ({{percent}}%)',
		},
		tiers: {
			gold: 'Or',
			silver: 'Argent',
			bronze: 'Bronze',
		},
		empty: 'Aucune médaille trouvée pour ce filtre.',
		widget: {
			bannerTitle: 'Votre collection de trophées',
			guestTitle: 'Vitrine des médailles',
			guestDescription:
				'Franchissez des étapes clés, suivez votre progression et remportez des trophées sur tous les jeux.',
			viewShowcase: 'Voir la vitrine',
		},
	},
	sudoku: {
		first_victory: {
			title: 'Première Victoire',
			desc: 'Gagnez votre première partie de Sudoku dans n’importe quelle difficulté.',
		},
		streak: {
			title: 'Série de Victoires',
			desc: 'Enchaînez les victoires consécutives : Bronze à 3, Argent à 5 et Or à 10 parties.',
		},
		campaign_foundations: {
			title: 'Campagne Fondations',
			desc: 'Maîtrisez les grilles sélectionnées : Bronze pour les 6 Faciles, Argent pour les 6 Moyennes, Or pour les 12 sans aucun indice.',
		},
		campaign_gauntlet: {
			title: 'Campagne du Défi',
			desc: 'Triomphez des grilles avancées : Bronze pour 3 Difficiles, Argent pour les 6 Difficiles, Or pour les 6 Très Difficiles.',
		},
		speed_demon: {
			title: 'Éclair de Génie',
			desc: 'Résolvez un Sudoku en moins de 3 minutes en difficulté Moyenne ou supérieure.',
		},
		flawless_logic: {
			title: 'Logique Impeccable',
			desc: 'Complétez un Sudoku en difficulté Difficile ou supérieure sans faute et sans indice.',
		},
		beyond_mortal: {
			title: 'Au-Delà du Mortel',
			desc: 'Résolvez une grille en difficulté Dément ou Surhumain.',
		},
		living_on_edge: {
			title: 'Sur le Fil du Rasoir',
			desc: 'Gagnez une partie avec exactement 2 erreurs, à un faux pas de la défaite.',
		},
		participation: {
			title: 'Médaille de Participation',
			desc: 'Résolvez une grille dans n’importe quelle difficulté. Vous l’avez fait !',
		},
		old_college_try: {
			title: 'Le Bel Effort',
			desc: 'Subissez votre première défaite. Vous avez essayé, et c’est ce qui compte.',
		},
		speedrun_failure: {
			title: 'Échec Chrono',
			desc: 'Faites trois fautes et perdez une partie en moins de 20 secondes.',
		},
		analysis_paralysis: {
			title: 'Paralysie par Analyse',
			desc: 'Passez plus de 20 minutes sur une grille Facile. Réfléchir deux fois avant d’agir.',
		},
		are_you_sure: {
			title: 'Tu es Vraiment Sûr ?',
			desc: 'Annulez vos coups 10 fois de suite au cours d’une même partie.',
		},
		living_on_prayer: {
			title: 'Miraculé',
			desc: 'Commettez deux erreurs dès la première minute et triomphez quand même.',
		},
		pencil_pusher: {
			title: 'Gribouilleur Compulsif',
			desc: 'Posez 60 notes de candidats avant d’inscrire votre premier chiffre confirmé.',
		},
		surgical_precision: {
			title: 'Précision Chirurgicale',
			desc: 'Résolvez une grille Difficile ou plus sans notes, sans indices et sans faute.',
		},
		insomnia: {
			title: 'Spécial Nuit Blanche',
			desc: 'Complétez une grille entre 2h00 et 4h00 du matin.',
		},
	},
	nonogram: {
		first_brushstroke: {
			title: 'Premier coup de pinceau',
			desc: 'Résolvez votre tout premier casse-tête illustré.',
		},
		gallery: {
			title: 'La Galerie',
			desc: 'Terminez des puzzles sélectionnés dans les collections Facile, Moyen et Difficile.',
		},
		artist: {
			title: 'Artiste du pixel',
			desc: 'Résolvez des puzzles et remplissez votre galerie à vie.',
		},
		streak: {
			title: 'Ligne ininterrompue',
			desc: 'Enchaînez des séries de victoires sans commettre d’erreur éliminatoire.',
		},
		speed_easy: {
			title: 'Croqueur rapide',
			desc: 'Résolvez une grille 5x5 en moins de 20 secondes.',
		},
		speed_hard: {
			title: 'Grand muraliste',
			desc: 'Résolvez une grille 15x15 en moins de 3 minutes.',
		},
		direct_painter: {
			title: 'Peintre direct',
			desc: 'Complétez une image 10x10 ou 15x15 sans placer une seule croix.',
		},
		flawless_canvas: {
			title: 'Toile immaculée',
			desc: 'Terminez une grille 15x15 sans aucune faute et sans indice.',
		},
		college_try: {
			title: 'Le bel essai',
			desc: 'Subissez votre premier échec. Tout artiste a ses brouillons.',
		},
		speedrun_ruin: {
			title: 'Course à la ruine',
			desc: 'Perdez une partie en moins de 15 secondes.',
		},
		abstract: {
			title: 'Expressionnisme abstrait',
			desc: 'Remplissez plus des trois quarts de la grille avant de perdre.',
		},
		playing_safe: {
			title: 'Prudence avant tout',
			desc: 'Placez 15 croix avant de remplir un seul pixel.',
		},
		indecisive: {
			title: 'Peintre indécis',
			desc: 'Changez d’avis cinq fois sur la même case au cours d’une manche.',
		},
	},
	minesweeper: {
		clearance_initiated: {
			title: 'Déminage initié',
			desc: 'Gagnez votre première partie de Démineur.',
		},
		veteran: {
			title: 'Vétéran du champ de mines',
			desc: 'Cumulez les victoires : Bronze à 5, Argent à 25 et Or à 100 parties.',
		},
		tour: {
			title: 'Tour des champs de mines',
			desc: 'Domptez des grilles plus vastes : Bronze sur Petite+, Argent sur Grande (Difficile+), Or sur Très Grande (Expert).',
		},
		streak: {
			title: 'Série de désamorçage',
			desc: 'Enchaînez les victoires : Bronze à 3, Argent à 5 (Moyen+) et Or à 10 (Moyen+).',
		},
		flagless: {
			title: 'Regarde maman, sans les drapeaux !',
			desc: 'Gagnez une partie sur Moyen, Grand ou Très Grand sans poser le moindre drapeau.',
		},
		speed_small: {
			title: 'Balayeur éclair',
			desc: 'Terminez une Petite grille en Moyen en 15 secondes ou moins.',
		},
		expert_gold: {
			title: "Démineur d'élite",
			desc: 'Terminez une Très Grande grille en Expert en 90 secondes ou moins.',
		},
		college_try: {
			title: "Le coup d'essai",
			desc: 'Faites sauter une mine et subissez votre première défaite. Au moins, vous avez essayé !',
		},
		speedrun_failure: {
			title: 'Premier pas fracassant',
			desc: 'Déclenchez une mine dans les 3 secondes suivant le départ.',
		},
		chord_master: {
			title: 'Maître du Chording',
			desc: 'Gagnez une partie en effectuant au moins 15 accords.',
		},
		the_ocho: {
			title: 'Le huit mythique',
			desc: 'Révélez une case avec le chiffre 8 et désamorcez le plateau.',
		},
		mine_magnet: {
			title: 'Aimant à mines',
			desc: "Sautez sur une mine 5 parties d'affilée. Une petite pause s'impose ?",
		},
		great_cascade: {
			title: 'La grande cascade',
			desc: "Déclenchez une réaction en chaîne dégageant au moins 20 cases d'un seul clic.",
		},
		flag_hoarder: {
			title: 'Collectionneur de drapeaux',
			desc: 'Posez des drapeaux sur 150 % du total réel des mines. Deux précautions valent mieux qu’une !',
		},
		marathon: {
			title: 'Mains sûres',
			desc: "Cumul de terrain sécurisé nettoyé sur l'ensemble de vos déminages.",
		},
		corner_to_corner: {
			title: "D'un coin à l'autre",
			desc: 'Ouvrez les quatre coins lors de vos quatre premiers coups sur un grand plateau et gagnez.',
		},
		bomb_technician: {
			title: 'Technicien démineur',
			desc: 'Terminez un champ de mines Très Grand en Expert sans le moindre drapeau mal placé.',
		},
		first_clear: {
			title: 'Déminage Réussi',
			desc: 'Gagnez votre première partie de Démineur.',
		},
		demolition_expert: {
			title: 'Expert en Démolition',
			desc: 'Terminez un champ de mines en difficulté Expert.',
		},
	},
	queens: {
		royal_placement: {
			title: 'Placement royal',
			desc: 'Couronnez votre tout premier royaume.',
		},
		reign_supreme: {
			title: 'Règne suprême',
			desc: 'Bâtissez une dynastie tout au long de votre carrière de joueur.',
		},
		coronation_tour: {
			title: 'Tournée de couronnement',
			desc: 'Terminez les campagnes sélectionnées pour toutes les tailles de royaume.',
		},
		succession_streak: {
			title: 'Succession royale',
			desc: 'Maintenez des séries de victoires ininterrompues dans des royaumes ardus.',
		},
		speed_easy: {
			title: 'Couronnement éclair',
			desc: 'Résolvez un royaume 6x6 en moins de 20 secondes.',
		},
		speed_expert: {
			title: 'Grand souverain',
			desc: 'Résolvez un royaume Expert 12x12 en moins de 2 minutes.',
		},
		blind_faith: {
			title: 'Foi aveugle',
			desc: 'Terminez un plateau 8x8 ou plus grand sans placer une seule marque X.',
		},
		coup_detat: {
			title: "Coup d'État",
			desc: 'Placez chaque couronne avec une précision absolue sans aucun conflit ni retrait.',
		},
		college_try: {
			title: 'Bel essai',
			desc: 'Subissez votre première défaite à la cour royale.',
		},
		civil_war: {
			title: 'Guerre civile',
			desc: 'Placez deux reines qui se menacent mutuellement.',
		},
		abdication: {
			title: 'Abdication',
			desc: 'Capitulez dans un royaume après avoir placé plus de la moitié des couronnes royales.',
		},
		paranoid_monarch: {
			title: 'Monarque paranoïaque',
			desc: 'Remplissez plus de 80 % du royaume avec des marques X avant de placer votre première couronne.',
		},
		royal_indecision: {
			title: 'Indécision royale',
			desc: 'Placez et retirez une couronne de la même case quatre fois.',
		},
		first_win: {
			title: 'Placement Royal',
			desc: 'Résolvez votre première grille de Queens.',
		},
		reign: {
			title: 'Règne Suprême',
			desc: 'Résolvez 15 grilles de Queens.',
		},
	},
	watersort: {
		chemist_ladder: {
			title: 'Technicien de labo',
			desc: 'Résolvez des supports d’éprouvettes au cours de votre carrière (5 / 25 / 100).',
		},
		perfect_ladder: {
			title: 'Chimiste de précision',
			desc: 'Gagnez des casse-têtes sans utiliser d’annulation (3 / 10 / 25).',
		},
		first_sort: {
			title: 'Première réaction',
			desc: 'Résolvez votre premier casse-tête.',
		},
		medium_clear: {
			title: 'Chimie intermédiaire',
			desc: 'Terminez 5 casse-têtes Moyen.',
		},
		hard_clear: {
			title: 'Chromatographie',
			desc: 'Terminez 5 casse-têtes Difficile.',
		},
		expert_clear: {
			title: 'Grand alchimiste',
			desc: 'Terminez votre premier casse-tête Expert.',
		},
		master_suite: {
			title: 'Maître des éléments',
			desc: 'Terminez au moins un casse-tête dans les 4 niveaux de difficulté.',
		},
		speed_pourer: {
			title: 'Versement éclair',
			desc: 'Résolvez n’importe quel casse-tête en moins de 45 secondes.',
		},
		blitz_chemist: {
			title: 'Titrage rapide',
			desc: 'Résolvez un casse-tête Moyen en moins de 30 secondes.',
		},
		expert_speed: {
			title: 'Vélocité calculée',
			desc: 'Résolvez un casse-tête Difficile en moins de 60 secondes.',
		},
		par_perfection: {
			title: 'Zéro déchet',
			desc: 'Terminez un casse-tête Moyen ou Difficile au Par ou en dessous.',
		},
		theoretical_limit: {
			title: 'Limite théorique',
			desc: 'Terminez un casse-tête Expert en 34 coups ou moins.',
		},
		flawless: {
			title: 'Mains propres',
			desc: 'Résolvez n’importe quel casse-tête sans utiliser Annuler ni Indice.',
		},
		comeback_kid: {
			title: 'Récupération chimique',
			desc: 'Gagnez un casse-tête après avoir utilisé 6+ annulations sans recommencer.',
		},
		color_cascade: {
			title: 'Synthèse arc-en-ciel',
			desc: 'Complétez 4 éprouvettes monochromes en des coups consécutifs.',
		},
		single_buffer: {
			title: 'Marges étroites',
			desc: 'Gagnez un casse-tête en n’utilisant qu’une seule éprouvette vide comme tampon.',
		},
	},
	tracks: {
		first_departure: {
			title: 'Premier départ',
			desc: 'Posez votre première voie ferrée fonctionnelle.',
		},
		transcontinental: {
			title: 'Transcontinental',
			desc: 'Posez des lignes de chemin de fer tout au long de votre carrière.',
		},
		grand_line: {
			title: 'Grand Line',
			desc: 'Terminez les réseaux ferroviaires de campagne à travers toutes les difficultés.',
		},
		express_service: {
			title: 'Service express',
			desc: 'Maintenez une série ininterrompue de livraisons ponctuelles.',
		},
		bullet_train: {
			title: 'Train à grande vitesse',
			desc: 'Posez une ligne de chemin de fer 6x6 en moins de 30 secondes.',
		},
		trans_siberian: {
			title: 'Transsibérien Express',
			desc: 'Connectez un itinéraire Expert 10x10 en moins de 3 minutes.',
		},
		direct_line: {
			title: 'Ligne directe',
			desc: 'Terminez un plateau de 8x8 ou plus sans placer la moindre tuile marqueur.',
		},
		smooth_rail: {
			title: 'Voie parfaite',
			desc: 'Terminez un plateau Difficile ou Expert sans effacer un seul morceau de voie.',
		},
		college_try: {
			title: 'Beau joueur',
			desc: 'Subissez votre premier abandon ferroviaire.',
		},
		derailment: {
			title: 'Déraillement',
			desc: 'Dirigez une voie directement dans un mur de pierre.',
		},
		infinite_loop: {
			title: 'Boucle infinie',
			desc: 'Construisez une voie ferrée qui tourne simplement en rond.',
		},
		wrong_way: {
			title: 'À contresens',
			desc: 'Posez votre voie à reculons depuis la porte de sortie.',
		},
		signal_failure: {
			title: 'Panne de signalisation',
			desc: 'Dépassez le nombre de voies autorisé sur trois rangées ou colonnes à la fois.',
		},
		indecisive_conductor: {
			title: 'Conducteur indécis',
			desc: 'Réorientez la voie sur la même case cinq fois.',
		},
	},
	bridges: {
		first_span: {
			title: 'Première travée',
			desc: 'Connectez votre tout premier réseau d’îles.',
		},
		archipelago: {
			title: 'Architecte d’archipel',
			desc: 'Complétez les réseaux de ponts sélectionnés sur toutes les tailles de grille.',
		},
		builder: {
			title: 'Maître bâtisseur',
			desc: 'Construisez des ponts et reliez des îles tout au long de votre carrière.',
		},
		streak: {
			title: 'Transit ininterrompu',
			desc: 'Résolvez des grilles consécutives sans interrompre la liaison.',
		},
		speed_beginner: {
			title: 'Transit rapide',
			desc: 'Connectez une grille Débutant 6x6 en moins de 20 secondes.',
		},
		speed_expert: {
			title: 'Maître en génie civil',
			desc: 'Résolvez une grille Expert 18x18 en moins de 4 minutes.',
		},
		flawless_network: {
			title: 'Réseau sans faille',
			desc: 'Terminez une grille Difficile ou Expert sans démolir un seul pont.',
		},
		double_trouble: {
			title: 'Double peine',
			desc: 'Posez tous les ponts doubles avant de tracer le moindre pont simple.',
		},
		college_try: {
			title: 'Le bel essai',
			desc: 'Subissez votre premier échec de liaison.',
		},
		bridge_to_nowhere: {
			title: 'Pont vers nulle part',
			desc: 'Construisez une boucle isolée qui laisse le continent à l’abandon.',
		},
		traffic_jam: {
			title: 'Embouteillage',
			desc: 'Tentez de tracer des ponts sécants à cinq reprises en une seule partie.',
		},
		indecisive_engineer: {
			title: 'Ingénieur indécis',
			desc: 'Basculez six fois de suite la connexion entre deux îles.',
		},
		speedrun_collapse: {
			title: 'Effondrement éclair',
			desc: 'Abandonnez ou effondrez un chantier de pont en moins de 10 secondes.',
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
			title: 'Apprenti Polyglotte',
			desc: 'Résolvez au moins un puzzle dans deux langues différentes.',
		},
		polyglot_trio: {
			title: 'Trio Linguistique',
			desc: 'Résolvez au moins un puzzle en anglais, allemand et portugais.',
		},
		tower_of_babel: {
			title: 'Tour de Babel',
			desc: 'Résolvez des puzzles dans des vocabulaires secondaires.',
		},
		polyglot_expert: {
			title: 'Maître Interlinguistique',
			desc: 'Terminez un puzzle Expert dans deux langues différentes.',
		},
	},
	tents: {
		first_pitch: {
			title: 'Première tente',
			desc: 'Plantez votre toute première tente dans les bois.',
		},
		pristine_pitch: {
			title: 'Campement immaculé',
			desc: 'Terminez un puzzle Moyen, Difficile ou Expert sans aucune erreur.',
		},
		speed_camper: {
			title: 'Campeur éclair',
			desc: 'Terminez un campement Difficile ou Expert en 2 minutes ou moins.',
		},
		minimalist: {
			title: 'Minimaliste de la nature',
			desc: 'Terminez un puzzle sans poser une seule tuile d’herbe.',
		},
		master_camper: {
			title: 'Maître Campeur',
			desc: 'Accumulez des victoires de camping au fil de votre carrière.',
		},
		expedition_tour: {
			title: 'Tour d’expédition',
			desc: 'Maîtrisez des campements sélectionnés à travers tous les niveaux de difficulté.',
		},
		survivalist_streak: {
			title: 'Série de survie',
			desc: 'Maintenez une série de victoires ininterrompue en pleine nature.',
		},
		grand_outfitter: {
			title: 'Grand équipementier',
			desc: 'Plantez des tentes à côté des arbres tout au long de votre carrière de camping.',
		},
		glamping: {
			title: 'Glamping',
			desc: 'Remplissez chaque ligne et colonne complétée avec de l’herbe via l’herbe automatique.',
		},
		bear_encounter: {
			title: 'Rencontre avec un ours',
			desc: 'Survivez et gagnez après avoir provoqué au moins trois erreurs de tentes adjacentes simultanément.',
		},
		iron_will: {
			title: 'Volonté de fer',
			desc: 'Triomphez d’un campement Expert avec toutes les aides d’indices et d’erreurs désactivées.',
		},
		quick_pitch: {
			title: 'Montage éclair',
			desc: 'Plantez trois tentes dans les six premières secondes de votre arrivée au camp.',
		},
	},
	untangle: {
		first_win: {
			title: 'Premier nœud dénoué',
			desc: 'Démêlez votre tout premier graphe dans n’importe quelle difficulté.',
		},
		wins: {
			title: 'Maître du démêlage',
			desc: 'Résolvez des graphes emmêlés au fil de votre carrière (5 / 25 / 100).',
		},
		hard_wins: {
			title: 'Esprit gordien',
			desc: 'Démêlez des réseaux complexes en difficulté Difficile (3 / 15 / 50).',
		},
		streak: {
			title: 'Série sans nœuds',
			desc: 'Enchaînez les victoires consécutives sans interruption (3 / 7 / 15).',
		},
		speed_demon: {
			title: 'Démon de la vitesse',
			desc: 'Démêlez un puzzle Moyen ou Difficile en 45 secondes ou moins.',
		},
		no_undo: {
			title: 'Sans hésitation',
			desc: 'Terminez un puzzle Difficile sans utiliser Annuler.',
		},
	},
} as const satisfies MedalsTranslationContract;
