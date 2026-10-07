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

	// Ensure DOM attributes for popover invocation are applied to the elements on client mount
	useEffect(() => {
		if (triggerRef.current) {
			triggerRef.current.setAttribute('popovertarget', id);
		}
		if (popoverRef.current && !popoverRef.current.hasAttribute('popover')) {
			popoverRef.current.setAttribute('popover', 'auto');
		}
	}, [id]);

	useEffect(() => {
		const popover = popoverRef.current;
		if (!popover) return;

		const handleToggle = (e: Event) => {
			const toggleEvent = e as Event & { newState: string };
			const isOpen = toggleEvent.newState === 'open';
			if (isOpen) {
				popover.setAttribute('data-open', 'true');
				updatePosition();
				requestAnimationFrame(() => updatePosition());
			} else {
				popover.removeAttribute('data-open');
			}
			onOpenChange?.(isOpen);
		};

		popover.addEventListener('toggle', handleToggle);
		return () => popover.removeEventListener('toggle', handleToggle);
	}, [updatePosition, onOpenChange]);

	const handleTriggerClick = useCallback(() => {
		const popover = popoverRef.current;
		if (!popover) return;

		if (typeof popover.togglePopover === 'function') {
			try {
				popover.togglePopover();
			} catch (_) {}
		} else {
			const isCurrentlyOpen = popover.getAttribute('data-open') === 'true';
			if (isCurrentlyOpen) {
				popover.removeAttribute('data-open');
				popover.style.display = 'none';
				onOpenChange?.(false);
			} else {
				popover.setAttribute('data-open', 'true');
				popover.style.display = 'block';
				updatePosition();
				onOpenChange?.(true);
			}
		}
	}, [onOpenChange, updatePosition]);

	useEffect(() => {
		const handleReposition = () => {
			try {
				if (popoverRef.current?.matches(':popover-open')) {
					updatePosition();
				}
			} catch {
				if (popoverRef.current && getComputedStyle(popoverRef.current).display !== 'none') {
					updatePosition();
				}
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

	const handleContentClick = useCallback((e: ReactMouseEvent<HTMLDivElement>) => {
		if ((e.target as HTMLElement).closest('button, a')) {
			popoverRef.current?.hidePopover?.();
		}
	}, []);

	return {
		createMergedRef,
		handleContentClick,
		handleTriggerClick,
		id,
		popoverRef,
		triggerRef,
		updatePosition,
	};
}
