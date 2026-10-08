import { type FocusEvent, type KeyboardEvent, useCallback, useEffect, useRef } from 'react';
import { getFocusableItems, isInsideCompositeWidget, isNativeTextOrRangeInput } from './_Toolbar.functions';
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

		const activeIndex = items.findIndex((item) => item.getAttribute('tabindex') === '0');

		if (activeIndex === -1) {
			// Initialize first item as the active tab stop
			items[0].tabIndex = 0;
			items[0].setAttribute('tabindex', '0');
			for (let i = 1; i < items.length; i++) {
				items[i].tabIndex = -1;
				items[i].setAttribute('tabindex', '-1');
			}
		} else {
			// Enforce exactly one active tab stop
			for (let i = 0; i < items.length; i++) {
				if (i !== activeIndex) {
					if (items[i].getAttribute('tabindex') !== '-1') {
						items[i].tabIndex = -1;
						items[i].setAttribute('tabindex', '-1');
					}
				} else {
					items[i].tabIndex = 0;
					items[i].setAttribute('tabindex', '0');
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

		// If focus landed directly on the container, delegate to the active item
		if (target === container) {
			const items = getFocusableItems(container);
			const activeItem = items.find((item) => item.getAttribute('tabindex') === '0') ?? items[0];
			activeItem?.focus();
			return;
		}

		// If focus is inside a popup, menu, listbox, or dialog, do not alter toolbar roving tabindex
		if (isInsideCompositeWidget(target, container)) {
			return;
		}

		const items = getFocusableItems(container);
		const targetIndex = items.findIndex((item) => item === target || item.contains(target));

		if (targetIndex !== -1) {
			for (let i = 0; i < items.length; i++) {
				const isTarget = i === targetIndex;
				items[i].tabIndex = isTarget ? 0 : -1;
				items[i].setAttribute('tabindex', isTarget ? '0' : '-1');
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

			// Do not intercept key events if focus is inside a popup, menu, listbox, or dialog
			if (isInsideCompositeWidget(target, container)) {
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

			const items = getFocusableItems(container);
			if (items.length === 0) return;

			const currentIndex = items.findIndex((item) => item === target || item.contains(target));
			if (currentIndex === -1) return;

			// Prevent default page scroll only after verifying this is a valid toolbar item navigation event
			event.preventDefault();

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
				for (let i = 0; i < items.length; i++) {
					const isTarget = i === nextIndex;
					items[i].tabIndex = isTarget ? 0 : -1;
					items[i].setAttribute('tabindex', isTarget ? '0' : '-1');
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
