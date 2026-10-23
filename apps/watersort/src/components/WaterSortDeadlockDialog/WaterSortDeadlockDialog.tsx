import { useI18n } from '@arcade/lib-i18n/hooks/useI18n';
import { Button } from '@arcade/lib-ui/components/Button';
import { Dialog } from '@arcade/lib-ui/components/Dialog';
import type { JSX } from 'react';
import * as S from './WaterSortDeadlockDialog.styles.js';
import type { WaterSortDeadlockDialogProps } from './WaterSortDeadlockDialog.types.js';

export function WaterSortDeadlockDialog({
	isOpen,
	canUndo,
	difficulty,
	onUndo,
	onRestart,
	onNextPuzzle,
}: WaterSortDeadlockDialogProps): JSX.Element {
	const { t, language } = useI18n('watersort');
	const lobbyHref = `/watersort/${language}/?difficulty=${difficulty}`;

	return (
		<Dialog isOpen={isOpen} onCancel={canUndo ? onUndo : onRestart} title={t('deadlock.title')}>
			<div className={S.deadlockContent}>
				<p className={S.deadlockDescription}>{t('deadlock.description')}</p>

				<div className={S.deadlockActions}>
					{canUndo && (
						<Button variant="secondary" onClick={onUndo}>
							{t('deadlock.undo')}
						</Button>
					)}
					<Button variant="secondary" onClick={onRestart}>
						{t('deadlock.restart')}
					</Button>
					<Button variant="secondary" onClick={onNextPuzzle}>
						{t('deadlock.newGame')}
					</Button>
					<Button as="a" href={lobbyHref} variant="ghost">
						{t('deadlock.backToLobby')}
					</Button>
				</div>
			</div>
		</Dialog>
	);
}
