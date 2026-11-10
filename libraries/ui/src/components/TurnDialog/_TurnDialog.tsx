import { useI18n } from '@arcade/lib-i18n/hooks/useI18n';
import type { JSX } from 'react';
import { Button } from '../Button';
import { Dialog } from '../Dialog';
import { Stack } from '../Stack';
import type { TurnDialogProps } from './_TurnDialog.types';

/**
 * Standardized turn-transition modal dialog across turn-based Arcade games.
 * Supports:
 * - Local Pass-and-Play mode: blocks gameplay until the next player confirms they have the device and are ready.
 * - Online Multiplayer waiting mode (`isWaiting={true}`): displays waiting message without confirmation button while awaiting opponent move.
 */
export function TurnDialog({
	isOpen,
	playerName = '',
	playerMark = '',
	title,
	message,
	isWaiting = false,
	onConfirm,
	confirmText,
	id,
}: TurnDialogProps): JSX.Element {
	const { t } = useI18n('common');

	const resolvedTitle =
		title ??
		(isWaiting ? t('game.turn.waitingTitle') : t('game.turn.title', { name: playerName, mark: playerMark }));

	const resolvedMessage =
		message ??
		(isWaiting
			? t('game.turn.waitingDescription')
			: t('game.turn.passDevicePrompt', { name: playerName, mark: playerMark }));

	const resolvedConfirmText = confirmText ?? t('game.turn.ok');

	return (
		<Dialog id={id} isOpen={isOpen} showCloseButton={false} title={resolvedTitle} message={resolvedMessage}>
			{!isWaiting && onConfirm && (
				<Stack direction="column" spacing="md" fullWidth>
					<Button onClick={onConfirm} variant="primary" size="md">
						{resolvedConfirmText}
					</Button>
				</Stack>
			)}
		</Dialog>
	);
}
