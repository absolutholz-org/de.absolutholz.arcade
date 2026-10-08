import type { SUPPORTED_LANGUAGES } from '../constants/languages.js';
import type { CommonSchema, CommonTranslationContract } from '../schemas/common.schema.js';
import type { SudokuSchema, SudokuTranslationContract } from '../schemas/sudoku.schema.js';

export type SupportedLanguageCode = (typeof SUPPORTED_LANGUAGES)[number]['code'];

export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

type LeafKeys<T extends object> = {
	[K in keyof T & string]: T[K] extends object ? `${K}.${LeafKeys<T[K]>}` : `${K}`;
}[keyof T & string];

export type CommonTranslationKey = LeafKeys<CommonSchema>;
export type SudokuTranslationKey = LeafKeys<SudokuSchema>;

export type TranslationKey = CommonTranslationKey | SudokuTranslationKey;

export interface UseI18nReturn {
	readonly t: (key: TranslationKey, options?: Record<string, unknown>) => string;
	readonly language: SupportedLanguageCode;
	readonly changeLanguage: (code: SupportedLanguageCode) => Promise<void>;
	readonly supportedLanguages: typeof SUPPORTED_LANGUAGES;
	readonly isReady: boolean;
}

export type TranslationResources = Record<
	SupportedLanguageCode,
	{
		readonly common: CommonTranslationContract;
		readonly sudoku: SudokuTranslationContract;
	}
>;
