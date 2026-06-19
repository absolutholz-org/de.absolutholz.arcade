import {
	Children,
	cloneElement,
	type FocusEvent,
	type MouseEvent,
	type ReactElement,
	type Ref,
	useCallback,
	useEffect,
	useId,
	useRef,
} from 'react';

import { useFloatingPosition } from '../../hooks/useFloatingPosition';
import * as S from './_Tooltip.styles';
import { type ITooltip } from './_Tooltip.types';

export const Tooltip = ({ children, content, position = 'top' }: ITooltip) => {
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

	useEffect(() => {
		if (popoverRef.current) {
			popoverRef.current.setAttribute('popover', 'manual');
		}
	}, [content]);

	const { updatePosition } = useFloatingPosition({
		gap: 8,
		popoverRef,
		position,
		triggerRef,
	});

	function showPopover() {
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
			document.addEventListener('keydown', handleKeyDown);
			// Use capture phase (true) to catch scrolling on any nested scrollable containers
			window.addEventListener('scroll', handleScroll, true);
		}
	}

	// Add a slight delay to hidePopover to allow the user to hover over the tooltip itself (WCAG 1.4.13)
	function hidePopover(delay = 100) {
		hideTimeoutRef.current = setTimeout(() => {
			if (content && popoverRef.current) {
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
				document.removeEventListener('keydown', handleKeyDown);
				window.removeEventListener('scroll', handleScroll, true);
			}
		}, delay);
	}

	// Clean up timeouts and listeners on unmount
	useEffect(() => {
		return () => {
			clearTimeout(hideTimeoutRef.current);
			document.removeEventListener('keydown', handleKeyDown);
			window.removeEventListener('scroll', handleScroll, true);
		};
	}, [handleKeyDown, handleScroll]);

	if (!content) return children;

	const child = Children.only(children);

	const mergedRef = (node: HTMLElement) => {
		triggerRef.current = node;
		const childElement = child as ReactElement & {
			ref?: Ref<HTMLElement>;
		};
		const childRef = childElement.ref;
		if (typeof childRef === 'function') {
			childRef(node);
		} else if (childRef && typeof childRef === 'object') {
			(childRef as { current: HTMLElement | null }).current = node;
		}
	};

	return (
		<>
			{/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
			{cloneElement(child as ReactElement<any>, {
				// Programmatically associate the tooltip with the trigger element
				'aria-describedby': content ? popoverId : undefined,
				onBlur: (e: FocusEvent<HTMLElement>) => {
					hidePopover(0);
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					(child as ReactElement<any>).props.onBlur?.(e);
				},
				onFocus: (e: FocusEvent<HTMLElement>) => {
					showPopover();
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					(child as ReactElement<any>).props.onFocus?.(e);
				},
				onMouseEnter: (e: MouseEvent<HTMLElement>) => {
					showPopover();
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					(child as ReactElement<any>).props.onMouseEnter?.(e);
				},
				onMouseLeave: (e: MouseEvent<HTMLElement>) => {
					hidePopover();
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					(child as ReactElement<any>).props.onMouseLeave?.(e);
				},
				ref: mergedRef,
			})}
			<S.Tooltip
				id={popoverId}
				ref={popoverRef}
				role="tooltip"
				// Allow hover on the tooltip itself
				onMouseEnter={showPopover}
				onMouseLeave={() => hidePopover(100)}
			>
				{content}
			</S.Tooltip>
		</>
	);
};
