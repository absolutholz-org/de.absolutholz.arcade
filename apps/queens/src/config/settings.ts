import type { GameSettingsConfig } from '@arcade/lib-ui';
import type { InputMode } from '../engine/types';

export interface QueensSettings extends Record<string, unknown> {
	autoCross: boolean;
	defaultMode?: InputMode;
}

export const DEFAULT_QUEENS_SETTINGS: QueensSettings = {
	autoCross: true,
	defaultMode: 'mark',
};

export const QUEENS_SETTINGS_CONFIG: GameSettingsConfig<QueensSettings> = {
	gameId: 'queens',
	defaults: DEFAULT_QUEENS_SETTINGS,
	fields: [
		{
			key: 'autoCross',
			control: 'boolean',
			defaultValue: true,
			availableInGame: true,
			i18n: {
				labelKey: 'queens.settings.autoCross.label',
				descriptionKey: 'queens.settings.autoCross.description',
			},
		},
	],
};
