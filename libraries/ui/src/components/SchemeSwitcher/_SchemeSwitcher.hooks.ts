import { useI18n } from '@arcade/lib-i18n/hooks/useI18n';
import { useEffect, useState } from 'react';
import { STORAGE_KEYS } from '../../constants/storage';
import type { ICollapsibleListboxOption } from '../CollapsibleListbox';
import { SCHEME_STORAGE_KEY_LEGACY } from './_SchemeSwitcher.constants';
import type { Scheme } from './_SchemeSwitcher.types';

export function useScheme() {
	const [scheme, setScheme] = useState<Scheme>(() => {
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
	});

	useEffect(() => {
		if (typeof document === 'undefined') {
			return;
		}
		const root = document.documentElement;
		if (scheme === 'system') {
			root.style.removeProperty('color-scheme');
			try {
				localStorage.removeItem(STORAGE_KEYS.SCHEME);
				localStorage.removeItem(SCHEME_STORAGE_KEY_LEGACY);
			} catch {
				// Ignore storage access restrictions
			}
		} else {
			root.style.setProperty('color-scheme', scheme);
			try {
				localStorage.setItem(STORAGE_KEYS.SCHEME, scheme);
			} catch {
				// Ignore storage access restrictions
			}
		}
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
