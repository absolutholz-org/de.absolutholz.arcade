import type { GameSettingsConfig } from '@arcade/lib-ui/components/GameSettingsPanel';
import type { InputMode } from '../engine/types';

export interface StarBattleSettings extends Record<string, unknown> {
	autoCross: boolean;
	colorblindPatterns: boolean;
	defaultMode?: InputMode;
}

export type QueensSettings = StarBattleSettings;

export const DEFAULT_STAR_BATTLE_SETTINGS: StarBattleSettings = {
	autoCross: true,
	colorblindPatterns: false,
	defaultMode: 'mark',
};

export const DEFAULT_QUEENS_SETTINGS = DEFAULT_STAR_BATTLE_SETTINGS;

export const STAR_BATTLE_SETTINGS_CONFIG: GameSettingsConfig<StarBattleSettings> = {
	gameId: 'star-battle',
	defaults: DEFAULT_STAR_BATTLE_SETTINGS,
	wakeLock: { supported: true, defaultEnabled: false },
	fields: [
		{
			key: 'autoCross',
			control: 'boolean',
			defaultValue: true,
			availableInGame: true,
			i18n: {
				labelKey: 'star-battle.settings.autoCross.label',
				descriptionKey: 'star-battle.settings.autoCross.description',
			},
		},
		{
			key: 'colorblindPatterns',
			control: 'boolean',
			defaultValue: false,
			availableInGame: true,
			i18n: {
				labelKey: 'star-battle.settings.colorblindPatterns.label',
				descriptionKey: 'star-battle.settings.colorblindPatterns.description',
			},
		},
	],
};

export const QUEENS_SETTINGS_CONFIG = STAR_BATTLE_SETTINGS_CONFIG;
