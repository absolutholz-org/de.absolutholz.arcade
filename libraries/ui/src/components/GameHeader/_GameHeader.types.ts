import type { ReactNode } from 'react';

export interface GameHeaderProps {
	/**
	 * Navigation target URL for returning to the lobby.
	 */
	backHref?: string;
	/**
	 * Accessible label and tooltip for the back/lobby button.
	 */
	backLabel?: string;
	/**
	 * Optional click callback when the lobby/back button is triggered.
	 */
	onBackClick?: () => void;
	/**
	 * Optional difficulty or level indicator string (e.g. 'Easy', 'Hard').
	 */
	difficulty?: string;
	/**
	 * Slot or node for elapsed timer, strictly centered.
	 */
	timer?: ReactNode;
	/**
	 * Trigger callback for opening game settings dialog.
	 */
	onOpenSettings?: () => void;
	/**
	 * Optional router link URL for settings.
	 */
	settingsHref?: string;
	/**
	 * Accessible label and tooltip for settings trigger.
	 */
	settingsLabel?: string;
	/**
	 * Whether to render the scheme switcher in the utility cluster (default: false).
	 */
	showSchemeSwitcher?: boolean;
	/**
	 * Optional additional action buttons or controls rendered in the right utility cluster.
	 */
	actions?: ReactNode;
	/**
	 * Whether to render the bottom divider border (default: true).
	 */
	hasBorder?: boolean;
	/**
	 * Accessible landmark label for the header banner (default: 'Game Header').
	 */
	'aria-label'?: string;
	/**
	 * Optional fallback children rendered in center slot when timer is omitted.
	 */
	children?: ReactNode;
}
