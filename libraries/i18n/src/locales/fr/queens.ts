import type { QueensTranslationContract } from '../../schemas/queens.schema.js';

export const frQueens = {
	title: 'Queens',
	description:
		'Placez des couronnes neutres de manière à ce que chaque ligne, colonne et zone colorée contienne exactement une couronne sans aucun contact.',
	difficulty: {
		label: 'Difficulté',
		easy: 'Facile',
		easyDesc: 'Grille 6×6 avec 6 zones et 6 couronnes.',
		medium: 'Moyen',
		mediumDesc: 'Grille 8×8 avec 8 zones et 8 couronnes.',
		hard: 'Difficile',
		hardDesc: 'Grille 10×10 avec 10 zones et 10 couronnes.',
		expert: 'Expert',
		expertDesc: 'Grille 12×12 avec 12 zones et 12 couronnes.',
	},
	levels: {
		puzzle: 'Niveau',
		puzzleNum: 'Niveau {{number}}',
		selectLevel: 'Choisir un niveau',
		completed: 'Terminé',
		notCompleted: 'Non terminé',
		bestTime: 'Meilleur temps : {{time}}',
	},
	mode: {
		label: 'Mode de saisie',
		mark: 'Mode Marquage',
		markDesc: 'Placez et retirez des marques X pour éliminer des cases',
		token: 'Mode Couronne',
		tokenDesc: 'Placez et retirez des couronnes',
	},
	controls: {
		undo: 'Annuler',
		redo: 'Rétablir',
		reset: 'Réinitialiser',
		autoCross: 'Croix auto',
		autoCrossDesc:
			'Place automatiquement des croix sur la ligne, la colonne et les cases adjacentes lors du placement d’une couronne',
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
			description: 'Place automatiquement des marques X autour des couronnes posées.',
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
		tokensPlaced: '{{current}} sur {{total}} couronnes placées',
	},
	conflicts: {
		row: 'Conflit de ligne : plusieurs couronnes sur cette ligne',
		col: 'Conflit de colonne : plusieurs couronnes sur cette colonne',
		region: 'Conflit de zone : plusieurs couronnes dans cette zone colorée',
		adjacency:
			'Conflit d’adjacence : les couronnes ne peuvent pas se toucher horizontalement, verticalement ou en diagonale',
	},
	victory: {
		title: 'Énigme résolue !',
		congratulations: 'Excellente déduction ! Toutes les couronnes sont placées sans aucune collision.',
		playAgain: 'Rejouer',
		nextLevel: 'Niveau suivant',
	},
	aria: {
		board: 'Grille de Queens {{size}} sur {{size}}',
		cell: 'Ligne {{row}}, Colonne {{col}}, Zone {{region}}',
		cellEmpty: 'vide',
		cellMarked: 'marquée d’une croix',
		cellToken: 'contient une couronne',
		conflictNotice: 'Collision de règles : {{reason}}',
		headerToolbar: 'Barre de commandes',
	},
	navigation: {
		rules: 'Règles',
		lobby: 'Accueil',
	},
} as const satisfies QueensTranslationContract;
