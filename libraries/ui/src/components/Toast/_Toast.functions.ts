import { DEFAULT_MAX_VISIBLE_TOASTS, DEFAULT_TOAST_DURATION } from './_Toast.constants';
import type { ToastItemData, ToastOptions, ToastState } from './_Toast.types';

let idCounter = 0;

/**
 * Generates an accessible, collision-resistant unique ID for a toast item.
 */
export function generateToastId(): string {
	idCounter += 1;
	return `toast-${idCounter}-${Date.now().toString(36)}`;
}

/**
 * Factory creating a standalone, framework-agnostic toast queue store.
 */
export function createToastStore(initialMaxVisible = DEFAULT_MAX_VISIBLE_TOASTS) {
	let state: ToastState = {
		active: [],
		queue: [],
		maxVisible: initialMaxVisible,
	};

	const listeners = new Set<() => void>();

	const notify = () => {
		for (const listener of listeners) {
			listener();
		}
	};

	const promoteFromQueue = () => {
		while (state.active.length < state.maxVisible && state.queue.length > 0) {
			const [next, ...remainingQueue] = state.queue;
			state = {
				...state,
				active: [...state.active, next],
				queue: remainingQueue,
			};
		}
	};

	return {
		getSnapshot(): ToastState {
			return state;
		},

		subscribe(listener: () => void): () => void {
			listeners.add(listener);
			return () => {
				listeners.delete(listener);
			};
		},

		setMaxVisible(max: number) {
			if (state.maxVisible !== max) {
				state = { ...state, maxVisible: Math.max(1, max) };
				promoteFromQueue();
				notify();
			}
		},

		show(options: ToastOptions | string): string {
			const normalized: ToastOptions = typeof options === 'string' ? { message: options } : { ...options };

			const id = normalized.id || generateToastId();
			const duration = normalized.duration !== undefined ? normalized.duration : DEFAULT_TOAST_DURATION;
			const variant = normalized.variant || 'info';

			const item: ToastItemData = {
				...normalized,
				id,
				variant,
				duration,
				createdAt: Date.now(),
			};

			if (state.active.length < state.maxVisible) {
				state = {
					...state,
					active: [...state.active, item],
				};
			} else {
				state = {
					...state,
					queue: [...state.queue, item],
				};
			}

			notify();
			return id;
		},

		dismiss(id: string) {
			const activeItem = state.active.find((item) => item.id === id);
			const queueItem = state.queue.find((item) => item.id === id);
			const found = activeItem || queueItem;

			if (found?.onDismiss) {
				try {
					found.onDismiss();
				} catch {
					// Guard against user callback exceptions
				}
			}

			const nextActive = state.active.filter((item) => item.id !== id);
			const nextQueue = state.queue.filter((item) => item.id !== id);

			state = {
				...state,
				active: nextActive,
				queue: nextQueue,
			};

			promoteFromQueue();
			notify();
		},

		dismissAll() {
			for (const item of [...state.active, ...state.queue]) {
				if (item.onDismiss) {
					try {
						item.onDismiss();
					} catch {
						// Guard against user callback exceptions
					}
				}
			}

			state = {
				...state,
				active: [],
				queue: [],
			};
			notify();
		},
	};
}

/**
 * Global singleton toast store.
 */
export const toastStore = createToastStore();

/**
 * Universal programmatic controller for dispatching, managing, and dismissing toasts.
 */
export const toast = {
	show(options: ToastOptions | string): string {
		return toastStore.show(options);
	},
	info(message: string, options?: Omit<ToastOptions, 'message' | 'variant'>): string {
		return toastStore.show({ ...options, message, variant: 'info' });
	},
	success(message: string, options?: Omit<ToastOptions, 'message' | 'variant'>): string {
		return toastStore.show({ ...options, message, variant: 'success' });
	},
	warning(message: string, options?: Omit<ToastOptions, 'message' | 'variant'>): string {
		return toastStore.show({ ...options, message, variant: 'warning' });
	},
	achievement(message: string, options?: Omit<ToastOptions, 'message' | 'variant'>): string {
		return toastStore.show({ ...options, message, variant: 'achievement' });
	},
	dismiss(id: string) {
		toastStore.dismiss(id);
	},
	dismissAll() {
		toastStore.dismissAll();
	},
};
