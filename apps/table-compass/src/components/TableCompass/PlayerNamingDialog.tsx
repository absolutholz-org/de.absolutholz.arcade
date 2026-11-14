import { useI18n } from '@arcade/lib-i18n/hooks/useI18n';
import { Dialog } from '@arcade/lib-ui/components/Dialog';
import { Stack } from '@arcade/lib-ui/components/Stack';
import { TextField } from '@arcade/lib-ui/components/TextField';
import * as S from './TableCompass.styles';
import type { Seat } from './TableCompass.types';
import { PLAYER_CONFIGS } from './constants';

interface PlayerNamingDialogProps {
	isOpen: boolean;
	seats: Seat[];
	onUpdateName: (seatId: string, name: string) => void;
	onStartCompass: () => void;
	onClose: () => void;
}

export function PlayerNamingDialog({ isOpen, seats, onUpdateName, onStartCompass, onClose }: PlayerNamingDialogProps) {
	const { t } = useI18n();

	return (
		<Dialog
			isOpen={isOpen}
			onCancel={onClose}
			onConfirm={onStartCompass}
			confirmText={t('tools.tableCompass.naming.startCompass')}
			cancelText={t('actions.cancel')}
			title={t('tools.tableCompass.naming.title')}
			message={t('tools.tableCompass.naming.subtitle')}
		>
			<Stack spacing="sm">
				{seats.map((seat, idx) => {
					const config = PLAYER_CONFIGS[seat.playerConfigIndex];
					const shapeLabel = t(config.shapeKey);
					const label = t('tools.tableCompass.naming.playerLabel', {
						index: idx + 1,
						shape: shapeLabel,
					});

					return (
						<Stack key={seat.id} direction="row" align="center" spacing="sm">
							<div
								className={S.NamingShapeBadge}
								style={{
									borderColor: config.color,
									color: config.color,
									backgroundColor: config.bgLight,
								}}
								aria-hidden="true"
							>
								{config.icon}
							</div>
							<div className={S.NamingFieldWrap}>
								<TextField
									label={label}
									value={seat.name}
									onChange={(e) => onUpdateName(seat.id, e.target.value)}
									fullWidth
								/>
							</div>
						</Stack>
					);
				})}
			</Stack>
		</Dialog>
	);
}
