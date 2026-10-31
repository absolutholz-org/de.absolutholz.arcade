import type { GameSettingsConfig } from '@arcade/lib-ui';

export interface NetSettings extends Record<string, unknown> {
	casualMode: boolean;
	highlightPowered: boolean;
	wrapGrid: boolean;
}

export const DEFAULT_NET_SETTINGS: NetSettings = {
	casualMode: false,
	highlightPowered: true,
	wrapGrid: false,
};

export const NET_SETTINGS_CONFIG: GameSettingsConfig<NetSettings> = {
	gameId: 'net',
	defaults: DEFAULT_NET_SETTINGS,
	fields: [
		{
			key: 'casualMode',
			control: 'boolean',
			defaultValue: false,
			availableInGame: true,
			i18n: {
				labelKey: 'net.settings.casualMode.label',
				descriptionKey: 'net.settings.casualMode.description',
			},
		},
		{
			key: 'highlightPowered',
			control: 'boolean',
			defaultValue: true,
			availableInGame: true,
			i18n: {
				labelKey: 'net.settings.highlightPowered.label',
				descriptionKey: 'net.settings.highlightPowered.description',
			},
		},
		{
			key: 'wrapGrid',
			control: 'boolean',
			defaultValue: false,
			availableInGame: false,
			i18n: {
				labelKey: 'net.settings.wrapGrid.label',
				descriptionKey: 'net.settings.wrapGrid.description',
			},
		},
	],
};
