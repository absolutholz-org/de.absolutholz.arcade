import { useI18n } from '@arcade/lib-i18n/hooks/useI18n';
import { Dialog } from '@arcade/lib-ui/components/Dialog';
import type { JSX } from 'react';
import type { DefeatDialogProps } from './DefeatDialog.types.js';

export function DefeatDialog({ isOpen, foundCount, totalCount, onPlayAgain, onClose }: DefeatDialogProps): JSX.Element {
	const { t } = useI18n('anagram');

	return (
		<Dialog
			isOpen={isOpen}
			title={t('defeat.title')}
			message={t('defeat.summary', { found: String(foundCount), total: String(totalCount) })}
			confirmText={t('controls.newRound')}
			onConfirm={onPlayAgain}
			onCancel={onClose}
		/>
	);
}
