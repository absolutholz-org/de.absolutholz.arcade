import type { ReactNode } from 'react';
import type { PageContainerProps } from '../PageContainer/_PageContainer.types';

export interface GameHeaderProps {
	/**
	 * Handler for the lobby/back button.
	 */
	onLobbyClick?: () => void;
	/**
	 * Optional router href (renders semantic <a> if provided; otherwise <button type="button">).
	 */
	lobbyHref?: string;
	/**
	 * Trigger for game settings popover/dialog.
	 */
	onOpenSettings: () => void;
	/**
	 * Trigger for user account/profile.
	 */
	onUserClick?: () => void;
	/**
	 * Slot for center content (e.g. Difficulty text + Timer component).
	 */
	children?: ReactNode;
	/**
	 * Pass-through to PageContainer (default: 'full').
	 */
	containerWidth?: PageContainerProps['variant'];
	/**
	 * Header landmark accessible label (default: 'Game Header').
	 */
	'aria-label'?: string;
	/**
	 * Additional CSS class name.
	 */
	className?: string;
}
