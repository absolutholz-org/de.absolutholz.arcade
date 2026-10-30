import { useI18n } from '@arcade/lib-i18n/hooks/useI18n';
import React, { useState } from 'react';
import { Button } from '../Button';
import { ConsentDialog } from '../ConsentDialog';
import * as S from './_PrivacySettingRow.styles';
import type { PrivacySettingRowProps } from './_PrivacySettingRow.types';

export function PrivacySettingRow({ className, id = 'privacy-setting-row' }: PrivacySettingRowProps) {
	const { t } = useI18n();
	const [isOpen, setIsOpen] = useState(false);

	return (
		<S.PrivacySettingRowContainer id={id} className={className}>
			<S.PrivacySettingInfo>
				<S.PrivacySettingTitle>{t('consent.modal.title')}</S.PrivacySettingTitle>
				<S.PrivacySettingDescription>{t('consent.modal.description')}</S.PrivacySettingDescription>
			</S.PrivacySettingInfo>
			<Button variant="outline" size="md" type="button" onClick={() => setIsOpen(true)}>
				{t('consent.modal.title')} →
			</Button>
			<ConsentDialog isOpen={isOpen} onClose={() => setIsOpen(false)} />
		</S.PrivacySettingRowContainer>
	);
}
