import type { CommonTranslationContract } from '../../schemas/common.schema.js';

export const enCommon = {
	app: {
		title: 'Arcade Web App',
		tagline: 'Classic games built with accessibility in mind.',
	},
	language: {
		select: 'Select language',
		change: 'Change language',
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
		overviewTitle: 'Overview',
		exploreDescription: 'Explore classic arcade games built with accessibility in mind.',
	},
} as const satisfies CommonTranslationContract;
