import type { SupportedLanguageCode } from '@arcade/lib-i18n/types/i18n.types';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';

export interface GameSettingsDialogProps
	extends Omit<ComponentPropsWithoutRef<'dialog'>, 'style' | 'title' | 'onCancel'> {
	/** Controls modal visibility */
	isOpen: boolean;
	/** Callback invoked when the user dismisses the dialog */
	onClose: () => void;
	/** Optional localized name of the active game (rendered as subtitle in header) */
	gameTitle?: string;
	/** Game-specific settings toggles/controls (Section 1) */
	children?: ReactNode;
	/** Unique DOM element ID for the dialog */
	id?: string;
	/** Optional callback when the user changes language */
	onLanguageChange?: (language: SupportedLanguageCode) => void;
}
