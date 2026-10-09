import type { CommonTranslationContract } from '../../schemas/common.schema.js';

export const frCommon = {
	app: {
		title: 'Arcade',
		tagline: "Jeux classiques conçus dans un souci d'accessibilité.",
		redirectNotice: 'Redirection vers votre langue préférée...',
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
		toolbarLabel: 'Préférences',
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
		settings: 'Paramètres',
		rules: 'Règles',
		breadcrumb: 'Fil d’Ariane',
	},
	hub: {
		gamesTitle: 'Jeux',
	},
	settings: {
		title: 'Paramètres',
		description: 'Personnalisez votre expérience arcade.',
		themeSectionTitle: 'Thèmes',
		themeSectionDescription: "Choisissez un thème de couleur visuel pour l'arcade.",
		themes: {
			base: 'Par défaut',
			christmas: 'Noël',
			easter: 'Pâques',
			'fast-food-fun': 'Fast Food Fun',
			july4th: '4 juillet',
			stpatricks: 'Saint-Patrick',
			'cleveland-gridiron': 'Cleveland Gridiron',
			'buckeye-pride': 'Buckeye Pride',
			germany: 'Allemagne',
			halloween: 'Halloween',
		},
	},
} as const satisfies CommonTranslationContract;
