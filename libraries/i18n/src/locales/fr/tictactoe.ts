import type { TicTacToeTranslationContract } from '../../schemas/tictactoe.schema.js';

export const frTicTacToe: TicTacToeTranslationContract = {
	title: 'Morpion (Tic-Tac-Toe)',
	subtitle: 'Duel classique 3x3 de stratégie et d’alignement.',
	description:
		'Défiez un ami en mode passe-et-joue local. Alignez trois symboles X ou O à l’horizontale, à la verticale ou en diagonale.',
	playButton: 'Jouer au Morpion',
	difficulty: {
		standard: 'Classique 3×3',
		standardDesc: 'Grille standard 3×3 avec alternance du premier coup',
	},
	lobby: {
		title: 'Morpion',
		subtitle: 'Choisissez votre mode de jeu et personnalisez les noms des joueurs.',
		modeSelect: 'Choisir le mode de jeu',
		passAndPlay: 'Passe & Joue (Local)',
		passAndPlayDesc: 'Jouez face à face sur le même écran, sans connexion requise.',
		playOnline: 'Jouer en ligne',
		playOnlineDesc: 'Invitez un adversaire via un lien ou un code de salon.',
		comingSoon: 'Bientôt disponible',
		player1Label: 'Joueur 1 (X)',
		player2Label: 'Joueur 2 (O)',
		player1Default: 'Joueur 1',
		player2Default: 'Joueur 2',
		startGame: 'Commencer la partie',
	},
	game: {
		turn: 'Tour de {{name}} ({{mark}})',
		winner: '{{name}} a gagné !',
		draw: 'Match nul !',
		boardLabel: 'Plateau de morpion 3x3',
		cellLabel: 'Ligne {{row}}, Colonne {{col}} : {{mark}}',
		emptyCell: 'Vide',
		playAgain: 'Rejouer',
		backToMenu: 'Retour au menu',
		startingTurnInfo: 'Le premier tour alterne à chaque manche.',
	},
	victory: {
		title: 'Partie terminée',
		winnerWins: 'Félicitations {{name}}, vous avez remporté la manche !',
		drawTitle: 'Égalité',
		drawDescription: 'Les deux joueurs ont combattu jusqu’au match nul.',
		playAgain: 'Rejouer',
		backToMenu: 'Retour au menu',
	},
	controls: {
		undo: 'Annuler',
		restart: 'Recommencer',
		rules: 'Règles',
		settings: 'Paramètres',
		backToLobby: 'Retour au menu',
		keyboardHint: 'Flèches pour naviguer, Espace ou Entrée pour poser votre marque.',
	},
	settings: {
		title: 'Paramètres du Morpion',
		highlightWinningLine: {
			label: 'Surligner la ligne gagnante',
			description: 'Met en évidence l’alignement gagnant de trois symboles.',
		},
		showCellCoordinates: {
			label: 'Afficher les coordonnées',
			description: 'Affiche des repères de ligne et de colonne sur la grille.',
		},
	},
};
