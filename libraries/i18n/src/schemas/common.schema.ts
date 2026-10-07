export const commonSchema = {
	app: {
		title: 'app.title',
		tagline: 'app.tagline',
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
	},
	hub: {
		overviewTitle: 'hub.overviewTitle',
		exploreDescription: 'hub.exploreDescription',
	},
} as const;

export type CommonSchema = typeof commonSchema;

export type SchemaToTranslationContract<T> = {
	readonly [K in keyof T]: T[K] extends object ? SchemaToTranslationContract<T[K]> : string;
};

export type CommonTranslationContract = SchemaToTranslationContract<CommonSchema>;
