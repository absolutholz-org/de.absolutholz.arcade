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
	const { t } = useI18n('tents');

	return (
		<Dialog isOpen={isOpen} onCancel={onClose} title={t('settings.title')} showCloseButton={true}>
			<S.SettingsContent>
				<S.Section>
					<h3>{t('settings.gameplayTab')}</h3>

					<S.SettingItem>
						<Switch
							id="tents-settings-highlight-violations"
							label={t('settings.highlightViolations.label')}
							checked={settings.highlightViolations}
							onChange={(e) =>
								onUpdateSettings({
									...settings,
									highlightViolations: e.target.checked,
								})
							}
						/>
						<p>{t('settings.highlightViolations.description')}</p>
					</S.SettingItem>

					<S.SettingItem>
						<Switch
							id="tents-settings-highlight-clues"
							label={t('settings.highlightClues.label')}
							checked={settings.highlightClues}
							onChange={(e) =>
								onUpdateSettings({
									...settings,
									highlightClues: e.target.checked,
								})
							}
						/>
						<p>{t('settings.highlightClues.description')}</p>
					</S.SettingItem>

					<S.SettingItem>
						<Switch
							id="tents-settings-autograss"
							label={t('settings.autoGrass.label')}
							checked={settings.autoGrass}
							onChange={(e) =>
								onUpdateSettings({
									...settings,
									autoGrass: e.target.checked,
								})
							}
						/>
						<p>{t('settings.autoGrass.description')}</p>
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
