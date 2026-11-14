import type { CoinFace, CoinSpinVariant, CoinStyle } from '../Coin';

export interface CoinState {
	readonly id: number;
	readonly face: CoinFace;
	readonly spinVariant: CoinSpinVariant;
}

export interface CoinFlipResult {
	readonly outcomes: readonly CoinFace[];
	readonly heads: number;
	readonly tails: number;
}

export interface CoinTrayHandle {
	/** Programmatically trigger a coin flip. */
	flip: () => void;
	/** Programmatically reset all coins to heads. */
	reset: () => void;
}

export interface CoinTrayProps {
	/** Initial number of coins to render (1 to 10, defaults to 1). */
	defaultCount?: number;
	/** Controlled number of coins (1 to 10). */
	count?: number;
	/** Callback invoked when the coin count is changed via tray controls. */
	onCountChange?: (count: number) => void;
	/** Callback invoked when a flip action finishes, supplying outcomes and counts. */
	onFlipComplete?: (result: CoinFlipResult) => void;
	/** Visual coin style variant. */
	styleVariant?: CoinStyle;
	/** Whether interaction with the coins and action buttons is disabled. */
	disabled?: boolean;
	/** Accessible label for the coin tray landmark. */
	ariaLabel?: string;
	/** Optional CSS class name for styling composition. */
	className?: string;
	/** Localized label for Heads. */
	headsLabel?: string;
	/** Localized label for Tails. */
	tailsLabel?: string;
	/** Short glyph for Heads on coin face. */
	headsShort?: string;
	/** Short glyph for Tails on coin face. */
	tailsShort?: string;
	/** Accessible label for the coin count stepper. */
	countLabel?: string;
	/** Accessible label for the stepper decrement button. */
	decrementLabel?: string;
	/** Accessible label for the stepper increment button. */
	incrementLabel?: string;
	/** Label for the single-coin flip button. */
	flipButtonLabel?: string;
	/** Label for the multi-coin flip button. */
	flipBatchButtonLabel?: string;
	/** Label for the reset button. */
	resetButtonLabel?: string;
	/** Formatter for the batch summary pill. */
	summaryFormatter?: (heads: number, tails: number) => string;
	/** Formatter for single-coin live announcement. */
	singleResultFormatter?: (result: string) => string;
	/** Formatter for batch live announcement. */
	batchResultFormatter?: (heads: number, tails: number) => string;
}
