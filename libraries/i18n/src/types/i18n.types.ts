import type { SUPPORTED_LANGUAGES } from '../constants/languages.js';
import type { AnagramSchema, AnagramTranslationContract } from '../schemas/anagram.schema.js';
import type { BridgesSchema, BridgesTranslationContract } from '../schemas/bridges.schema.js';
import type { ColorFloodSchema, ColorFloodTranslationContract } from '../schemas/color-flood.schema.js';
import type { CommonSchema, CommonTranslationContract } from '../schemas/common.schema.js';
import type { LiquidSortSchema, LiquidSortTranslationContract } from '../schemas/liquid-sort.schema.js';
import type { MedalsSchema, MedalsTranslationContract } from '../schemas/medals.schema.js';
import type { MinesweeperSchema, MinesweeperTranslationContract } from '../schemas/minesweeper.schema.js';
import type { NetSchema, NetTranslationContract } from '../schemas/net.schema.js';
import type { NonogramSchema, NonogramTranslationContract } from '../schemas/nonogram.schema.js';
import type { StarBattleSchema, StarBattleTranslationContract } from '../schemas/star-battle.schema.js';
import type { SudokuSchema, SudokuTranslationContract } from '../schemas/sudoku.schema.js';
import type { TaxonomySchema, TaxonomyTranslationContract } from '../schemas/taxonomy.schema.js';
import type { TentsSchema, TentsTranslationContract } from '../schemas/tents.schema.js';
import type { TracksSchema, TracksTranslationContract } from '../schemas/tracks.schema.js';
import type { UntangleSchema, UntangleTranslationContract } from '../schemas/untangle.schema.js';

export type SupportedLanguageCode = (typeof SUPPORTED_LANGUAGES)[number]['code'];

export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

type LeafKeys<T extends object> = {
	[K in keyof T & string]: T[K] extends object ? `${K}.${LeafKeys<T[K]>}` : `${K}`;
}[keyof T & string];

export type CommonTranslationKey = LeafKeys<CommonSchema> | `common.${LeafKeys<CommonSchema>}`;
export type SudokuTranslationKey = LeafKeys<SudokuSchema>;
export type MinesweeperTranslationKey = LeafKeys<MinesweeperSchema>;
export type NonogramTranslationKey = LeafKeys<NonogramSchema>;
export type StarBattleTranslationKey = LeafKeys<StarBattleSchema> | `star-battle.${LeafKeys<StarBattleSchema>}`;
export type QueensTranslationKey = StarBattleTranslationKey;
export type BridgesTranslationKey = LeafKeys<BridgesSchema>;
export type TracksTranslationKey = LeafKeys<TracksSchema>;
export type LiquidSortTranslationKey = LeafKeys<LiquidSortSchema> | `liquid-sort.${LeafKeys<LiquidSortSchema>}`;
export type TentsTranslationKey = LeafKeys<TentsSchema>;
export type AnagramTranslationKey = LeafKeys<AnagramSchema>;
export type UntangleTranslationKey = LeafKeys<UntangleSchema> | `untangle.${LeafKeys<UntangleSchema>}`;
export type NetTranslationKey = LeafKeys<NetSchema> | `net.${LeafKeys<NetSchema>}`;
export type ColorFloodTranslationKey = LeafKeys<ColorFloodSchema> | `color-flood.${LeafKeys<ColorFloodSchema>}`;
export type MedalsTranslationKey = LeafKeys<MedalsSchema> | `medals.${LeafKeys<MedalsSchema>}`;
export type TaxonomyTranslationKey = LeafKeys<TaxonomySchema> | `taxonomy.${LeafKeys<TaxonomySchema>}`;

export type TranslationKey =
	| CommonTranslationKey
	| SudokuTranslationKey
	| MinesweeperTranslationKey
	| NonogramTranslationKey
	| StarBattleTranslationKey
	| BridgesTranslationKey
	| TracksTranslationKey
	| LiquidSortTranslationKey
	| TentsTranslationKey
	| AnagramTranslationKey
	| UntangleTranslationKey
	| NetTranslationKey
	| ColorFloodTranslationKey
	| MedalsTranslationKey
	| TaxonomyTranslationKey;

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
		readonly minesweeper: MinesweeperTranslationContract;
		readonly nonogram: NonogramTranslationContract;
		readonly 'star-battle': StarBattleTranslationContract;
		readonly bridges: BridgesTranslationContract;
		readonly tracks: TracksTranslationContract;
		readonly 'liquid-sort': LiquidSortTranslationContract;
		readonly tents: TentsTranslationContract;
		readonly anagram: AnagramTranslationContract;
		readonly untangle: UntangleTranslationContract;
		readonly net: NetTranslationContract;
		readonly 'color-flood': ColorFloodTranslationContract;
		readonly medals: MedalsTranslationContract;
		readonly taxonomy: TaxonomyTranslationContract;
	}
>;
