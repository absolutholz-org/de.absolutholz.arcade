import type { CommonTranslationContract } from '../../schemas/common.schema.js';

export const enCommon = {
	app: {
		title: 'Arcade',
		tagline: 'Classic games built with accessibility in mind.',
		redirectNotice: 'Redirecting to your preferred language...',
	},
	switchers: {
		language: {
			ariaLabel: 'Select language',
		},
		scheme: {
			ariaLabel: 'Color scheme',
			options: {
				light: 'Light',
				dark: 'Dark',
				system: 'Sync with system',
			},
		},
		toolbarLabel: 'Preferences',
	},
	actions: {
		close: 'Close',
		save: 'Save',
		back: 'Back',
	},
	navigation: {
		home: 'Home',
		privacy: 'Privacy Policy',
		imprint: 'Imprint',
		accessibility: 'Accessibility',
		skipToContent: 'Skip to main content',
		legal: 'Legal',
		settings: 'Settings',
		rules: 'Rules',
		breadcrumb: 'Breadcrumb',
	},
	hub: {
		gamesTitle: 'Games',
	},
	settings: {
		title: 'Settings',
		description: 'Customize your arcade experience.',
		themeSectionTitle: 'Themes',
		themeSectionDescription: 'Choose a visual color theme for the arcade.',
		themes: {
			base: 'Default',
			christmas: 'Christmas',
			easter: 'Easter',
			'fast-food-fun': 'Fast Food Fun',
			july4th: '4th of July',
			stpatricks: "St. Patrick's Day",
			'cleveland-gridiron': 'Cleveland Gridiron',
			'buckeye-pride': 'Buckeye Pride',
			germany: 'Germany',
			halloween: 'Halloween',
		},
	},
} as const satisfies CommonTranslationContract;
