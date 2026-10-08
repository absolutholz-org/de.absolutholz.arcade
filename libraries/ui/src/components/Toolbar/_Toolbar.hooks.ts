import { type FocusEvent, type KeyboardEvent, useCallback, useEffect, useRef } from 'react';
import { getFocusableItems, isNativeTextOrRangeInput } from './_Toolbar.functions';
import type { ToolbarOrientation } from './_Toolbar.types';

interface UseToolbarOptions {
	loop?: boolean;
	orientation?: ToolbarOrientation;
}

/**
 * Hook managing W3C APG Toolbar roving tabindex, arrow key navigation, and focus restoration.
 */
export function useToolbar({ loop = true, orientation = 'horizontal' }: UseToolbarOptions = {}) {
	const toolbarRef = useRef<HTMLDivElement | null>(null);

	// Synchronize roving tabindex across child controls
	const syncRovingTabIndex = useCallback(() => {
		const container = toolbarRef.current;
		if (!container) return;

		const items = getFocusableItems(container);
		if (items.length === 0) return;

		const activeIndex = items.findIndex((item) => item.tabIndex === 0);

		if (activeIndex === -1) {
			// Initialize first item as the active tab stop
			items[0].tabIndex = 0;
			for (let i = 1; i < items.length; i++) {
				items[i].tabIndex = -1;
			}
		} else {
			// Enforce exactly one active tab stop
			for (let i = 0; i < items.length; i++) {
				if (i !== activeIndex && items[i].tabIndex !== -1) {
					items[i].tabIndex = -1;
				}
			}
		}
	}, []);

	// Observe DOM mutations to keep roving tabindex in sync as child items mount, unmount, or disable
	useEffect(() => {
		if (typeof window === 'undefined') return;

		const container = toolbarRef.current;
		if (!container) return;

		syncRovingTabIndex();

		if (typeof MutationObserver !== 'undefined') {
			const observer = new MutationObserver(() => {
				syncRovingTabIndex();
			});

			observer.observe(container, {
				attributeFilter: ['disabled', 'aria-disabled'],
				attributes: true,
				childList: true,
				subtree: true,
			});

			return () => {
				observer.disconnect();
			};
		}
	}, [syncRovingTabIndex]);

	// Update roving tabindex when any child control gains focus
	const handleFocus = useCallback((event: FocusEvent<HTMLDivElement>) => {
		const container = toolbarRef.current;
		if (!container) return;

		const target = event.target as HTMLElement;
		const items = getFocusableItems(container);
		const targetIndex = items.findIndex((item) => item === target || item.contains(target));

		if (targetIndex !== -1) {
			const activeItem = items[targetIndex];
			for (const item of items) {
				item.tabIndex = item === activeItem ? 0 : -1;
			}
		}
	}, []);

	// Keyboard interaction per W3C APG Toolbar specification
	const handleKeyDown = useCallback(
		(event: KeyboardEvent<HTMLDivElement>) => {
			const container = toolbarRef.current;
			if (!container) return;

			const target = event.target as HTMLElement;

			// Do not intercept native arrow or home/end navigation on text inputs, textareas, or range sliders
			if (isNativeTextOrRangeInput(target)) {
				return;
			}

			const isHorizontal = orientation === 'horizontal';
			const isNext = isHorizontal ? event.key === 'ArrowRight' : event.key === 'ArrowDown';
			const isPrev = isHorizontal ? event.key === 'ArrowLeft' : event.key === 'ArrowUp';
			const isHome = event.key === 'Home';
			const isEnd = event.key === 'End';

			if (!isNext && !isPrev && !isHome && !isEnd) {
				return;
			}

			// Prevent default page scroll on arrow, home, and end keys within the toolbar
			event.preventDefault();

			const items = getFocusableItems(container);
			if (items.length === 0) return;

			const currentIndex = items.findIndex((item) => item === target || item.contains(target));
			if (currentIndex === -1) return;

			let nextIndex = currentIndex;

			if (isNext) {
				nextIndex = loop ? (currentIndex + 1) % items.length : Math.min(currentIndex + 1, items.length - 1);
			} else if (isPrev) {
				nextIndex = loop ? (currentIndex - 1 + items.length) % items.length : Math.max(currentIndex - 1, 0);
			} else if (isHome) {
				nextIndex = 0;
			} else if (isEnd) {
				nextIndex = items.length - 1;
			}

			const targetItem = items[nextIndex];
			if (targetItem) {
				for (const item of items) {
					item.tabIndex = item === targetItem ? 0 : -1;
				}
				targetItem.focus();
			}
		},
		[loop, orientation],
	);

	return {
		handleFocus,
		handleKeyDown,
		toolbarRef,
	};
}
