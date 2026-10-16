import { useI18n } from '@arcade/lib-i18n/hooks/useI18n';
import { useCallback, useEffect, useSyncExternalStore } from 'react';
import { STORAGE_KEYS } from '../../constants/storage';
import type { ICollapsibleListboxOption } from '../CollapsibleListbox';
import { SCHEME_STORAGE_KEY_LEGACY } from './_SchemeSwitcher.constants';
import type { Scheme } from './_SchemeSwitcher.types';

const SCHEME_CHANGE_EVENT = 'arcade:scheme-change';

let memoryScheme: Scheme | null = null;

function getStoredScheme(): Scheme {
	if (typeof window === 'undefined') {
		return 'system';
	}
	try {
		const stored = (localStorage.getItem(STORAGE_KEYS.SCHEME) ||
			localStorage.getItem(SCHEME_STORAGE_KEY_LEGACY)) as Scheme | null;
		if (stored === 'light' || stored === 'dark' || stored === 'system') {
			return stored;
		}
	} catch {
		// Ignore storage access restrictions in restricted or sandboxed environments
	}
	return 'system';
}

function getSchemeSnapshot(): Scheme {
	if (memoryScheme) {
		return memoryScheme;
	}
	const stored = getStoredScheme();
	memoryScheme = stored;
	return stored;
}

function getServerSnapshot(): Scheme {
	return 'system';
}

function subscribeScheme(callback: () => void): () => void {
	if (typeof window === 'undefined') {
		return () => {};
	}

	const handleStorage = (event: StorageEvent) => {
		if (event.key === STORAGE_KEYS.SCHEME || event.key === SCHEME_STORAGE_KEY_LEGACY) {
			const next = event.newValue as Scheme | null;
			const validScheme = next === 'light' || next === 'dark' || next === 'system' ? next : 'system';
			memoryScheme = validScheme;
			applySchemeToDocument(validScheme);
			callback();
		}
	};

	const handleCustomEvent = (event: Event) => {
		const customEvent = event as CustomEvent<Scheme>;
		if (customEvent.detail) {
			memoryScheme = customEvent.detail;
		}
		callback();
	};

	window.addEventListener('storage', handleStorage);
	window.addEventListener(SCHEME_CHANGE_EVENT, handleCustomEvent);

	return () => {
		window.removeEventListener('storage', handleStorage);
		window.removeEventListener(SCHEME_CHANGE_EVENT, handleCustomEvent);
	};
}

function applySchemeToDocument(scheme: Scheme) {
	if (typeof document === 'undefined') {
		return;
	}
	const root = document.documentElement;
	if (scheme === 'system') {
		root.style.removeProperty('color-scheme');
	} else {
		root.style.setProperty('color-scheme', scheme);
	}
}

export function useScheme() {
	const scheme = useSyncExternalStore(subscribeScheme, getSchemeSnapshot, getServerSnapshot);

	const setScheme = useCallback((nextScheme: Scheme) => {
		memoryScheme = nextScheme;
		applySchemeToDocument(nextScheme);
		if (typeof window !== 'undefined') {
			try {
				if (nextScheme === 'system') {
					localStorage.removeItem(STORAGE_KEYS.SCHEME);
					localStorage.removeItem(SCHEME_STORAGE_KEY_LEGACY);
				} else {
					localStorage.setItem(STORAGE_KEYS.SCHEME, nextScheme);
				}
			} catch {
				// Ignore storage access restrictions
			}
			window.dispatchEvent(new CustomEvent(SCHEME_CHANGE_EVENT, { detail: nextScheme }));
		}
	}, []);

	useEffect(() => {
		applySchemeToDocument(scheme);
	}, [scheme]);

	return [scheme, setScheme] as const;
}

export function useSchemeOptions(): ICollapsibleListboxOption<Scheme>[] {
	const { t } = useI18n();

	return [
		{
			icon: 'light_mode',
			id: 'light',
			label: t('switchers.scheme.options.light'),
			title: t('switchers.scheme.options.light'),
		},
		{
			icon: 'dark_mode',
			id: 'dark',
			label: t('switchers.scheme.options.dark'),
			title: t('switchers.scheme.options.dark'),
		},
		{
			icon: 'contrast',
			id: 'system',
			label: t('switchers.scheme.options.system'),
			title: t('switchers.scheme.options.system'),
		},
	];
}
