import type { GameSettingsConfig } from '@arcade/lib-games';
import { DEFAULT_LANGUAGE, SUPPORTED_LANGUAGES } from '@arcade/lib-i18n/constants/languages';
import type { SupportedLanguageCode } from '@arcade/lib-i18n/types/i18n.types';
import { getGameSettings, saveGameSettings } from '@arcade/lib-storage';
import { useCallback, useEffect, useMemo, useState } from 'react';
import type { SupportedLanguage } from './_GameSettingsPanel.types';

export function resolveSupportedLanguage(lang: SupportedLanguage): SupportedLanguageCode {
	const baseCode = (typeof lang === 'string' ? lang : DEFAULT_LANGUAGE).split('-')[0];
	const matched = SUPPORTED_LANGUAGES.find((item) => item.code === baseCode);
	return matched ? matched.code : DEFAULT_LANGUAGE;
}

export function useGameSettingsPanel<T extends Record<string, unknown>>(
	config: GameSettingsConfig<T>,
	onSettingsChange?: (newSettings: T) => void,
	onResetProgress?: () => void,
) {
	const effectiveDefaults = useMemo<T>(() => {
		if (!config.wakeLock?.supported) {
			return config.defaults;
		}
		return {
			keepScreenOn: config.wakeLock.defaultEnabled,
			...config.defaults,
		} as T;
	}, [config.defaults, config.wakeLock]);

	const [settings, setSettings] = useState<T>(effectiveDefaults);
	const [isLoaded, setIsLoaded] = useState<boolean>(false);
	const [isResetDialogOpen, setIsResetDialogOpen] = useState<boolean>(false);

	useEffect(() => {
		let isMounted = true;
		getGameSettings(config.gameId, effectiveDefaults)
			.then((persisted) => {
				if (isMounted) {
					setSettings(persisted);
					setIsLoaded(true);
				}
			})
			.catch((err) => {
				console.error(`Failed to load settings for ${config.gameId}:`, err);
				if (isMounted) {
					setIsLoaded(true);
				}
			});

		return () => {
			isMounted = false;
		};
	}, [config.gameId, effectiveDefaults]);

	const updateSetting = useCallback(
		(key: string, value: unknown) => {
			setSettings((prev) => {
				const next = {
					...prev,
					[key]: value,
				};
				// Asynchronously persist
				void saveGameSettings(config.gameId, next).catch((err) => {
					console.error(`Failed to save settings for ${config.gameId}:`, err);
				});
				onSettingsChange?.(next);
				return next;
			});
		},
		[config.gameId, onSettingsChange],
	);

	const openResetDialog = useCallback(() => {
		setIsResetDialogOpen(true);
	}, []);

	const closeResetDialog = useCallback(() => {
		setIsResetDialogOpen(false);
	}, []);

	const confirmResetProgress = useCallback(() => {
		setIsResetDialogOpen(false);
		onResetProgress?.();
	}, [onResetProgress]);

	return {
		settings,
		isLoaded,
		updateSetting,
		isResetDialogOpen,
		openResetDialog,
		closeResetDialog,
		confirmResetProgress,
	};
}
