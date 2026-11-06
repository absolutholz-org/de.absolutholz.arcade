import { initAudioSync, playTap, setHapticsEnabled, setSoundEnabled, triggerHaptic } from '@arcade/lib-audio';
import { useI18n } from '@arcade/lib-i18n/hooks/useI18n';
import type { SupportedLanguageCode } from '@arcade/lib-i18n/types/i18n.types';
import { getGlobalSettings, getGlobalSettingsSync, saveGlobalSettings } from '@arcade/lib-storage/settings';
import { useCallback, useEffect, useId, useState } from 'react';
import { useScheme } from '../SchemeSwitcher';
import type { Scheme } from '../SchemeSwitcher/_SchemeSwitcher.types';

export interface UseGameSettingsDialogProps {
	id?: string;
	isOpen: boolean;
	onLanguageChange?: (language: SupportedLanguageCode) => void;
}

export function useGameSettingsDialog({ id, isOpen, onLanguageChange }: UseGameSettingsDialogProps) {
	const generatedId = useId();
	const dialogId = id || `game-settings-dialog-${generatedId}`;

	const { language, changeLanguage, t } = useI18n('common');
	const [scheme, setScheme] = useScheme();

	const [sound, setSound] = useState<boolean>(() => {
		const initial = getGlobalSettingsSync();
		initAudioSync(initial);
		return initial.soundEnabled;
	});

	const [haptics, setHaptics] = useState<boolean>(() => {
		const initial = getGlobalSettingsSync();
		return initial.hapticsEnabled;
	});

	useEffect(() => {
		if (!isOpen) {
			return;
		}
		let isMounted = true;
		getGlobalSettings().then((settings) => {
			if (isMounted) {
				setSound(settings.soundEnabled);
				setHaptics(settings.hapticsEnabled);
				initAudioSync(settings);
			}
		});
		return () => {
			isMounted = false;
		};
	}, [isOpen]);

	const handleSoundToggle = useCallback((enabled: boolean) => {
		setSound(enabled);
		setSoundEnabled(enabled);
		saveGlobalSettings({ soundEnabled: enabled });
		if (enabled) {
			playTap();
		}
	}, []);

	const handleHapticsToggle = useCallback((enabled: boolean) => {
		setHaptics(enabled);
		setHapticsEnabled(enabled);
		saveGlobalSettings({ hapticsEnabled: enabled });
		if (enabled) {
			triggerHaptic('light');
		}
	}, []);

	const handleSchemeChange = useCallback(
		(nextScheme: Scheme) => {
			setScheme(nextScheme);
		},
		[setScheme],
	);

	const handleLanguageChange = useCallback(
		(nextLang: SupportedLanguageCode) => {
			if (nextLang === language) return;
			changeLanguage(nextLang);
			if (typeof window !== 'undefined') {
				const currentPath = window.location.pathname;
				if (currentPath.includes(`/${language}`)) {
					const targetPath = currentPath.replace(new RegExp(`/${language}(/|$)`), `/${nextLang}$1`);
					window.history.replaceState(
						window.history.state,
						'',
						targetPath + window.location.search + window.location.hash,
					);
				}
			}
			onLanguageChange?.(nextLang);
		},
		[changeLanguage, language, onLanguageChange],
	);

	return {
		dialogId,
		sound,
		haptics,
		scheme,
		language,
		t,
		handleSoundToggle,
		handleHapticsToggle,
		handleSchemeChange,
		handleLanguageChange,
	};
}
