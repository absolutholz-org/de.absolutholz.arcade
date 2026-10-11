import { useCallback, useSyncExternalStore } from 'react';
import { STORAGE_KEYS } from '../constants/storage';
import { DEFAULT_THEMESET_ID, THEMESET_IDS, type ThemesetId } from '../styles/theme/theme.constants';

const THEMESET_CHANGE_EVENT = 'arcade:themeset-change';

let memoryThemeset: ThemesetId | null = null;

function getThemesetSnapshot(): ThemesetId {
	if (typeof window === 'undefined') {
		return DEFAULT_THEMESET_ID;
	}
	try {
		const stored = localStorage.getItem(STORAGE_KEYS.THEMESET) as ThemesetId | null;
		if (stored && (THEMESET_IDS as readonly string[]).includes(stored)) {
			return stored;
		}
		if (stored === null && memoryThemeset === DEFAULT_THEMESET_ID) {
			return DEFAULT_THEMESET_ID;
		}
	} catch {
		// Ignore storage access restrictions in restricted or sandboxed environments
	}
	if (memoryThemeset && (THEMESET_IDS as readonly string[]).includes(memoryThemeset)) {
		return memoryThemeset;
	}
	return DEFAULT_THEMESET_ID;
}

function getServerSnapshot(): ThemesetId {
	return DEFAULT_THEMESET_ID;
}

function subscribeThemeset(callback: () => void): () => void {
	if (typeof window === 'undefined') {
		return () => {};
	}

	const handleStorage = (event: StorageEvent) => {
		if (event.key === STORAGE_KEYS.THEMESET) {
			const next = event.newValue as ThemesetId | null;
			if (typeof document !== 'undefined') {
				const root = document.documentElement;
				if (next && (THEMESET_IDS as readonly string[]).includes(next) && next !== DEFAULT_THEMESET_ID) {
					root.setAttribute('data-themeset', next);
				} else {
					root.removeAttribute('data-themeset');
				}
			}
			memoryThemeset = next && (THEMESET_IDS as readonly string[]).includes(next) ? next : DEFAULT_THEMESET_ID;
			callback();
		}
	};

	const handleCustomEvent = (event: Event) => {
		const customEvent = event as CustomEvent<ThemesetId>;
		if (customEvent.detail && (THEMESET_IDS as readonly string[]).includes(customEvent.detail)) {
			memoryThemeset = customEvent.detail;
		}
		callback();
	};

	window.addEventListener('storage', handleStorage);
	window.addEventListener(THEMESET_CHANGE_EVENT, handleCustomEvent);

	return () => {
		window.removeEventListener('storage', handleStorage);
		window.removeEventListener(THEMESET_CHANGE_EVENT, handleCustomEvent);
	};
}

/**
 * Hook to read and update the active themeset with localStorage persistence
 * conforming strictly to ADR 012 key namespacing and SSR hydration safety.
 */
export function useThemeset() {
	const themeset = useSyncExternalStore(subscribeThemeset, getThemesetSnapshot, getServerSnapshot);

	const setThemeset = useCallback((nextThemeset: ThemesetId) => {
		if (typeof document !== 'undefined') {
			memoryThemeset = nextThemeset;
			const root = document.documentElement;
			if (nextThemeset === DEFAULT_THEMESET_ID) {
				root.removeAttribute('data-themeset');
				try {
					localStorage.removeItem(STORAGE_KEYS.THEMESET);
				} catch {
					// Ignore storage access restrictions
				}
			} else {
				root.setAttribute('data-themeset', nextThemeset);
				try {
					localStorage.setItem(STORAGE_KEYS.THEMESET, nextThemeset);
				} catch {
					// Ignore storage access restrictions
				}
			}
			window.dispatchEvent(new CustomEvent(THEMESET_CHANGE_EVENT, { detail: nextThemeset }));
		}
	}, []);

	return [themeset, setThemeset] as const;
}
