import type { SupportedLanguageCode } from '@arcade/lib-i18n/types/i18n.types';
import type { CoinFace, CoinStyle } from '@arcade/lib-ui/components/Coin';

export type { CoinFace, CoinStyle };

export type CoinFlipMode = 'single' | 'batch';

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
