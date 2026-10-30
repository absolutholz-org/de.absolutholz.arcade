import type { GameSettingsConfig } from '@arcade/lib-ui';
import type { LanguageCode } from '../engine/types.js';

export interface AnagramSettings extends Record<string, unknown> {
	vocabLanguage: LanguageCode;
}

export const DEFAULT_ANAGRAM_SETTINGS: AnagramSettings = {
	vocabLanguage: 'en',
};

export const ANAGRAM_SETTINGS_CONFIG: GameSettingsConfig<AnagramSettings> = {
	gameId: 'anagram',
	defaults: DEFAULT_ANAGRAM_SETTINGS,
	fields: [
		{
			key: 'vocabLanguage',
			control: 'select',
			defaultValue: 'en',
			availableInGame: false,
			i18n: {
				labelKey: 'anagram.vocabulary.label',
			},
			options: [
				{ value: 'en', labelKey: 'anagram.vocabulary.en' },
				{ value: 'de', labelKey: 'anagram.vocabulary.de' },
				{ value: 'fr', labelKey: 'anagram.vocabulary.fr' },
				{ value: 'pt', labelKey: 'anagram.vocabulary.pt' },
			],
		},
	],
};
