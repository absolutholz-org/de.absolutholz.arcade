export const commonSchema = {
	app: {
		title: 'app.title',
		tagline: 'app.tagline',
		redirectNotice: 'app.redirectNotice',
	},
	switchers: {
		language: {
			ariaLabel: 'switchers.language.ariaLabel',
		},
		scheme: {
			ariaLabel: 'switchers.scheme.ariaLabel',
			options: {
				light: 'switchers.scheme.options.light',
				dark: 'switchers.scheme.options.dark',
				system: 'switchers.scheme.options.system',
			},
		},
		toolbarLabel: 'switchers.toolbarLabel',
	},
	actions: {
		close: 'actions.close',
		save: 'actions.save',
		back: 'actions.back',
	},
	navigation: {
		home: 'navigation.home',
		privacy: 'navigation.privacy',
		imprint: 'navigation.imprint',
		accessibility: 'navigation.accessibility',
		skipToContent: 'navigation.skipToContent',
		legal: 'navigation.legal',
		settings: 'navigation.settings',
		breadcrumb: 'navigation.breadcrumb',
	},
	hub: {
		gamesTitle: 'hub.gamesTitle',
	},
	settings: {
		title: 'settings.title',
		description: 'settings.description',
		themeSectionTitle: 'settings.themeSectionTitle',
		themeSectionDescription: 'settings.themeSectionDescription',
		themes: {
			base: 'settings.themes.base',
			christmas: 'settings.themes.christmas',
			easter: 'settings.themes.easter',
			'fast-food-fun': 'settings.themes.fast-food-fun',
			july4th: 'settings.themes.july4th',
			stpatricks: 'settings.themes.stpatricks',
			'cleveland-gridiron': 'settings.themes.cleveland-gridiron',
			'buckeye-pride': 'settings.themes.buckeye-pride',
			germany: 'settings.themes.germany',
			halloween: 'settings.themes.halloween',
		},
	},
} as const;

export type CommonSchema = typeof commonSchema;

export type SchemaToTranslationContract<T> = {
	readonly [K in keyof T]: T[K] extends object ? SchemaToTranslationContract<T[K]> : string;
};

export type CommonTranslationContract = SchemaToTranslationContract<CommonSchema>;
