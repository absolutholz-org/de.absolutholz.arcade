import { useI18n } from '@arcade/lib-i18n/hooks/useI18n';
import { Button } from '@arcade/lib-ui/components/Button';
import { Dialog } from '@arcade/lib-ui/components/Dialog';
import { Timer } from '@arcade/lib-ui/components/Timer';
import type { JSX } from 'react';
import * as S from './VictoryDialog.styles.js';
import type { VictoryDialogProps } from './VictoryDialog.types.js';

export function VictoryDialog({
	isOpen,
	elapsedSeconds,
	isNewBestTime,
	hasNextPuzzle = false,
	onNextPuzzle,
	onPlayAgain,
	onClose,
	gameMode = 'standard',
}: VictoryDialogProps): JSX.Element {
	const { t, language } = useI18n('hashiwokakero');

	return (
		<Dialog
			isOpen={isOpen}
			onCancel={onClose}
			title={t('victory.title')}
			message={t('victory.congratulations')}
			showCloseButton={true}
		>
			<S.VictoryContent>
				{gameMode === 'standard' && (
					<S.TimeCard>
						<span data-slot="label">{t('status.time')}</span>
						<Timer seconds={elapsedSeconds} size="lg" showIcon={false} />
					</S.TimeCard>
				)}

				{isNewBestTime && gameMode === 'standard' && (
					<S.BestTimeBadge>{t('status.newBestTime')}</S.BestTimeBadge>
				)}

				<S.Actions>
					{hasNextPuzzle && onNextPuzzle && (
						<Button onClick={onNextPuzzle} variant="primary" size="md">
							{t('victory.nextLevel')}
						</Button>
					)}
					<Button onClick={onPlayAgain} variant={hasNextPuzzle ? 'secondary' : 'primary'} size="md">
						{t('victory.playAgain')}
					</Button>
					<a href={`/hashiwokakero/${language}/`}>{t('controls.backToLobby')}</a>
				</S.Actions>
			</S.VictoryContent>
		</Dialog>
	);
}
