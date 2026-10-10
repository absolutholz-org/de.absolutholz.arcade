import { useI18n } from '@arcade/lib-i18n/hooks/useI18n';
import type { SupportedLanguageCode } from '@arcade/lib-i18n/types/i18n.types';
import { Dialog } from '@arcade/lib-ui/components/Dialog';
import { LanguageSwitcher } from '@arcade/lib-ui/components/LanguageSwitcher';
import { SchemeSwitcher } from '@arcade/lib-ui/components/SchemeSwitcher';
import { Switch } from '@arcade/lib-ui/components/Switch';
import type { JSX } from 'react';
import type { NonogramSettings } from '../../engine/types';
import * as S from './SettingsDialog.styles';

export interface SettingsDialogProps {
	isOpen: boolean;
	onClose: () => void;
	settings: NonogramSettings;
	onUpdateSettings: (settings: NonogramSettings) => void;
	activeLanguage: SupportedLanguageCode;
	onLanguageChange: (lang: SupportedLanguageCode) => void;
}

export function SettingsDialog({
	isOpen,
	onClose,
	settings,
	onUpdateSettings,
	activeLanguage,
	onLanguageChange,
}: SettingsDialogProps): JSX.Element {
	const { t } = useI18n('nonogram');

	return (
		<Dialog isOpen={isOpen} onCancel={onClose} title={t('settings.title')} showCloseButton={true}>
			<S.SettingsContent>
				<S.Section>
					<h3>{t('settings.gameplayTab')}</h3>

					<S.SettingItem>
						<Switch
							label={t('settings.autoCross.label')}
							checked={settings.autoCross}
							onChange={(e) =>
								onUpdateSettings({
									...settings,
									autoCross: e.target.checked,
								})
							}
						/>
						<p>{t('settings.autoCross.description')}</p>
					</S.SettingItem>
				</S.Section>

				<S.Section>
					<h3>{t('settings.siteTab')}</h3>

					<S.SiteControlsRow>
						<span>{t('settings.colorScheme')}</span>
						<SchemeSwitcher />
					</S.SiteControlsRow>

					<S.SiteControlsRow>
						<span>{t('settings.language')}</span>
						<LanguageSwitcher activeLanguage={activeLanguage} onLanguageChange={onLanguageChange} />
					</S.SiteControlsRow>
				</S.Section>
			</S.SettingsContent>
		</Dialog>
	);
}
