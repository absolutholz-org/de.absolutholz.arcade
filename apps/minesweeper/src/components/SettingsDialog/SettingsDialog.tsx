import { useI18n } from '@arcade/lib-i18n/hooks/useI18n';
import type { SupportedLanguageCode } from '@arcade/lib-i18n/types/i18n.types';
import { Dialog } from '@arcade/lib-ui/components/Dialog';
import { LanguageSwitcher } from '@arcade/lib-ui/components/LanguageSwitcher';
import { SchemeSwitcher } from '@arcade/lib-ui/components/SchemeSwitcher';
import { Switch } from '@arcade/lib-ui/components/Switch';
import type { JSX } from 'react';
import type { MinesweeperSettings } from '../../engine/types';
import * as S from './SettingsDialog.styles';

export interface SettingsDialogProps {
	isOpen: boolean;
	onClose: () => void;
	settings: MinesweeperSettings;
	onUpdateSettings: (settings: MinesweeperSettings) => void;
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
	const { t } = useI18n('minesweeper');

	return (
		<Dialog isOpen={isOpen} onCancel={onClose} title={t('settings.title')} showCloseButton={true}>
			<S.SettingsContent>
				<S.Section>
					<h3>{t('settings.gameplayTab')}</h3>

					<S.SettingItem>
						<Switch
							label={t('settings.firstClickSafe.label')}
							checked={settings.firstClickSafe}
							onChange={(e) =>
								onUpdateSettings({
									...settings,
									firstClickSafe: e.target.checked,
								})
							}
						/>
						<p>{t('settings.firstClickSafe.description')}</p>
					</S.SettingItem>

					<S.SettingItem>
						<Switch
							label={t('settings.questionMarks.label')}
							checked={settings.questionMarks}
							onChange={(e) =>
								onUpdateSettings({
									...settings,
									questionMarks: e.target.checked,
								})
							}
						/>
						<p>{t('settings.questionMarks.description')}</p>
					</S.SettingItem>

					<S.SettingItem>
						<Switch
							label={t('settings.fitToScreen.label')}
							checked={settings.fitToScreen}
							onChange={(e) =>
								onUpdateSettings({
									...settings,
									fitToScreen: e.target.checked,
								})
							}
						/>
						<p>{t('settings.fitToScreen.description')}</p>
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
