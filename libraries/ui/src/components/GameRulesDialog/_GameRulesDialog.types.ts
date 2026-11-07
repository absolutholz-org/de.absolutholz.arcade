import type { ComponentPropsWithoutRef, ReactNode } from 'react';

export interface GameRulesDialogProps extends Omit<ComponentPropsWithoutRef<'dialog'>, 'style' | 'title' | 'onCancel'> {
	/** Controls modal visibility */
	isOpen: boolean;
	/** Callback invoked when the user dismisses the dialog */
	onClose: () => void;
	/** Optional localized name of the active game (rendered as subtitle in header) */
	gameTitle?: string;
	/** In-game rules content (typically injected MarkdownContent) */
	children?: ReactNode;
	/** Unique DOM element ID for the dialog */
	id?: string;
}
