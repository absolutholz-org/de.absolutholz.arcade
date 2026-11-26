import { useCallback, useSyncExternalStore } from 'react';
import { STORAGE_KEYS } from '../constants/storage';
import { DEFAULT_THEMESET_ID, THEMESET_IDS, type ThemesetId } from '../styles/theme/theme.constants';
import { syncMetaThemeColor } from '../utils/themeColor';

const THEMESET_CHANGE_EVENT = 'arcade:themeset-change';
const THEMESET_LINK_ID = 'arcade-themeset-css';

let memoryThemeset: ThemesetId | null = null;
let pendingThemesetRequest = 0;

function applyThemesetToDocument(themeset: ThemesetId): void {
	if (typeof document === 'undefined') {
		return;
	}

	const root = document.documentElement;
	const requestId = ++pendingThemesetRequest;

	if (themeset === DEFAULT_THEMESET_ID) {
		root.removeAttribute('data-themeset');
		document.getElementById(THEMESET_LINK_ID)?.remove();
		syncMetaThemeColor();
		return;
	}

	const targetHref = `/themes/${encodeURIComponent(themeset)}.css`;
	const existingLink = document.getElementById(THEMESET_LINK_ID) as HTMLLinkElement | null;

	if (existingLink && existingLink.getAttribute('href') === targetHref && existingLink.sheet) {
		root.setAttribute('data-themeset', themeset);
		syncMetaThemeColor();
		return;
	}

	const nextLink = document.createElement('link');
	nextLink.rel = 'stylesheet';
	nextLink.href = targetHref;

	const finalize = () => {
		if (requestId !== pendingThemesetRequest) {
			nextLink.remove();
			return;
		}
		if (existingLink && existingLink !== nextLink) {
			existingLink.remove();
		}
		nextLink.id = THEMESET_LINK_ID;
		root.setAttribute('data-themeset', themeset);
		syncMetaThemeColor();
	};

	nextLink.addEventListener('load', finalize, { once: true });
	nextLink.addEventListener('error', finalize, { once: true });
	document.head.appendChild(nextLink);
}

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
			const resolved = next && (THEMESET_IDS as readonly string[]).includes(next) ? next : DEFAULT_THEMESET_ID;
			memoryThemeset = resolved;
			applyThemesetToDocument(resolved);
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
 * and lazy stylesheet loading conforming to ADR 012 key namespacing and SSR safety.
 */
export function useThemeset() {
	const themeset = useSyncExternalStore(subscribeThemeset, getThemesetSnapshot, getServerSnapshot);

	const setThemeset = useCallback((nextThemeset: ThemesetId) => {
		if (typeof document !== 'undefined') {
			memoryThemeset = nextThemeset;
			if (nextThemeset === DEFAULT_THEMESET_ID) {
				try {
					localStorage.removeItem(STORAGE_KEYS.THEMESET);
				} catch {
					// Ignore storage access restrictions
				}
			} else {
				try {
					localStorage.setItem(STORAGE_KEYS.THEMESET, nextThemeset);
				} catch {
					// Ignore storage access restrictions
				}
			}
			applyThemesetToDocument(nextThemeset);
			window.dispatchEvent(new CustomEvent(THEMESET_CHANGE_EVENT, { detail: nextThemeset }));
		}
	}, []);

	return [themeset, setThemeset] as const;
}
