import type { ComponentPropsWithoutRef, ReactNode } from 'react';

/**
 * Public props contract for the PauseOverlay component.
 */
export interface PauseOverlayProps extends Omit<ComponentPropsWithoutRef<'div'>, 'style' | 'title'> {
	/**
	 * Controls whether the pause overlay backdrop is actively mounted and displayed.
	 */
	isOpen: boolean;
	/**
	 * Main heading displayed on the pause card (e.g., localized "Game Paused").
	 */
	title: ReactNode;
	/**
	 * Optional descriptive message explaining that gameplay and timers are halted.
	 */
	description?: ReactNode;
	/**
	 * Action button label for resuming gameplay.
	 */
	resumeLabel: ReactNode;
	/**
	 * Action button label for restarting the puzzle or game.
	 */
	restartLabel: ReactNode;
	/**
	 * Callback triggered when the user initiates a resume action.
	 */
	onResume: () => void;
	/**
	 * Callback triggered when the user initiates a restart action.
	 */
	onRestart: () => void;
	/**
	 * Optional additional actions or controls rendered within the pause card.
	 */
	children?: ReactNode;
}
