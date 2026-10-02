import { useEffect, useState } from 'react';
import { SCHEME_STORAGE_KEY, SCHEME_STORAGE_KEY_LEGACY } from './_SchemeSwitcher.constants';
import type { Scheme } from './_SchemeSwitcher.types';

export function useScheme() {
	const [scheme, setScheme] = useState<Scheme>(() => {
		if (typeof window === 'undefined') {
			return 'system';
		}
		try {
			const stored = (localStorage.getItem(SCHEME_STORAGE_KEY) ||
				localStorage.getItem(SCHEME_STORAGE_KEY_LEGACY)) as Scheme | null;
			if (stored === 'light' || stored === 'dark' || stored === 'system') {
				return stored;
			}
		} catch {
			// Ignore localStorage access restrictions in sandboxed or private browsing environments
		}
		return 'system';
	});

	useEffect(() => {
		if (typeof document === 'undefined') {
			return;
		}
		const root = document.documentElement;
		if (scheme === 'system') {
			root.style.removeProperty('color-scheme');
			try {
				localStorage.removeItem(SCHEME_STORAGE_KEY);
				localStorage.removeItem(SCHEME_STORAGE_KEY_LEGACY);
			} catch {
				// Ignore storage access restrictions
			}
		} else {
			root.style.setProperty('color-scheme', scheme);
			try {
				localStorage.setItem(SCHEME_STORAGE_KEY, scheme);
			} catch {
				// Ignore storage access restrictions
			}
		}
	}, [scheme]);

	return [scheme, setScheme] as const;
}
