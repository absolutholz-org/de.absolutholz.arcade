import type { SoloNobleTranslationContract } from '../../schemas/solo-noble.schema.js';

export const frSoloNoble: SoloNobleTranslationContract = {
	title: 'Solitaire Noble',
	description: "Le noble jeu de solitaire. Sautez par-dessus les pions jusqu'à ce qu'il n'en reste qu'un seul.",
	layouts: {
		label: 'Plateau',
		english: 'Anglais Classique (33)',
		european: 'Européen / Français (37)',
		triangular: 'Triangulaire (15)',
		diamond: 'Diamant (41)',
		wiegleb: 'Wiegleb Allemand (45)',
	},
	variants: {
		label: 'Variante de jeu',
		classicCentral: 'Classique Central',
		classicCentralDesc: 'Terminez avec exactement 1 pion au centre.',
		clearOut: 'Nettoyage',
		clearOutDesc: "Éliminez le maximum de pions; victoire avec 1 pion n'importe où.",
		customStart: 'Départ Libre',
		customStartDesc: "Choisissez n'importe quel trou pour commencer.",
	},
	status: {
		ready: 'Choisir le trou initial',
		readyInstruction: 'Cliquez sur un trou pour retirer le premier pion.',
		playing: 'En cours',
		won: 'Victoire Noble !',
		wonDesc: 'Magistral ! Vous avez résolu le casse-tête avec un seul pion.',
		stuck: 'Bloqué',
		stuckDesc: 'Aucun saut possible. Réessayez une nouvelle partie.',
	},
	stats: {
		pegsRemaining: 'Pions restants',
		movesCount: 'Coups',
		bestPegs: 'Meilleurs pions',
		bestMoves: 'Meilleurs coups',
	},
	controls: {
		undo: 'Annuler',
		redo: 'Rétablir',
		reset: 'Réinitialiser',
		newGame: 'Nouvelle partie',
	},
};
