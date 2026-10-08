import type { CommonTranslationContract } from '../../schemas/common.schema.js';

export const enCommon = {
	app: {
		title: 'Arcade Web App',
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
	},
	hub: {
		gamesTitle: 'Games',
	},
} as const satisfies CommonTranslationContract;
