import { useI18n } from '@arcade/lib-i18n/hooks/useI18n';
import { Button } from '@arcade/lib-ui/components/Button';
import { Dialog } from '@arcade/lib-ui/components/Dialog';
import type { JSX } from 'react';
import * as S from '../VictoryDialog/VictoryDialog.styles';

export interface DefeatDialogProps {
	isOpen: boolean;
	onPlayAgain: () => void;
	onClose: () => void;
}

export function DefeatDialog({ isOpen, onPlayAgain, onClose }: DefeatDialogProps): JSX.Element {
	const { t, language } = useI18n('minesweeper');

	return (
		<Dialog
			isOpen={isOpen}
			onCancel={onClose}
			title={t('defeat.title')}
			message={t('defeat.mineDetonated')}
			showCloseButton={true}
		>
			<S.VictoryContent>
				<S.Actions>
					<Button onClick={onPlayAgain} variant="primary" size="md">
						{t('defeat.playAgain')}
					</Button>
					<a href={`/minesweeper/${language}/`}>{t('defeat.newGame')}</a>
				</S.Actions>
			</S.VictoryContent>
		</Dialog>
	);
}
