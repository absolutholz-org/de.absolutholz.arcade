import { useI18n } from '@arcade/lib-i18n/hooks/useI18n';
import { Dialog } from '@arcade/lib-ui/components/Dialog';
import { LanguageSwitcher } from '@arcade/lib-ui/components/LanguageSwitcher';
import { SchemeSwitcher } from '@arcade/lib-ui/components/SchemeSwitcher';
import { Switch } from '@arcade/lib-ui/components/Switch';
import type { JSX } from 'react';
import * as S from './SettingsDialog.styles.js';
import type { SettingsDialogProps } from './SettingsDialog.types.js';

export function SettingsDialog({
	isOpen,
	onClose,
	settings,
	onUpdateSettings,
	activeLanguage,
	onLanguageChange,
}: SettingsDialogProps): JSX.Element {
	const { t } = useI18n('bridges');

	return (
		<Dialog isOpen={isOpen} onCancel={onClose} title={t('settings.title')} showCloseButton={true}>
			<S.SettingsContent>
				<S.Section>
					<h3>{t('settings.gameplayTab')}</h3>

					<S.SettingItem>
						<Switch
							id="hashi-settings-zen"
							label={t('settings.zenMode.label')}
							checked={settings.gameMode === 'zen'}
							onChange={(e) =>
								onUpdateSettings({
									...settings,
									gameMode: e.target.checked ? 'zen' : 'standard',
								})
							}
						/>
						<p>{t('settings.zenMode.description')}</p>
					</S.SettingItem>

					<S.SettingItem>
						<Switch
							id="hashi-settings-satisfied"
							label={t('settings.highlightSatisfied.label')}
							checked={settings.highlightSatisfied}
							onChange={(e) =>
								onUpdateSettings({
									...settings,
									highlightSatisfied: e.target.checked,
								})
							}
						/>
						<p>{t('settings.highlightSatisfied.description')}</p>
					</S.SettingItem>

					<S.SettingItem>
						<Switch
							id="hashi-settings-overflow"
							label={t('settings.highlightOverflow.label')}
							checked={settings.highlightOverflow}
							onChange={(e) =>
								onUpdateSettings({
									...settings,
									highlightOverflow: e.target.checked,
								})
							}
						/>
						<p>{t('settings.highlightOverflow.description')}</p>
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
