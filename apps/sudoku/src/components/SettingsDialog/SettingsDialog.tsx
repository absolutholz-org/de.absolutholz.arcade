import { useI18n } from '@arcade/lib-i18n/hooks/useI18n';
import { Dialog } from '@arcade/lib-ui/components/Dialog';
import { LanguageSwitcher } from '@arcade/lib-ui/components/LanguageSwitcher';
import { SchemeSwitcher } from '@arcade/lib-ui/components/SchemeSwitcher';
import { Switch } from '@arcade/lib-ui/components/Switch';
import * as S from './SettingsDialog.styles';
import type { SettingsDialogProps } from './SettingsDialog.types';

export function SettingsDialog({
	isOpen,
	onClose,
	settings,
	onUpdateSettings,
	activeLanguage,
	onLanguageChange,
}: SettingsDialogProps) {
	const { t } = useI18n('sudoku');

	return (
		<Dialog isOpen={isOpen} onCancel={onClose} title={t('settings.title')} showCloseButton={true}>
			<S.SettingsContent>
				<S.Section>
					<h3>{t('settings.gameplayTab')}</h3>

					<S.SettingItem>
						<Switch
							label={t('settings.highlightPeerCells.label')}
							checked={settings.highlightPeerCells}
							onChange={(e) =>
								onUpdateSettings({
									...settings,
									highlightPeerCells: e.target.checked,
								})
							}
						/>
						<p>{t('settings.highlightPeerCells.description')}</p>
					</S.SettingItem>

					<S.SettingItem>
						<Switch
							label={t('settings.highlightPeerDigits.label')}
							checked={settings.highlightPeerDigits}
							onChange={(e) =>
								onUpdateSettings({
									...settings,
									highlightPeerDigits: e.target.checked,
								})
							}
						/>
						<p>{t('settings.highlightPeerDigits.description')}</p>
					</S.SettingItem>

					<S.SettingItem>
						<Switch
							label={t('settings.highlightErrors.label')}
							checked={settings.highlightErrors}
							onChange={(e) =>
								onUpdateSettings({
									...settings,
									highlightErrors: e.target.checked,
								})
							}
						/>
						<p>{t('settings.highlightErrors.description')}</p>
					</S.SettingItem>

					<S.SettingItem>
						<Switch
							label={t('settings.autoClearNotes.label')}
							checked={settings.autoClearNotes}
							onChange={(e) =>
								onUpdateSettings({
									...settings,
									autoClearNotes: e.target.checked,
								})
							}
						/>
						<p>{t('settings.autoClearNotes.description')}</p>
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
