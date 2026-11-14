import type { SupportedLanguageCode } from '@arcade/lib-i18n/types/i18n.types';

export type CoinFace = 'heads' | 'tails';

export type CoinStyle = 'token' | 'classic' | 'minimal';

export type CoinFlipMode = 'single' | 'batch';

export interface CoinState {
	readonly id: number;
	readonly face: CoinFace;
	readonly spinVariant: 'a' | 'b';
}

export interface CoinHistoryEntry {
	readonly id: number;
	readonly face: CoinFace;
}

export interface CoinPreferences {
	readonly style: CoinStyle;
	readonly mode: CoinFlipMode;
	readonly batchCount: number;
}

export interface CoinFlipperProps {
	readonly lang: SupportedLanguageCode;
}
