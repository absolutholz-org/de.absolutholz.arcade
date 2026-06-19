import { type RefObject, useCallback } from 'react';

export type FloatingPosition = 'top' | 'right' | 'bottom' | 'left';

interface UseFloatingPositionOptions {
	triggerRef: RefObject<HTMLElement | null>;
	popoverRef: RefObject<HTMLElement | null>;
	position?: FloatingPosition;
	gap?: number;
}

/**
 * A hook to calculate and apply collision-aware placement for floating elements.
 * Returns an `updatePosition` function that can be called before or after showing the popover.
 * Sets the 'data-position' attribute on the popover element to reflect the actual applied position.
 */
export function useFloatingPosition({
	gap = 8,
	popoverRef,
	position = 'bottom',
	triggerRef,
}: UseFloatingPositionOptions) {
	const updatePosition = useCallback(() => {
		if (!triggerRef.current || !popoverRef.current) return;

		// Reset inline styles temporarily to measure natural unconstrained sizing
		popoverRef.current.style.top = '0px';
		popoverRef.current.style.left = '0px';

		const triggerRect = triggerRef.current.getBoundingClientRect();
		const popoverWidth = popoverRef.current.offsetWidth;
		const popoverHeight = popoverRef.current.offsetHeight;

		const vw = window.innerWidth;
		const vh = window.innerHeight;

		// Available space
		const spaceTop = triggerRect.top;
		const spaceBottom = vh - triggerRect.bottom;
		const spaceLeft = triggerRect.left;
		const spaceRight = vw - triggerRect.right;

		const neededV = popoverHeight + gap;
		const neededH = popoverWidth + gap;

		// Determine actual position based on preference and available space
		let actualPos = position;
		if (actualPos === 'top' && spaceTop < neededV && spaceBottom >= neededV) {
			actualPos = 'bottom';
		} else if (
			actualPos === 'bottom' &&
			spaceBottom < neededV &&
			spaceTop >= neededV
		) {
			actualPos = 'top';
		} else if (
			actualPos === 'left' &&
			spaceLeft < neededH &&
			spaceRight >= neededH
		) {
			actualPos = 'right';
		} else if (
			actualPos === 'right' &&
			spaceRight < neededH &&
			spaceLeft >= neededH
		) {
			actualPos = 'left';
		}

		let finalTop = 0;
		let finalLeft = 0;

		switch (actualPos) {
			case 'top':
				finalTop = triggerRect.top - popoverHeight - gap;
				finalLeft = triggerRect.left + triggerRect.width / 2 - popoverWidth / 2;
				break;
			case 'bottom':
				finalTop = triggerRect.bottom + gap;
				finalLeft = triggerRect.left + triggerRect.width / 2 - popoverWidth / 2;
				break;
			case 'left':
				finalTop = triggerRect.top + triggerRect.height / 2 - popoverHeight / 2;
				finalLeft = triggerRect.left - popoverWidth - gap;
				break;
			case 'right':
				finalTop = triggerRect.top + triggerRect.height / 2 - popoverHeight / 2;
				finalLeft = triggerRect.right + gap;
				break;
		}

		// Clamp to screen edges
		const padding = 8;
		if (finalLeft < padding) finalLeft = padding;
		if (finalLeft + popoverWidth > vw - padding) {
			finalLeft = vw - popoverWidth - padding;
		}
		if (finalTop < padding) finalTop = padding;
		if (finalTop + popoverHeight > vh - padding) {
			finalTop = vh - popoverHeight - padding;
		}

		popoverRef.current.style.top = `${finalTop}px`;
		popoverRef.current.style.left = `${finalLeft}px`;

		// Set data-position attribute for styling updates (like arrows)
		popoverRef.current.setAttribute('data-position', actualPos);
	}, [triggerRef, popoverRef, position, gap]);

	return { updatePosition };
}
