import type { COIN_FACES, COIN_SIZES, COIN_STYLES } from './_Coin.constants';

export type CoinFace = (typeof COIN_FACES)[number];
export type CoinStyle = (typeof COIN_STYLES)[number];
export type CoinSize = (typeof COIN_SIZES)[number];
export type CoinSpinVariant = 'a' | 'b';

export interface CoinProps {
	/** Active visible face of the coin */
	face: CoinFace;
	/** Visual coin style variant */
	styleVariant?: CoinStyle;
	/** Whether the coin is currently playing a flip animation */
	isFlipping?: boolean;
	/** Alternating spin variant so repeated flips to the same face re-trigger CSS animation */
	spinVariant?: CoinSpinVariant;
	/** Coin diameter size */
	size?: CoinSize;
	/** Short glyph/initial rendered on the heads face */
	headsShort?: string;
	/** Short glyph/initial rendered on the tails face */
	tailsShort?: string;
	/** Click handler to trigger a flip */
	onClick?: () => void;
	/** Disables button interaction */
	disabled?: boolean;
	/** Accessible label for the coin button */
	ariaLabel?: string;
}
