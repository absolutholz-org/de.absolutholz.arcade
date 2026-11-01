import type { DieState, RollDiceResult } from '@arcade/lib-dice';

export interface DiceTrayHandle {
	/** Programmatically trigger a dice roll. */
	roll: () => void;
	/** Programmatically reset the dice to face 1. */
	reset: () => void;
}

export interface DiceTrayProps {
	/** Initial number of dice to render (1 to 6, defaults to 5). */
	defaultCount?: number;
	/** Controlled number of dice (1 to 6). */
	count?: number;
	/** Callback invoked when the dice count is changed via tray controls. */
	onCountChange?: (count: number) => void;
	/** Callback invoked when a roll action finishes, supplying updated dice and total. */
	onRollComplete?: (result: RollDiceResult) => void;
	/** Optional controlled dice states. If omitted, the tray manages its own dice state. */
	dice?: DieState[];
	/** Optional callback for toggling die hold in controlled mode. */
	onToggleHold?: (id: string) => void;
	/** Optional custom audio player function. Defaults to native playDiceRollSound. */
	playRollSound?: (unheldCount: number) => void;
	/** Whether interaction with the dice and action buttons is disabled. */
	disabled?: boolean;
	/** Accessible label for the dice tray landmark group. Defaults to "Dice Tray". */
	ariaLabel?: string;
	/** Optional CSS class name for styling composition. */
	className?: string;
}
