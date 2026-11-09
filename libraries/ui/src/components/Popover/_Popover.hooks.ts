import {
	type ReactElement,
	type MouseEvent as ReactMouseEvent,
	type Ref,
	useCallback,
	useEffect,
	useId,
	useRef,
} from 'react';
import { type FloatingPosition, useFloatingPosition } from '../../hooks/useFloatingPosition';
import type { PopoverAlign } from './_Popover.types';

interface UsePopoverOptions {
	align?: PopoverAlign;
	onOpenChange?: (isOpen: boolean) => void;
}

export function usePopover({ align = 'bottom', onOpenChange }: UsePopoverOptions = {}) {
	const rawId = useId();
	const id = `popover-${rawId.replace(/:/g, '')}`;
	const triggerRef = useRef<HTMLElement | null>(null);
	const popoverRef = useRef<HTMLDivElement | null>(null);

	const position: FloatingPosition =
		align === 'start' ? 'left' : align === 'end' ? 'right' : (align as FloatingPosition);

	const { updatePosition } = useFloatingPosition({
		gap: 8,
		popoverRef,
		position,
		triggerRef,
	});

	// Ensure DOM attributes for popover invocation are applied on mount
	useEffect(() => {
		if (triggerRef.current) {
			triggerRef.current.setAttribute('popovertarget', id);
		}
		if (popoverRef.current && !popoverRef.current.hasAttribute('popover')) {
			popoverRef.current.setAttribute('popover', 'auto');
		}
	}, [id]);

	// Native Popover toggle event listener
	useEffect(() => {
		const popover = popoverRef.current;
		if (!popover) return;

		const handleToggle = (e: Event) => {
			const toggleEvent = e as Event & { newState: string };
			const isOpen = toggleEvent.newState === 'open';
			if (isOpen) {
				updatePosition();
				requestAnimationFrame(() => updatePosition());
			}
			onOpenChange?.(isOpen);
		};

		popover.addEventListener('toggle', handleToggle);
		return () => popover.removeEventListener('toggle', handleToggle);
	}, [updatePosition, onOpenChange]);

	// Update floating position when open on resize or scroll
	useEffect(() => {
		const handleReposition = () => {
			if (popoverRef.current?.matches(':popover-open')) {
				updatePosition();
			}
		};

		window.addEventListener('resize', handleReposition);
		window.addEventListener('scroll', handleReposition, {
			passive: true,
			capture: true,
		});
		return () => {
			window.removeEventListener('resize', handleReposition);
			window.removeEventListener('scroll', handleReposition, {
				capture: true,
			});
		};
	}, [updatePosition]);

	const createMergedRef = useCallback(
		(triggerElement: ReactElement) => (node: HTMLElement | null) => {
			triggerRef.current = node;
			const childElement = triggerElement as ReactElement & {
				ref?: Ref<HTMLElement>;
			};
			const childRef = childElement.ref;
			if (typeof childRef === 'function') {
				childRef(node);
			} else if (childRef && typeof childRef === 'object') {
				(childRef as { current: HTMLElement | null }).current = node;
			}
		},
		[],
	);

	// Close popover natively when an interactive item inside is clicked
	const handleContentClick = useCallback((e: ReactMouseEvent<HTMLDivElement>) => {
		if ((e.target as HTMLElement).closest('button, a')) {
			popoverRef.current?.hidePopover?.();
		}
	}, []);

	return {
		createMergedRef,
		handleContentClick,
		id,
		popoverRef,
		triggerRef,
		updatePosition,
	};
}
