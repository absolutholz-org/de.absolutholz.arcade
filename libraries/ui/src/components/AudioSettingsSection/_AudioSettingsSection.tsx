import {
	initAudioSync,
	isHapticsEnabled,
	isSoundEnabled,
	playTap,
	setHapticsEnabled,
	setSoundEnabled,
	triggerHaptic,
} from '@arcade/lib-audio';
import { useI18n } from '@arcade/lib-i18n/hooks/useI18n';
import { getGlobalSettings, getGlobalSettingsSync, saveGlobalSettings } from '@arcade/lib-storage/settings';
import React, { useEffect, useState } from 'react';
import { Switch } from '../Switch';
import * as S from './_AudioSettingsSection.styles';
import type { AudioSettingsSectionProps } from './_AudioSettingsSection.types';

export function AudioSettingsSection({ className, id = 'audio-settings-section' }: AudioSettingsSectionProps) {
	const { t } = useI18n();

	// Initialize with synchronous state from storage if available
	const [sound, setSound] = useState<boolean>(() => {
		const initial = getGlobalSettingsSync();
		initAudioSync(initial);
		return initial.soundEnabled;
	});

	const [haptics, setHaptics] = useState<boolean>(() => {
		const initial = getGlobalSettingsSync();
		return initial.hapticsEnabled;
	});

	// Re-sync with async storage driver on mount (e.g. IndexedDB or custom driver)
	useEffect(() => {
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
	}, []);

	const handleSoundToggle = (enabled: boolean) => {
		setSound(enabled);
		setSoundEnabled(enabled);
		saveGlobalSettings({ soundEnabled: enabled });
		if (enabled) {
			playTap();
		}
	};

	const handleHapticsToggle = (enabled: boolean) => {
		setHaptics(enabled);
		setHapticsEnabled(enabled);
		saveGlobalSettings({ hapticsEnabled: enabled });
		if (enabled) {
			triggerHaptic('light');
		}
	};

	return (
		<S.AudioSettingsContainer id={id} className={className}>
			<S.AudioSettingRow>
				<S.AudioSettingInfo>
					<S.AudioSettingTitle>{t('settings.soundTitle')}</S.AudioSettingTitle>
					<S.AudioSettingDescription>{t('settings.soundDescription')}</S.AudioSettingDescription>
				</S.AudioSettingInfo>
				<Switch
					id="settings-sound-switch"
					aria-label={t('settings.soundTitle')}
					checked={sound}
					onChange={(e) => handleSoundToggle(e.target.checked)}
				/>
			</S.AudioSettingRow>

			<S.AudioSettingRow>
				<S.AudioSettingInfo>
					<S.AudioSettingTitle>{t('settings.hapticsTitle')}</S.AudioSettingTitle>
					<S.AudioSettingDescription>{t('settings.hapticsDescription')}</S.AudioSettingDescription>
				</S.AudioSettingInfo>
				<Switch
					id="settings-haptics-switch"
					aria-label={t('settings.hapticsTitle')}
					checked={haptics}
					onChange={(e) => handleHapticsToggle(e.target.checked)}
				/>
			</S.AudioSettingRow>
		</S.AudioSettingsContainer>
	);
}
