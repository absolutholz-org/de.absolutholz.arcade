import type { PentominoesTranslationContract } from '../../schemas/pentominoes.schema.js';

export const frPentominoes: PentominoesTranslationContract = {
	title: 'Pentaminos',
	subtitle: 'Casse-tête de pavage spatial en polyominos',
	description:
		'Insérez parfaitement des pièces de polyominos dans des cadres géométriques sans chevauchement ni case vide.',
	difficulty: {
		label: 'Difficulté',
		easy: 'Facile',
		easyDesc: 'Puzzles d’initiation de 3 à 5 pièces pour un raisonnement spatial immédiat',
		medium: 'Moyen',
		mediumDesc: 'Défis équilibrés de 5 à 8 pièces avec silhouettes géométriques',
		hard: 'Difficile',
		hardDesc: 'Grilles denses de 8 à 10 pièces exigeant planification et rotations',
		expert: 'Expert',
		expertDesc: 'Grands défis canoniques de 12 pièces (60 cases au total)',
	},
	lobby: {
		title: 'Défis Pentaminos',
		subtitle: 'Choisissez un pack d’énigmes pour commencer le pavage',
		selectDifficulty: 'Sélectionner la difficulté',
		completed: 'Terminé',
		quickPlay: 'Partie rapide',
		quickPlayDesc: 'Rejoindre immédiatement le prochain défi non résolu',
		selectLevel: 'Choisir une grille',
	},
	status: {
		placed: 'Pièces placées',
		moves: 'Coups',
		noneSelected: 'Aucune sélectionnée',
		timer: 'Temps écoulé',
		time: 'Temps',
		newBestTime: 'Nouveau record !',
	},
	controls: {
		rotateCw: 'Tourner horaire (90°)',
		rotateCcw: 'Tourner anti-horaire (90°)',
		flipH: 'Retourner horizontalement',
		returnToTray: 'Ranger dans la réserve',
		clearBoard: 'Vider le plateau',
		hint: 'Indice',
		undo: 'Annuler',
		redo: 'Rétablir',
		backToLobby: 'Lobby',
		newGame: 'Nouvelle partie',
		resume: 'Reprendre',
	},
	tray: {
		activePieceTitle: 'Pièce active',
		keyboardHint:
			'Flèches: déplacer curseur • Entrée/Espace: poser pièce • R: pivoter • F: retourner • Échap: désélectionner',
		pieceStatusAvailable: 'Disponible dans la réserve',
		pieceStatusPlaced: 'Posée sur le plateau',
		pieceStatusSelected: 'Actuellement sélectionnée',
	},
	a11y: {
		boardLabel: 'Plateau de Pentaminos',
		trayLabel: 'Réserve de polyominos',
		cellEmpty: 'Ligne {{row}}, Colonne {{col}}, Vide',
		cellOccupied: 'Ligne {{row}}, Colonne {{col}}, Occupée par la pièce {{pieceId}}',
		cellVoid: 'Ligne {{row}}, Colonne {{col}}, Case extérieure',
		puzzleSolved: 'Félicitations ! Toutes les pièces sont placées et le puzzle est résolu !',
		pickedUpFromTray: 'Pièce {{pieceId}} sélectionnée de la réserve',
		returnedToTray: 'Pièce {{pieceId}} retournée dans la réserve',
		rotatedPiece: 'Pièce {{pieceId}} pivotée à {{rotation}} degrés',
		flippedPiece: 'Pièce {{pieceId}} retournée',
		placedPiece: 'Pièce {{pieceId}} posée à la ligne {{row}}, colonne {{col}}',
		invalidOutOfBounds: 'Impossible de poser la pièce {{pieceId}} : dépasse du plateau',
		invalidVoidCell: 'Impossible de poser la pièce {{pieceId}} : chevauche une case extérieure',
		invalidOverlap: 'Impossible de poser la pièce {{pieceId}} : chevauche une autre pièce',
		pickedUpFromBoard: 'Pièce {{pieceId}} reprise depuis la ligne {{row}}, colonne {{col}}',
		hintPlaced: 'L’indice a placé la pièce {{pieceId}} à la ligne {{row}}, colonne {{col}}',
	},
	victory: {
		title: 'Énigme résolue !',
		congratulations: 'Brillante déduction spatiale ! Le cadre est parfaitement rempli.',
		playAgain: 'Rejouer',
		nextPuzzle: 'Grille suivante',
		viewLobby: 'Lobby',
	},
	settings: {
		title: 'Paramètres Pentaminos',
		showPieceLabels: 'Afficher les lettres des pièces',
		showPieceLabelsDescription: 'Affiche la lettre de chaque pièce sur la case centrale correspondante.',
		showSurfacePatterns: 'Motifs tactiles',
		showSurfacePatternsDescription: 'Dessine des hachures et motifs contrastés pour une meilleure accessibilité.',
		highlightGhostValidity: 'Aperçu de placement',
		highlightGhostValidityDescription: 'Colore en vert ou rouge les positions valides ou invalides au survol.',
		showGridCoordinates: 'Coordonnées de grille',
		showGridCoordinatesDescription: 'Affiche des repères de coordonnées le long des bordures du plateau.',
	},
	levels: {
		procedural: {
			title: 'Défi Procédural',
			description: 'Configuration algorithmique de pavage spatial',
		},
		'rect-3x5': {
			title: 'Rectangle 3×5',
			description: 'Casse-tête d’initiation à 3 pentaminos',
		},
		'rect-4x5': {
			title: 'Rectangle 4×5',
			description: 'Rectangle compact à 4 pentaminos',
		},
		'rect-5x5': {
			title: 'Carré 5×5',
			description: 'Cadre carré classique à 5 pentaminos',
		},
		'rect-5x6': {
			title: 'Rectangle 5×6',
			description: 'Grille rectangulaire équilibrée à 6 pentaminos',
		},
		'rect-5x7': {
			title: 'Rectangle 5×7',
			description: 'Plateau rectangulaire stimulant à 7 pentaminos',
		},
		'rect-5x8': {
			title: 'Rectangle 5×8',
			description: 'Vaste grille de pavage à 8 pentaminos',
		},
		'rect-5x9': {
			title: 'Rectangle 5×9',
			description: 'Configuration rectangulaire à 9 pentaminos',
		},
		'rect-5x10': {
			title: 'Rectangle 5×10',
			description: 'Épreuve spatiale dense à 10 pentaminos',
		},
		'rect-5x11': {
			title: 'Rectangle 5×11',
			description: 'Plateau complexe à 11 pentaminos',
		},
		'rect-5x12': {
			title: 'Grand Rectangle 5×12',
			description: 'Le défi monumental canonique des 12 pentaminos (60 cases)',
		},
		'rect-6x10': {
			title: 'Grand Rectangle 6×10',
			description: 'Plateau canonique 6×10 des 12 pentaminos',
		},
		'rect-8x8-ring': {
			title: '8×8 Trou Central',
			description: 'Les 12 pentaminos entourant un carré vide 2×2',
		},
		'rect-8x8-notched': {
			title: '8×8 Croix Entaillée',
			description: 'Les 12 pentaminos encadrés par des encoches latérales',
		},
		'silhouette-cross': {
			title: 'Silhouette Cruciforme',
			description: 'Contour en croix symétrique garni de 5 pentaminos',
		},
		'silhouette-staircase': {
			title: 'Silhouette Escalier',
			description: 'Pyramide à degrés requérant 6 polyominos',
		},
		'silhouette-archway': {
			title: 'Portail en Arche',
			description: 'Grande arche architecturale remplie de 7 polyominos',
		},
	},
};
