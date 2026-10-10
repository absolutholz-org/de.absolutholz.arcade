import { useI18n } from '@arcade/lib-i18n/hooks/useI18n';
import { Dialog } from '@arcade/lib-ui/components/Dialog';
import { LanguageSwitcher } from '@arcade/lib-ui/components/LanguageSwitcher';
import { SchemeSwitcher } from '@arcade/lib-ui/components/SchemeSwitcher';
import { Switch } from '@arcade/lib-ui/components/Switch';
import type { JSX } from 'react';
import * as S from './SettingsDialog.styles';
import type { SettingsDialogProps } from './SettingsDialog.types';

export function SettingsDialog({
	isOpen,
	onClose,
	settings,
	onUpdateSettings,
	activeLanguage,
	onLanguageChange,
}: SettingsDialogProps): JSX.Element {
	const { t } = useI18n('queens');

	return (
		<Dialog isOpen={isOpen} onCancel={onClose} title={t('settings.title')} showCloseButton={true}>
			<S.SettingsContent>
				<S.Section>
					<h3>{t('settings.gameplayTab')}</h3>

					<S.SettingItem>
						<Switch
							id="queens-settings-autocross"
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
