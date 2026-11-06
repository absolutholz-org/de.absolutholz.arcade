import { useI18n } from '@arcade/lib-i18n/hooks/useI18n';
import { Button } from '@arcade/lib-ui/components/Button';
import { Dialog } from '@arcade/lib-ui/components/Dialog';
import type { JSX } from 'react';
import * as S from './LiquidSortDeadlockDialog.styles.js';
import type { LiquidSortDeadlockDialogProps } from './LiquidSortDeadlockDialog.types.js';

export function LiquidSortDeadlockDialog({
	isOpen,
	canUndo,
	difficulty,
	onUndo,
	onRestart,
	onNextPuzzle,
}: LiquidSortDeadlockDialogProps): JSX.Element {
	const { t, language } = useI18n('liquid-sort');
	const lobbyHref = `/liquid-sort/${language}/?difficulty=${difficulty}`;

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
