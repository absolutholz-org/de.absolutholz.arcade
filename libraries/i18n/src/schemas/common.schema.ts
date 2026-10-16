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
		saved: 'actions.saved',
		back: 'actions.back',
	},
	auth: {
		profileTitle: 'auth.profileTitle',
		signInTitle: 'auth.signInTitle',
		signUpTitle: 'auth.signUpTitle',
		resetPasswordTitle: 'auth.resetPasswordTitle',
		displayNameLabel: 'auth.displayNameLabel',
		emailLabel: 'auth.emailLabel',
		passwordLabel: 'auth.passwordLabel',
		cloudSyncLabel: 'auth.cloudSyncLabel',
		cloudSyncDescription: 'auth.cloudSyncDescription',
		signOut: 'auth.signOut',
		signIn: 'auth.signIn',
		signUp: 'auth.signUp',
		sendResetLink: 'auth.sendResetLink',
		needAccount: 'auth.needAccount',
		haveAccount: 'auth.haveAccount',
		forgotPassword: 'auth.forgotPassword',
		guestNotice: 'auth.guestNotice',
		authenticatedAs: 'auth.authenticatedAs',
		resetSentSuccess: 'auth.resetSentSuccess',
		enableCloudSync: 'auth.enableCloudSync',
		guestSyncNotice: 'auth.guestSyncNotice',
	},
	navigation: {
		home: 'navigation.home',
		privacy: 'navigation.privacy',
		imprint: 'navigation.imprint',
		accessibility: 'navigation.accessibility',
		skipToContent: 'navigation.skipToContent',
		legal: 'navigation.legal',
		settings: 'navigation.settings',
		rules: 'navigation.rules',
		breadcrumb: 'navigation.breadcrumb',
	},
	hub: {
		gamesTitle: 'hub.gamesTitle',
	},
	offline: {
		title: 'offline.title',
		description: 'offline.description',
		gameUnavailable: 'offline.gameUnavailable',
		notDownloaded: 'offline.notDownloaded',
		returnToHub: 'offline.returnToHub',
		install: 'offline.install',
		uninstall: 'offline.uninstall',
		downloading: 'offline.downloading',
		installed: 'offline.installed',
		saveOffline: 'offline.saveOffline',
		totalStorageUsed: 'offline.totalStorageUsed',
		allGamesTitle: 'offline.allGamesTitle',
		allGamesDescription: 'offline.allGamesDescription',
	},
	settings: {
		title: 'settings.title',
		description: 'settings.description',
		languageSectionTitle: 'settings.languageSectionTitle',
		languageSectionDescription: 'settings.languageSectionDescription',
		schemeSectionTitle: 'settings.schemeSectionTitle',
		schemeSectionDescription: 'settings.schemeSectionDescription',
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
