import { useI18n } from '@arcade/lib-i18n/hooks/useI18n';
import type { JSX } from 'react';
import { Button } from '../Button';
import { Dialog } from '../Dialog';
import { Stack } from '../Stack';
import type { PauseDialogProps } from './_PauseDialog.types';

/**
 * Standardized in-game pause dialog across all Arcade games.
 * Consumes the design system's canonical Dialog primitive, offering
 * accessible modal behavior, localized strings, and standard Resume/Restart actions.
 */
export function PauseDialog({ isOpen, onResume, onRestart, id }: PauseDialogProps): JSX.Element {
	const { t } = useI18n('common');

	return (
		<Dialog
			id={id}
			isOpen={isOpen}
			onCancel={onResume}
			title={t('game.pause.title')}
			message={t('game.pause.description')}
			showCloseButton={false}
		>
			<Stack direction="column" spacing="md" fullWidth>
				<Button onClick={onResume} variant="primary" size="md">
					{t('game.pause.resume')}
				</Button>
				<Button onClick={onRestart} variant="outline" size="md">
					{t('game.pause.restart')}
				</Button>
			</Stack>
		</Dialog>
	);
}
