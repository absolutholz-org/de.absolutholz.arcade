import type { CommonTranslationContract } from '../../schemas/common.schema.js';

export const deCommon = {
	app: {
		title: 'Arcade Web App',
		tagline: 'Klassische Spiele mit Fokus auf Barrierefreiheit.',
		redirectNotice: 'Weiterleitung zu Ihrer bevorzugten Sprache...',
	},
	switchers: {
		language: {
			ariaLabel: 'Sprache auswählen',
		},
		scheme: {
			ariaLabel: 'Farbschema',
			options: {
				light: 'Hell',
				dark: 'Dunkel',
				system: 'Systemeinstellung',
			},
		},
	},
	actions: {
		close: 'Schließen',
		save: 'Speichern',
		back: 'Zurück',
	},
	navigation: {
		home: 'Startseite',
		privacy: 'Datenschutz',
		imprint: 'Impressum',
		accessibility: 'Barrierefreiheit',
		skipToContent: 'Zum Hauptinhalt springen',
		legal: 'Rechtliches',
	},
	hub: {
		gamesTitle: 'Spiele',
	},
} as const satisfies CommonTranslationContract;
