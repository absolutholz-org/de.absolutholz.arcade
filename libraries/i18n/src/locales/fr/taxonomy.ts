import type { TaxonomyTranslationContract } from '../../schemas/taxonomy.schema.js';

export const frTaxonomy = {
	aria: {
		gameAttributes: 'Attributs du jeu',
	},
	categories: {
		'logic-deduction': 'Logique et déduction',
		'spatial-puzzle': 'Casse-tête spatial',
		'word-trivia': 'Mots et culture',
		'casual-sorting': 'Tri relaxant',
		'card-board': 'Cartes et plateau',
		'party-duel': 'Soirée et duel',
	},
	categoryDescriptions: {
		'logic-deduction':
			'Résolvez des grilles chiffrées, des indices visuels et des casse-têtes de pure déduction à votre rythme.',
		'spatial-puzzle': 'Démêlez des graphes, reliez des parcours et relevez des défis géométriques.',
		'word-trivia': 'Recomposez des mots, enrichissez votre vocabulaire et testez votre culture générale.',
		'casual-sorting': 'Détendez-vous avec des jeux apaisants de tri, d’association de couleurs et d’organisation.',
		'card-board': 'Jouez à des grands classiques de plateau, de dés et de cartes conçus pour l’accessibilité.',
		'party-duel': 'Affrontez vos proches dans des duels de mémoire rapides et des jeux au tour par tour.',
	},
	tags: {
		mechanics: {
			'grid-based': 'Sur grille',
			pathfinding: 'Recherche de chemin',
			deduction: 'Déduction',
			sorting: 'Tri',
			'pattern-recognition': 'Reconnaissance de motifs',
			'color-matching': 'Association de couleurs',
			'number-logic': 'Logique numérique',
			'word-forming': 'Formation de mots',
			'graph-topology': 'Topologie de graphe',
			'tile-rotation': 'Rotation de tuiles',
			'hazard-avoidance': 'Évitement des pièges',
			'memory-recall': 'Mémoire',
			'hand-management': 'Gestion de main',
			'alignment-capture': 'Alignement et capture',
		},
		inputs: {
			'touch-optimized': 'Optimisé tactile',
			'keyboard-controls': 'Commandes clavier',
			'drag-and-drop': 'Glisser-déposer',
			'tap-only': 'Appui simple',
			'dual-mode-toggle': 'Bouton double mode',
			'direct-typing': 'Saisie directe',
		},
		pacing: {
			'zen-untimed': 'Zen (sans chrono)',
			'speedrun-timer': 'Chronomètre',
			'mistake-penalty': 'Pénalité d’erreur',
			'undo-friendly': 'Annulation illimitée',
			'countdown-arcade': 'Compte à rebours',
			'move-efficiency': 'Efficacité des coups',
			'turn-paced': 'Au tour par tour',
		},
		modes: {
			'single-player': 'Solo',
			'pass-and-play': 'Passe et joue',
			'multiplayer-turn-based': 'Multijoueur au tour par tour',
			'daily-challenge': 'Défi du jour',
			'procedural-endless': 'Infini / Procédural',
			'curated-levels': 'Niveaux créés',
			'vs-ai': 'Contre l’IA',
		},
		sessionLength: {
			'snack-under-3m': '< 3 min',
			'standard-5-10m': '5 à 10 min',
			'deep-15m-plus': '15 min et +',
		},
	},
} as const satisfies TaxonomyTranslationContract;
