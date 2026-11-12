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
	 * Optional override label for the Undo button. Defaults to canonical `common:actions.undo`.
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
	 * Optional override label for the Redo button. Defaults to canonical `common:actions.redo`.
	 */
	redoLabel?: string;
	/**
	 * Handler for the Reset / Restart current board action. Button is rendered when provided.
	 * Alias for onRestart.
	 */
	onReset?: () => void;
	/**
	 * Handler for the Restart current board action. Button is rendered when provided.
	 */
	onRestart?: () => void;
	/**
	 * Whether the Reset / Restart action is currently available.
	 */
	canReset?: boolean;
	/**
	 * Whether the Restart action is currently available (alias for canReset).
	 */
	canRestart?: boolean;
	/**
	 * Optional override label for the Reset / Restart button. Defaults to canonical `common:actions.restart`.
	 */
	resetLabel?: string;
	/**
	 * Optional override label for the Restart button. Defaults to canonical `common:actions.restart`.
	 */
	restartLabel?: string;
	/**
	 * Handler for starting a New Puzzle / New Game. Button is rendered when provided.
	 */
	onNewPuzzle?: () => void;
	/**
	 * Handler for starting a New Game (alias for onNewPuzzle).
	 */
	onNewGame?: () => void;
	/**
	 * Whether the New Puzzle / New Game action is currently available.
	 */
	canNewPuzzle?: boolean;
	/**
	 * Whether the New Game action is currently available (alias for canNewPuzzle).
	 */
	canNewGame?: boolean;
	/**
	 * Optional override label for the New Puzzle button. Defaults to canonical `common:actions.newGame`.
	 */
	newPuzzleLabel?: string;
	/**
	 * Optional override label for the New Game button. Defaults to canonical `common:actions.newGame`.
	 */
	newGameLabel?: string;
	/**
	 * Guard Rule: Only require confirmation if the game has active progress (e.g. moves > 0 or timer > 0)
	 * and is not completed. When false and requireConfirmation is false, destructive actions execute immediately.
	 */
	hasActiveProgress?: boolean;
	/**
	 * Alias for hasActiveProgress.
	 */
	hasProgress?: boolean;
	/**
	 * Indicates whether the current game/puzzle is completed or won.
	 * When true, destructive actions execute immediately without a confirmation dialog.
	 */
	isComplete?: boolean;
	/**
	 * Explicitly require confirmation regardless of hasActiveProgress / isComplete.
	 */
	requireConfirmation?: boolean;
	/**
	 * Optional override text for cancel confirmation button. Defaults to canonical `common:actions.cancel`.
	 */
	cancelLabel?: string;
	/**
	 * Horizontal alignment of the control buttons within the toolbar.
	 * Defaults to 'center' for a balanced centered cluster.
	 */
	align?: GameControlStripAlign;
	/**
	 * Accessible label for the control toolbar landmark. Defaults to canonical `common:actions.gameControls`.
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

export type GameControlsProps = GameControlStripProps;
export type GameActionBarProps = GameControlStripProps;
