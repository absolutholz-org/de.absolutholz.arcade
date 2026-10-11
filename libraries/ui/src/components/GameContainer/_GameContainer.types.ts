import type { ComponentPropsWithoutRef, ReactNode } from 'react';

/**
 * Public props contract for the GameContainer layout component.
 */
export interface GameContainerProps extends Omit<ComponentPropsWithoutRef<'main'>, 'style'> {
	/**
	 * Persistent top header component pinned above the play area.
	 */
	header?: ReactNode;
	/**
	 * Main gameplay viewport contents (boards, controls, keypads, toolbars).
	 */
	children: ReactNode;
	/**
	 * In-game overlay layer (e.g. PauseOverlay) covering the entire play area below the header.
	 */
	overlay?: ReactNode;
	/**
	 * Secondary floating dialogs or sheets (e.g. SettingsDialog, VictoryDialog).
	 */
	dialogs?: ReactNode;
	/**
	 * HTML ID for the main landmark element (defaults to "main-content").
	 */
	id?: string;
}
