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
		first_solve: {
			title: 'Première Révélation',
			desc: 'Résolvez votre premier puzzle d’image logique.',
		},
		gallery_curator: {
			title: 'Conservateur de Galerie',
			desc: 'Résolvez 5 puzzles de Nonogramme distincts.',
		},
		perfectionist: {
			title: 'Perfectionniste',
			desc: 'Résolvez 10 puzzles de Nonogramme sans erreur.',
		},
		swift_mind: {
			title: 'Esprit Vif',
			desc: 'Résolvez un Nonogramme en moins de 60 secondes.',
		},
	},
	minesweeper: {
		first_clear: {
			title: 'Déminage Réussi',
			desc: 'Gagnez votre première partie de Démineur.',
		},
		veteran: {
			title: 'Vétéran du Démineur',
			desc: 'Gagnez 10 parties de Démineur.',
		},
		demolition_expert: {
			title: 'Expert en Démolition',
			desc: 'Terminez un champ de mines en difficulté Expert.',
		},
	},
	queens: {
		first_win: {
			title: 'Placement Royal',
			desc: 'Résolvez votre première grille de Queens.',
		},
		reign: {
			title: 'Règne Suprême',
			desc: 'Résolvez 15 grilles de Queens.',
		},
	},
	tracks: {
		first_departure: {
			title: 'Premier Départ',
			desc: 'Complétez votre première voie ferrée.',
		},
		transcontinental: {
			title: 'Transcontinental',
			desc: 'Complétez 15 voies ferrées.',
		},
	},
} as const satisfies MedalsTranslationContract;
