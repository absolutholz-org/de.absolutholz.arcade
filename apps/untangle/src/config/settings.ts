import type { GameSettingsConfig } from '@arcade/lib-ui';
import { DEFAULT_UNTANGLE_SETTINGS, type UntangleSettings } from '../engine/types.ts';

export type { UntangleSettings };
export { DEFAULT_UNTANGLE_SETTINGS };

export const UNTANGLE_SETTINGS_CONFIG: GameSettingsConfig<UntangleSettings> = {
	gameId: 'untangle',
	defaults: DEFAULT_UNTANGLE_SETTINGS,
	fields: [
		{
			key: 'casualMode',
			control: 'boolean',
			defaultValue: false,
			availableInGame: true,
			i18n: {
				labelKey: 'untangle.settings.casualMode.label',
				descriptionKey: 'untangle.settings.casualMode.description',
			},
		},
		{
			key: 'highlightIntersectingEdges',
			control: 'boolean',
			defaultValue: true,
			availableInGame: true,
			i18n: {
				labelKey: 'untangle.settings.highlightIntersectingEdges.label',
				descriptionKey: 'untangle.settings.highlightIntersectingEdges.description',
			},
		},
		{
			key: 'showCrossingCounter',
			control: 'boolean',
			defaultValue: true,
			availableInGame: true,
			i18n: {
				labelKey: 'untangle.settings.showCrossingCounter.label',
				descriptionKey: 'untangle.settings.showCrossingCounter.description',
			},
		},
	],
};
