import type { DieState } from '@arcade/lib-dice';

export interface DieProps {
	/** Current state of the die from @arcade/lib-dice. */
	state: DieState;
	/** Optional 0-indexed position of the die in the tray for accessible labeling. */
	index?: number;
	/** Optional tumble style index (0-5) controlling unique rotation physics and timing. */
	tumbleIndex?: number;
	/** Callback invoked when the user clicks or presses Enter/Space on the die. */
	onToggleHold?: (id: string) => void;
	/** Whether this die is currently undergoing a roll animation. */
	isRolling?: boolean;
	/** Incremented counter to trigger fresh spin animations across repeated rolls. */
	spinCount?: number;
	/** Optional CSS class name for styling composition. */
	className?: string;
}
