import { useEffect, useState } from 'react';
import { STORAGE_KEYS } from '../constants/storage';
import { DEFAULT_THEMESET_ID, THEMESET_IDS, type ThemesetId } from '../styles/theme/theme.constants';

const THEMESET_CHANGE_EVENT = 'arcade:themeset-change';

/**
 * Hook to read and update the active themeset with localStorage persistence
 * conforming strictly to ADR 012 key namespacing.
 */
export function useThemeset() {
	const [themeset, setThemesetState] = useState<ThemesetId>(() => {
		if (typeof window === 'undefined') {
			return DEFAULT_THEMESET_ID;
		}
		try {
			const stored = localStorage.getItem(STORAGE_KEYS.THEMESET) as ThemesetId | null;
			if (stored && (THEMESET_IDS as readonly string[]).includes(stored)) {
				return stored;
			}
		} catch {
			// Ignore storage access restrictions in restricted or sandboxed environments
		}
		return DEFAULT_THEMESET_ID;
	});

	const setThemeset = (nextThemeset: ThemesetId) => {
		setThemesetState(nextThemeset);
		if (typeof document !== 'undefined') {
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
	};

	useEffect(() => {
		if (typeof window === 'undefined') return;

		const handleStorage = (event: StorageEvent) => {
			if (event.key === STORAGE_KEYS.THEMESET) {
				const next = event.newValue as ThemesetId | null;
				if (next && (THEMESET_IDS as readonly string[]).includes(next)) {
					setThemesetState(next);
				} else {
					setThemesetState(DEFAULT_THEMESET_ID);
				}
			}
		};

		const handleCustomEvent = (event: Event) => {
			const customEvent = event as CustomEvent<ThemesetId>;
			if (customEvent.detail && (THEMESET_IDS as readonly string[]).includes(customEvent.detail)) {
				setThemesetState(customEvent.detail);
			}
		};

		window.addEventListener('storage', handleStorage);
		window.addEventListener(THEMESET_CHANGE_EVENT, handleCustomEvent);

		return () => {
			window.removeEventListener('storage', handleStorage);
			window.removeEventListener(THEMESET_CHANGE_EVENT, handleCustomEvent);
		};
	}, []);

	return [themeset, setThemeset] as const;
}
