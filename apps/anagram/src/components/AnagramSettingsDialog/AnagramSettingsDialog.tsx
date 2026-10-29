import { useI18n } from '@arcade/lib-i18n/hooks/useI18n';
import { Dialog } from '@arcade/lib-ui/components/Dialog';
import { LanguageSwitcher } from '@arcade/lib-ui/components/LanguageSwitcher';
import { SchemeSwitcher } from '@arcade/lib-ui/components/SchemeSwitcher';
import type { JSX } from 'react';
import * as S from './AnagramSettingsDialog.styles.js';
import type { AnagramSettingsDialogProps } from './AnagramSettingsDialog.types.js';

export function AnagramSettingsDialog({
	isOpen,
	onClose,
	activeLanguage,
	onLanguageChange,
}: AnagramSettingsDialogProps): JSX.Element {
	const { t: tCommon } = useI18n('common');

	return (
		<Dialog isOpen={isOpen} onCancel={onClose} title={tCommon('settings.title')} showCloseButton={true}>
			<S.SettingsContent>
				<S.Section>
					<h3>{tCommon('settings.appearanceSectionTitle')}</h3>

					<S.SiteControlsRow>
						<span>{tCommon('settings.schemeSectionTitle')}</span>
						<SchemeSwitcher />
					</S.SiteControlsRow>

					<S.SiteControlsRow>
						<span>{tCommon('settings.languageSectionTitle')}</span>
						<LanguageSwitcher activeLanguage={activeLanguage} onLanguageChange={onLanguageChange} />
					</S.SiteControlsRow>
				</S.Section>
			</S.SettingsContent>
		</Dialog>
	);
}
