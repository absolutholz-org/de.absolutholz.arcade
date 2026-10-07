import { type ReactElement, type Ref, useCallback, useEffect, useId, useRef } from 'react';
import { useFloatingPosition } from '../../hooks/useFloatingPosition';
import type { TooltipProps } from './_Tooltip.types';

type UseTooltipOptions = Pick<TooltipProps, 'content' | 'position'>;

export function useTooltip({ content, position = 'top' }: UseTooltipOptions = {}) {
	const rawId = useId();
	const id = `tooltip-${rawId.replace(/:/g, '')}`;
	const triggerRef = useRef<HTMLElement | null>(null);
	const popoverRef = useRef<HTMLDivElement | null>(null);
	const hideTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

	const handleKeyDownRef = useRef<(e: KeyboardEvent) => void>(() => {});
	const handleScrollRef = useRef<() => void>(() => {});

	const { updatePosition } = useFloatingPosition({
		gap: 8,
		popoverRef,
		position,
		triggerRef,
	});

	useEffect(() => {
		if (popoverRef.current && !popoverRef.current.hasAttribute('popover')) {
			popoverRef.current.setAttribute('popover', 'manual');
		}
	}, []);

	const hideTooltip = useCallback((delay = 100) => {
		clearTimeout(hideTimeoutRef.current);

		const executeHide = () => {
			if (popoverRef.current) {
				const popover = popoverRef.current as HTMLDivElement & {
					hidePopover?: () => void;
				};
				if (typeof popover.hidePopover === 'function') {
					try {
						popover.hidePopover();
					} catch {
						// Ignore error if already closed
					}
				} else {
					popoverRef.current.classList.remove('fallback-open');
				}
			}
			document.removeEventListener('keydown', handleKeyDownRef.current);
			window.removeEventListener('scroll', handleScrollRef.current, true);
		};

		if (delay === 0) {
			executeHide();
		} else {
			hideTimeoutRef.current = setTimeout(executeHide, delay);
		}
	}, []);

	const handleKeyDown = useCallback(
		(e: KeyboardEvent) => {
			if (e.key === 'Escape') {
				hideTooltip(0);
			}
		},
		[hideTooltip],
	);

	const handleScroll = useCallback(() => {
		hideTooltip(0);
	}, [hideTooltip]);

	useEffect(() => {
		handleKeyDownRef.current = handleKeyDown;
		handleScrollRef.current = handleScroll;
	}, [handleKeyDown, handleScroll]);

	const showTooltip = useCallback(() => {
		clearTimeout(hideTimeoutRef.current);

		if (content && popoverRef.current) {
			const popover = popoverRef.current as HTMLDivElement & {
				showPopover?: () => void;
			};
			if (typeof popover.showPopover === 'function') {
				try {
					popover.showPopover();
				} catch {
					// Ignore InvalidStateError if already open
				}
			} else {
				popoverRef.current.classList.add('fallback-open');
			}
			requestAnimationFrame(() => updatePosition());
			document.addEventListener('keydown', handleKeyDownRef.current);
			window.addEventListener('scroll', handleScrollRef.current, true);
		}
	}, [content, updatePosition]);

	useEffect(() => {
		return () => {
			clearTimeout(hideTimeoutRef.current);
			document.removeEventListener('keydown', handleKeyDownRef.current);
			window.removeEventListener('scroll', handleScrollRef.current, true);
		};
	}, []);

	const createMergedRef = useCallback(
		(childElement: ReactElement) => (node: HTMLElement | null) => {
			triggerRef.current = node;
			const childRef = (
				childElement as ReactElement & {
					ref?: Ref<HTMLElement>;
				}
			).ref;
			if (typeof childRef === 'function') {
				childRef(node);
			} else if (childRef && typeof childRef === 'object') {
				(childRef as { current: HTMLElement | null }).current = node;
			}
		},
		[],
	);

	return {
		createMergedRef,
		hideTooltip,
		id,
		popoverRef,
		showTooltip,
		triggerRef,
		updatePosition,
	};
}
