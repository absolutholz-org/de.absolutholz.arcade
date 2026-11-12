import type { StarBattleTranslationContract } from '../../schemas/star-battle.schema.js';

export const frStarBattle = {
	title: "Bataille d'étoiles",
	description:
		'Placez des étoiles de manière à ce que chaque ligne, colonne et région colorée contienne exactement une étoile sans aucun contact.',
	difficulty: {
		label: 'Difficulté',
		easy: 'Facile',
		easyDesc: 'Grille 6×6 avec 6 zones et 6 étoiles.',
		medium: 'Moyen',
		mediumDesc: 'Grille 8×8 avec 8 zones et 8 étoiles.',
		hard: 'Difficile',
		hardDesc: 'Grille 10×10 avec 10 zones et 10 étoiles.',
		expert: 'Expert',
		expertDesc: 'Grille 12×12 avec 12 zones et 12 étoiles.',
	},
	levels: {
		puzzle: 'Niveau',
		puzzleNum: 'Niveau {{number}}',
		selectLevel: 'Choisir un niveau',
		completed: 'Terminé',
		notCompleted: 'Non terminé',
		bestTime: 'Meilleur temps : {{time}}',
		quickPlay: 'Partie rapide',
		quickPlayDesc: 'Générer une nouvelle grille',
	},
	mode: {
		label: 'Mode de saisie',
		mark: 'Mode Marquage',
		markDesc: 'Placez et retirez des marques X pour éliminer des cases',
		token: 'Mode Étoile',
		tokenDesc: 'Placez et retirez des étoiles',
	},
	controls: {
		undo: 'Annuler',
		redo: 'Rétablir',
		autoCross: 'Croix auto',
		autoCrossDesc:
			'Place automatiquement des croix sur la ligne, la colonne et les cases adjacentes lors du placement d’une étoile',
		pause: 'Pause',
		resume: 'Reprendre',
		restart: 'Recommencer',
		play: 'Jouer',
		nextPuzzle: 'Niveau suivant',
		backToLobby: 'Accueil',
	},
	settings: {
		title: 'Paramètres du jeu',
		gameplayTab: 'Jeu',
		siteTab: 'Préférences',
		autoCross: {
			label: 'Assistant Croix Auto',
			description: 'Place automatiquement des marques X autour des étoiles posées.',
		},
		colorScheme: 'Apparence',
		language: 'Langue',
	},
	status: {
		paused: 'Partie en pause',
		pausedDescription: 'Votre progression et le chronomètre sont en pause sécurisée.',
		timer: 'Temps écoulé',
		time: 'Temps',
		bestTime: 'Meilleur temps',
		newBestTime: 'Nouveau record !',
		tokensPlaced: '{{current}} sur {{total}} étoiles placées',
	},
	conflicts: {
		row: 'Conflit de ligne : plusieurs étoiles sur cette ligne',
		col: 'Conflit de colonne : plusieurs étoiles sur cette colonne',
		region: 'Conflit de zone : plusieurs étoiles dans cette zone colorée',
		adjacency:
			'Conflit d’adjacence : les étoiles ne peuvent pas se toucher horizontalement, verticalement ou en diagonale',
	},
	victory: {
		title: 'Énigme résolue !',
		congratulations: 'Excellente déduction ! Toutes les étoiles sont placées sans aucune collision.',
		playAgain: 'Rejouer',
		nextLevel: 'Niveau suivant',
	},
	aria: {
		board: 'Grille de Bataille d’étoiles {{size}} sur {{size}}',
		instructions:
			'Utilisez les touches fléchées pour vous déplacer sur la grille. Espace ou Entrée pour basculer. X pour marquer, S, C ou Q pour placer une étoile, Retour arrière pour effacer, Z pour annuler, Y pour rétablir et Échap pour mettre en pause.',
		cell: 'Ligne {{row}}, Colonne {{col}}, Zone {{region}}',
		cellEmpty: 'vide',
		cellMarked: 'marquée d’une croix',
		cellToken: 'contient une étoile',
		conflictNotice: 'Collision de règles : {{reason}}',
		headerToolbar: 'Barre de commandes',
	},
	navigation: {
		rules: 'Règles',
		lobby: 'Accueil',
	},
} as const satisfies StarBattleTranslationContract;

export const frQueens = frStarBattle;
