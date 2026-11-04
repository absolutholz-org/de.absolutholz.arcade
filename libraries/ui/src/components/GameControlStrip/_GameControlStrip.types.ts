import type { ReactNode } from 'react';
import type { GAME_CONTROL_STRIP_ALIGNS } from './_GameControlStrip.constants';

export type GameControlStripAlign = (typeof GAME_CONTROL_STRIP_ALIGNS)[number];

export interface GameControlStripProps {
	/**
	 * Handler for the Undo action. Button is rendered when provided.
	 */
	onUndo?: () => void;
	/**
	 * Whether the Undo action is currently available.
	 */
	canUndo?: boolean;
	/**
	 * Localized label for the Undo button.
	 */
	undoLabel?: string;
	/**
	 * Handler for the Redo action. Button is rendered when provided.
	 */
	onRedo?: () => void;
	/**
	 * Whether the Redo action is currently available.
	 */
	canRedo?: boolean;
	/**
	 * Localized label for the Redo button.
	 */
	redoLabel?: string;
	/**
	 * Handler for the Reset / Restart current board action. Button is rendered when provided.
	 */
	onReset?: () => void;
	/**
	 * Whether the Reset / Restart action is currently available.
	 */
	canReset?: boolean;
	/**
	 * Localized label for the Reset / Restart button.
	 */
	resetLabel?: string;
	/**
	 * Handler for starting a New Puzzle / New Game. Button is rendered when provided.
	 */
	onNewPuzzle?: () => void;
	/**
	 * Whether the New Puzzle action is currently available.
	 */
	canNewPuzzle?: boolean;
	/**
	 * Localized label for the New Puzzle button.
	 */
	newPuzzleLabel?: string;
	/**
	 * Horizontal alignment of the control buttons within the toolbar.
	 */
	align?: GameControlStripAlign;
	/**
	 * Accessible label for the control toolbar landmark.
	 */
	'aria-label'?: string;
	/**
	 * Optional game-specific extra control buttons rendered inside the strip.
	 */
	children?: ReactNode;
	/**
	 * Optional CSS class name.
	 */
	className?: string;
}
