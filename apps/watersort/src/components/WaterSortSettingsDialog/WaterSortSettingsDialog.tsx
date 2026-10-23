import { useI18n } from '@arcade/lib-i18n/hooks/useI18n';
import { Button } from '@arcade/lib-ui/components/Button';
import { Dialog } from '@arcade/lib-ui/components/Dialog';
import { Switch } from '@arcade/lib-ui/components/Switch';
import type { JSX } from 'react';
import * as S from './WaterSortSettingsDialog.styles.js';
import type { WaterSortSettingsDialogProps } from './WaterSortSettingsDialog.types.js';

export function WaterSortSettingsDialog({
	isOpen,
	settings,
	onClose,
	onUpdateSettings,
}: WaterSortSettingsDialogProps): JSX.Element {
	const { t } = useI18n('watersort');

	return (
		<Dialog isOpen={isOpen} onCancel={onClose} title={t('settings.title')}>
			<div className={S.settingsContent}>
				<div className={S.settingRow}>
					<div className={S.settingLabelGroup}>
						<span className={S.settingTitle}>{t('settings.colorblindPatterns.label')}</span>
						<span className={S.settingDesc}>{t('settings.colorblindPatterns.description')}</span>
					</div>
					<Switch
						checked={settings.colorblindPatterns}
						onChange={(e) => onUpdateSettings({ ...settings, colorblindPatterns: e.target.checked })}
						aria-label={t('settings.colorblindPatterns.label')}
					/>
				</div>

				<div className={S.settingRow}>
					<div className={S.settingLabelGroup}>
						<span className={S.settingTitle}>{t('settings.fluidAnimations.label')}</span>
						<span className={S.settingDesc}>{t('settings.fluidAnimations.description')}</span>
					</div>
					<Switch
						checked={settings.fluidAnimations}
						onChange={(e) => onUpdateSettings({ ...settings, fluidAnimations: e.target.checked })}
						aria-label={t('settings.fluidAnimations.label')}
					/>
				</div>
				<div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
					<Button variant="primary" onClick={onClose}>
						OK
					</Button>
				</div>
			</div>
		</Dialog>
	);
}
