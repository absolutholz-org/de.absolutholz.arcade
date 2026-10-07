import type { CommonTranslationContract } from '../../schemas/common.schema.js';

export const frCommon = {
	app: {
		title: 'Arcade Web App',
		tagline: "Jeux classiques conçus dans un souci d'accessibilité.",
	},
	switchers: {
		language: {
			ariaLabel: 'Sélectionner la langue',
		},
		scheme: {
			ariaLabel: 'Thème de couleur',
			options: {
				light: 'Clair',
				dark: 'Sombre',
				system: 'Système',
			},
		},
	},
	actions: {
		close: 'Fermer',
		save: 'Enregistrer',
		back: 'Retour',
	},
	navigation: {
		home: 'Accueil',
		privacy: 'Confidentialité',
		imprint: 'Mentions légales',
		accessibility: 'Accessibilité',
		skipToContent: 'Aller au contenu principal',
		legal: 'Informations légales',
	},
	hub: {
		overviewTitle: 'Présentation',
		exploreDescription: "Découvrez des jeux d'arcade classiques conçus dans un souci d'accessibilité.",
	},
} as const satisfies CommonTranslationContract;
