import type { GameSettingsConfig } from '@arcade/lib-ui/components/GameSettingsPanel';
import { type CodebreakerSettings, DEFAULT_CODEBREAKER_SETTINGS } from '../engine/types';

export const CODEBREAKER_SETTINGS_CONFIG: GameSettingsConfig<CodebreakerSettings> = {
	gameId: 'codebreaker',
	defaults: DEFAULT_CODEBREAKER_SETTINGS,
	wakeLock: { supported: true, defaultEnabled: true },
	fields: [
		{
			key: 'showColorShapes',
			control: 'boolean',
			defaultValue: false,
			availableInGame: true,
			i18n: {
				labelKey: 'codebreaker.settings.showColorShapes.label',
				descriptionKey: 'codebreaker.settings.showColorShapes.description',
			},
		},
		{
			key: 'showColorNumbers',
			control: 'boolean',
			defaultValue: false,
			availableInGame: true,
			i18n: {
				labelKey: 'codebreaker.settings.showColorNumbers.label',
				descriptionKey: 'codebreaker.settings.showColorNumbers.description',
			},
		},
		{
			key: 'autoAdvanceSlot',
			control: 'boolean',
			defaultValue: true,
			availableInGame: true,
			i18n: {
				labelKey: 'codebreaker.settings.autoAdvanceSlot.label',
				descriptionKey: 'codebreaker.settings.autoAdvanceSlot.description',
			},
		},
		{
			key: 'allowDuplicates',
			control: 'boolean',
			defaultValue: true,
			availableInGame: true,
			i18n: {
				labelKey: 'codebreaker.settings.allowDuplicates.label',
				descriptionKey: 'codebreaker.settings.allowDuplicates.description',
			},
		},
	],
};
