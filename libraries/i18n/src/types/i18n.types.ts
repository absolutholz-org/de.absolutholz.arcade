import type { SUPPORTED_LANGUAGES } from '../constants/languages.js';
import type { AnagramSchema, AnagramTranslationContract } from '../schemas/anagram.schema.js';
import type { BridgesSchema, BridgesTranslationContract } from '../schemas/bridges.schema.js';
import type { CascadeSchema, CascadeTranslationContract } from '../schemas/cascade.schema.js';
import type { CodebreakerSchema, CodebreakerTranslationContract } from '../schemas/codebreaker.schema.js';
import type { ColorFloodSchema, ColorFloodTranslationContract } from '../schemas/color-flood.schema.js';
import type { ColorMapSchema, ColorMapTranslationContract } from '../schemas/color-map.schema.js';
import type { CommonSchema, CommonTranslationContract } from '../schemas/common.schema.js';
import type { DiceBingoSchema, DiceBingoTranslationContract } from '../schemas/dice-bingo.schema.js';
import type { FutoshikiSchema, FutoshikiTranslationContract } from '../schemas/futoshiki.schema.js';
import type { LiquidSortSchema, LiquidSortTranslationContract } from '../schemas/liquid-sort.schema.js';
import type { MedalsSchema, MedalsTranslationContract } from '../schemas/medals.schema.js';
import type { MinesweeperSchema, MinesweeperTranslationContract } from '../schemas/minesweeper.schema.js';
import type { NetSchema, NetTranslationContract } from '../schemas/net.schema.js';
import type { NonogramSchema, NonogramTranslationContract } from '../schemas/nonogram.schema.js';
import type { PentominoesSchema, PentominoesTranslationContract } from '../schemas/pentominoes.schema.js';
import type { StarBattleSchema, StarBattleTranslationContract } from '../schemas/star-battle.schema.js';
import type { SudokuSchema, SudokuTranslationContract } from '../schemas/sudoku.schema.js';
import type { TaxonomySchema, TaxonomyTranslationContract } from '../schemas/taxonomy.schema.js';
import type { TentsSchema, TentsTranslationContract } from '../schemas/tents.schema.js';
import type { TicTacToeSchema, TicTacToeTranslationContract } from '../schemas/tictactoe.schema.js';
import type { TracksSchema, TracksTranslationContract } from '../schemas/tracks.schema.js';
import type { UndeadSchema, UndeadTranslationContract } from '../schemas/undead.schema.js';
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
export type ColorMapTranslationKey = LeafKeys<ColorMapSchema> | `color-map.${LeafKeys<ColorMapSchema>}`;
export type DiceBingoTranslationKey = LeafKeys<DiceBingoSchema> | `dice-bingo.${LeafKeys<DiceBingoSchema>}`;
export type PentominoesTranslationKey = LeafKeys<PentominoesSchema> | `pentominoes.${LeafKeys<PentominoesSchema>}`;
export type TicTacToeTranslationKey = LeafKeys<TicTacToeSchema> | `tictactoe.${LeafKeys<TicTacToeSchema>}`;
export type FutoshikiTranslationKey = LeafKeys<FutoshikiSchema> | `futoshiki.${LeafKeys<FutoshikiSchema>}`;
export type CodebreakerTranslationKey = LeafKeys<CodebreakerSchema> | `codebreaker.${LeafKeys<CodebreakerSchema>}`;
export type UndeadTranslationKey = LeafKeys<UndeadSchema> | `undead.${LeafKeys<UndeadSchema>}`;
export type CascadeTranslationKey = LeafKeys<CascadeSchema> | `cascade.${LeafKeys<CascadeSchema>}`;
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
	| ColorMapTranslationKey
	| DiceBingoTranslationKey
	| PentominoesTranslationKey
	| TicTacToeTranslationKey
	| FutoshikiTranslationKey
	| CodebreakerTranslationKey
	| UndeadTranslationKey
	| CascadeTranslationKey
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
		readonly 'color-map': ColorMapTranslationContract;
		readonly 'dice-bingo': DiceBingoTranslationContract;
		readonly pentominoes: PentominoesTranslationContract;
		readonly tictactoe: TicTacToeTranslationContract;
		readonly futoshiki: FutoshikiTranslationContract;
		readonly codebreaker: CodebreakerTranslationContract;
		readonly undead: UndeadTranslationContract;
		readonly cascade: CascadeTranslationContract;
		readonly medals: MedalsTranslationContract;
		readonly taxonomy: TaxonomyTranslationContract;
	}
>;
