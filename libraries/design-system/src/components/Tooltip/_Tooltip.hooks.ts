import { useCallback, useEffect, useId, useRef } from 'react';
import { useFloatingPosition } from '../../hooks/useFloatingPosition';
import type { FloatingPosition } from './_Tooltip.types';

interface UseTooltipOptions {
	content: string;
	position: FloatingPosition;
}

export function useTooltip({ content, position }: UseTooltipOptions) {
	const triggerRef = useRef<HTMLElement | null>(null);
	const popoverRef = useRef<HTMLDivElement>(null);
	const hideTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(
		undefined,
	);
	const popoverId = useId();

	// Handle Escape key dismissal (WCAG 1.4.13)
	const handleKeyDown = useCallback((e: KeyboardEvent) => {
		if (e.key === 'Escape') {
			hidePopover(0);
		}
	}, []);

	// Handle scroll dismissal to prevent detached tooltips
	const handleScroll = useCallback(() => {
		hidePopover(0);
	}, []);

	const { updatePosition } = useFloatingPosition({
		gap: 8,
		popoverRef,
		position,
		triggerRef,
	});

	const showPopover = useCallback(() => {
		clearTimeout(hideTimeoutRef.current);

		if (content && popoverRef.current) {
			const popover = popoverRef.current;
			if (typeof popover.showPopover === 'function') {
				try {
					popover.showPopover();
				} catch {
					// Ignore InvalidStateError if already open
				}
			} else {
				popover.classList.add('fallback-open');
			}
			updatePosition();
			document.addEventListener('keydown', handleKeyDown);
			// Use capture phase (true) to catch scrolling on any nested scrollable containers
			window.addEventListener('scroll', handleScroll, true);
		}
	}, [content, updatePosition, handleKeyDown, handleScroll]);

	const hidePopover = useCallback(
		(delay = 100) => {
			hideTimeoutRef.current = setTimeout(() => {
				if (content && popoverRef.current) {
					const popover = popoverRef.current;
					if (typeof popover.hidePopover === 'function') {
						try {
							popover.hidePopover();
						} catch {
							// Ignore error if already closed
						}
					} else {
						popover.classList.remove('fallback-open');
					}
					document.removeEventListener('keydown', handleKeyDown);
					window.removeEventListener('scroll', handleScroll, true);
				}
			}, delay);
		},
		[content, handleKeyDown, handleScroll],
	);

	// Clean up timeouts and listeners on unmount
	useEffect(() => {
		return () => {
			clearTimeout(hideTimeoutRef.current);
			document.removeEventListener('keydown', handleKeyDown);
			window.removeEventListener('scroll', handleScroll, true);
		};
	}, [handleKeyDown, handleScroll]);

	return {
		triggerRef,
		popoverRef,
		popoverId,
		showPopover,
		hidePopover,
	};
}
