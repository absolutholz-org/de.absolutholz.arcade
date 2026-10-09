import type { CommonTranslationContract } from '../../schemas/common.schema.js';

export const deCommon = {
	app: {
		title: 'Arcade',
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
		toolbarLabel: 'Einstellungen',
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
		settings: 'Einstellungen',
	},
	hub: {
		gamesTitle: 'Spiele',
	},
	settings: {
		title: 'Einstellungen',
		description: 'Passe dein Arcade-Erlebnis an.',
		themeSectionTitle: 'Farbschemata',
		themeSectionDescription: 'Wähle ein visuelles Farbthema für die Arcade.',
		themes: {
			base: 'Standard',
			christmas: 'Weihnachten',
			easter: 'Ostern',
			'fast-food-fun': 'Fast Food Fun',
			july4th: '4. Juli',
			stpatricks: "St. Patrick's Day",
			'cleveland-gridiron': 'Cleveland Gridiron',
			'buckeye-pride': 'Buckeye Pride',
			germany: 'Deutschland',
			halloween: 'Halloween',
		},
	},
} as const satisfies CommonTranslationContract;
