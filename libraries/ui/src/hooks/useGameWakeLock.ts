import type { GameSettingsConfig } from '@arcade/lib-games';
import { getGameSettings } from '@arcade/lib-storage';
import { useEffect, useState } from 'react';
import { type UseWakeLockReturn, useWakeLock } from './useWakeLock';

/**
 * Manages Screen Wake Lock for an arcade game based on its `GameSettingsConfig`,
 * persisted user preference (`arcade::[gameId]::settings`), and active gameplay state.
 */
export function useGameWakeLock<T extends Record<string, unknown>>(
	config: GameSettingsConfig<T>,
	isActiveGameplay: boolean,
	settings?: object,
): UseWakeLockReturn {
	const wakeLockSupportedInConfig = config.wakeLock?.supported ?? false;
	const defaultEnabled = config.wakeLock?.defaultEnabled ?? false;

	const [storedEnabled, setStoredEnabled] = useState<boolean>(defaultEnabled);

	useEffect(() => {
		if (!wakeLockSupportedInConfig) {
			return;
		}
		let isMounted = true;
		getGameSettings(config.gameId, {
			...config.defaults,
			keepScreenOn: defaultEnabled,
		})
			.then((persisted) => {
				if (isMounted) {
					setStoredEnabled(Boolean(persisted.keepScreenOn ?? defaultEnabled));
				}
			})
			.catch(() => {
				// Fall back to defaultEnabled if storage read fails
			});

		return () => {
			isMounted = false;
		};
	}, [config.gameId, config.defaults, wakeLockSupportedInConfig, defaultEnabled]);

	const liveKeepScreenOn =
		settings !== undefined && 'keepScreenOn' in settings
			? (settings as { keepScreenOn?: unknown }).keepScreenOn
			: undefined;
	const hasLiveSetting = typeof liveKeepScreenOn === 'boolean';
	const isPreferenceEnabled = hasLiveSetting ? liveKeepScreenOn : storedEnabled;

	const result = useWakeLock(wakeLockSupportedInConfig && isPreferenceEnabled && isActiveGameplay);

	if (!wakeLockSupportedInConfig) {
		return { isSupported: false, isActive: false };
	}

	return result;
}
