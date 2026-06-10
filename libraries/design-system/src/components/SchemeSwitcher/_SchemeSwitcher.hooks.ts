import { useEffect, useState } from 'react';
import type { Scheme } from './_SchemeSwitcher.types';
import { SCHEME_STORAGE_KEY } from './_SchemeSwitcher.constants';

export function useScheme() {
	const [scheme, setScheme] = useState<Scheme>(() => {
		return (localStorage.getItem(SCHEME_STORAGE_KEY) as Scheme) || 'system';
	});

	useEffect(() => {
		const root = document.documentElement;
		if (scheme === 'system') {
			root.style.removeProperty('color-scheme');
			localStorage.removeItem(SCHEME_STORAGE_KEY);
		} else {
			root.style.setProperty('color-scheme', scheme);
			localStorage.setItem(SCHEME_STORAGE_KEY, scheme);
		}
	}, [scheme]);

	return [scheme, setScheme] as const;
}
