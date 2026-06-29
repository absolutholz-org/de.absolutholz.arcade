import { createContext, useCallback, useContext } from 'react';
import type React from 'react';

import type { ToolbarContextValue } from './_Toolbar.types';

export const ToolbarContext = createContext<ToolbarContextValue | undefined>(
	undefined,
);

/**
 * useToolbar hook to access the Toolbar context.
 * Useful for any child component that needs to register or manage focus.
 */
export function useToolbar() {
	const context = useContext(ToolbarContext);
	if (!context) {
		throw new Error('useToolbar must be used within a Toolbar root');
	}
	return context;
}

/**
 * Hook to manage a roving tabindex for a toolbar.
 *
 * Supports ArrowLeft, ArrowRight, Home, and End keys.
 * Items in the toolbar must have the data-toolbar-item="true" attribute.
 */
export function useToolbarNavigation() {
	const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
		const container = event.currentTarget as HTMLElement;

		// Find all focusable toolbar items
		const items = Array.from(
			container.querySelectorAll('[data-toolbar-item="true"]:not([disabled])'),
		) as HTMLElement[];

		if (items.length === 0) return;

		// Find current index based on active element
		const currentIndex = items.indexOf(document.activeElement as HTMLElement);

		let nextIndex = currentIndex !== -1 ? currentIndex : 0;

		switch (event.key) {
			case 'ArrowRight':
				nextIndex = (nextIndex + 1) % items.length;
				break;
			case 'ArrowLeft':
				nextIndex = (nextIndex - 1 + items.length) % items.length;
				break;
			case 'Home':
				nextIndex = 0;
				break;
			case 'End':
				nextIndex = items.length - 1;
				break;
			default:
				return;
		}

		event.preventDefault();

		// Focus the next item immediately
		items[nextIndex].focus();
	}, []);

	return {
		handleKeyDown,
	};
}
