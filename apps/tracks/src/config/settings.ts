import type { GameSettingsConfig } from '@arcade/lib-ui';

export interface TracksSettings extends Record<string, unknown> {
	casualMode: boolean;
	gameMode: 'standard' | 'casual';
	highlightClues: boolean;
	autoCross: boolean;
}

export const DEFAULT_TRACKS_SETTINGS: TracksSettings = {
	casualMode: false,
	gameMode: 'standard',
	highlightClues: true,
	autoCross: false,
};

export const TRACKS_SETTINGS_CONFIG: GameSettingsConfig<TracksSettings> = {
	gameId: 'tracks',
	defaults: DEFAULT_TRACKS_SETTINGS,
	fields: [
		{
			key: 'casualMode',
			control: 'boolean',
			defaultValue: false,
			availableInGame: true,
			i18n: {
				labelKey: 'tracks.settings.casualMode.label',
				descriptionKey: 'tracks.settings.casualMode.description',
			},
		},
		{
			key: 'highlightClues',
			control: 'boolean',
			defaultValue: true,
			availableInGame: true,
			i18n: {
				labelKey: 'tracks.settings.highlightClues.label',
				descriptionKey: 'tracks.settings.highlightClues.description',
			},
		},
		{
			key: 'autoCross',
			control: 'boolean',
			defaultValue: false,
			availableInGame: true,
			i18n: {
				labelKey: 'tracks.settings.autoCross.label',
				descriptionKey: 'tracks.settings.autoCross.description',
			},
		},
	],
};
