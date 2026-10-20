import { useCallback, useEffect, useRef, useSyncExternalStore } from 'react';
import { DEFAULT_MAX_VISIBLE_TOASTS } from './_Toast.constants';
import { toastStore } from './_Toast.functions';
import type { ToastState } from './_Toast.types';

const SSR_SNAPSHOT: ToastState = {
	active: [],
	queue: [],
	maxVisible: DEFAULT_MAX_VISIBLE_TOASTS,
};

/**
 * Hook to subscribe to the reactive toast queue state.
 */
export function useToastQueue(maxVisibleToasts?: number) {
	useEffect(() => {
		if (typeof maxVisibleToasts === 'number' && maxVisibleToasts > 0) {
			toastStore.setMaxVisible(maxVisibleToasts);
		}
	}, [maxVisibleToasts]);

	const state = useSyncExternalStore(toastStore.subscribe, toastStore.getSnapshot, () => SSR_SNAPSHOT);

	return {
		activeToasts: state.active,
		queuedToasts: state.queue,
		dismiss: toastStore.dismiss,
		dismissAll: toastStore.dismissAll,
	};
}

export interface UseToastTimerOptions {
	duration?: number;
	onDismiss: () => void;
}

/**
 * Hook to manage auto-dismiss timer lifecycle, pausing automatically when hovered
 * or when keyboard focus is contained within the toast.
 */
export function useToastTimer({ duration, onDismiss }: UseToastTimerOptions) {
	const itemRef = useRef<HTMLDivElement>(null);
	const remainingRef = useRef(typeof duration === 'number' ? duration : 0);
	const startTimeRef = useRef<number | null>(null);
	const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	const isHoveredRef = useRef(false);
	const isFocusedRef = useRef(false);
	const onDismissRef = useRef(onDismiss);

	useEffect(() => {
		onDismissRef.current = onDismiss;
	}, [onDismiss]);

	const clearActiveTimeout = useCallback(() => {
		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current);
			timeoutRef.current = null;
		}
	}, []);

	const pauseTimer = useCallback(() => {
		if (startTimeRef.current !== null) {
			const elapsed = Date.now() - startTimeRef.current;
			remainingRef.current = Math.max(0, remainingRef.current - elapsed);
			startTimeRef.current = null;
		}
		clearActiveTimeout();
	}, [clearActiveTimeout]);

	const startTimer = useCallback(() => {
		clearActiveTimeout();
		if (remainingRef.current <= 0) {
			onDismissRef.current();
			return;
		}
		startTimeRef.current = Date.now();
		timeoutRef.current = setTimeout(() => {
			onDismissRef.current();
		}, remainingRef.current);
	}, [clearActiveTimeout]);

	useEffect(() => {
		if (typeof duration !== 'number' || duration <= 0 || !Number.isFinite(duration)) {
			return;
		}

		remainingRef.current = duration;
		startTimer();

		return () => {
			clearActiveTimeout();
		};
	}, [duration, startTimer, clearActiveTimeout]);

	useEffect(() => {
		const element = itemRef.current;
		if (!element) return;

		const handlePointerEnter = () => {
			if (isHoveredRef.current) return;
			isHoveredRef.current = true;
			element.setAttribute('data-paused', 'true');
			pauseTimer();
		};

		const handlePointerLeave = () => {
			if (!isHoveredRef.current) return;
			isHoveredRef.current = false;
			if (!isFocusedRef.current) {
				element.removeAttribute('data-paused');
				startTimer();
			}
		};

		const handleFocusIn = () => {
			if (isFocusedRef.current) return;
			isFocusedRef.current = true;
			element.setAttribute('data-paused', 'true');
			pauseTimer();
		};

		const handleFocusOut = (event: FocusEvent) => {
			const nextTarget = event.relatedTarget as Node | null;
			if (!nextTarget || !element.contains(nextTarget)) {
				if (!isFocusedRef.current) return;
				isFocusedRef.current = false;
				if (!isHoveredRef.current) {
					element.removeAttribute('data-paused');
					startTimer();
				}
			}
		};

		element.addEventListener('pointerenter', handlePointerEnter);
		element.addEventListener('pointerleave', handlePointerLeave);
		element.addEventListener('mouseenter', handlePointerEnter);
		element.addEventListener('mouseleave', handlePointerLeave);
		element.addEventListener('focusin', handleFocusIn);
		element.addEventListener('focusout', handleFocusOut);

		return () => {
			element.removeAttribute('data-paused');
			element.removeEventListener('pointerenter', handlePointerEnter);
			element.removeEventListener('pointerleave', handlePointerLeave);
			element.removeEventListener('mouseenter', handlePointerEnter);
			element.removeEventListener('mouseleave', handlePointerLeave);
			element.removeEventListener('focusin', handleFocusIn);
			element.removeEventListener('focusout', handleFocusOut);
		};
	}, [pauseTimer, startTimer]);

	return {
		itemRef,
		pauseTimer,
		startTimer,
	};
}
