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
		first_win: {
			title: 'Première Victoire',
			desc: 'Gagnez votre première partie de Sudoku.',
		},
		win_streak_3: {
			title: 'Série Gagnante',
			desc: 'Gagnez 3 parties de Sudoku consécutives.',
		},
		expert_master: {
			title: 'Grand Maître',
			desc: 'Gagnez 10 parties de Sudoku en difficulté Expert.',
		},
		speed_demon: {
			title: 'Éclair de Génie',
			desc: 'Résolvez un Sudoku en moins de 3 minutes.',
		},
		flawless: {
			title: 'Sans Faute',
			desc: 'Complétez un Sudoku sans commettre la moindre erreur.',
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
