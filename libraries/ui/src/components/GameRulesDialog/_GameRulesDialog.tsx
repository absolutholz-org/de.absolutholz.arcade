import { useI18n } from '@arcade/lib-i18n/hooks/useI18n';
import { type JSX, useId } from 'react';
import { Dialog } from '../Dialog';
import * as S from './_GameRulesDialog.styles';
import type { GameRulesDialogProps } from './_GameRulesDialog.types';

/**
 * Standardized in-game rules modal across all Arcade games.
 * Consumes the design system's canonical Dialog primitive, offering
 * accessible modal behavior, localized strings, uniform two-line header hierarchy,
 * and seamless markdown rules presentation.
 */
export function GameRulesDialog({
	children,
	className,
	gameTitle,
	id,
	isOpen,
	onClose,
	...dialogProps
}: GameRulesDialogProps): JSX.Element {
	const generatedId = useId();
	const dialogId = id || `game-rules-dialog-${generatedId}`;
	const { t } = useI18n('common');

	return (
		<Dialog
			id={dialogId}
			isOpen={isOpen}
			onCancel={onClose}
			title={
				<S.HeaderGroup>
					<S.PrimaryTitle>{t('navigation.rules')}</S.PrimaryTitle>
					{gameTitle && <S.Subtitle>{gameTitle}</S.Subtitle>}
				</S.HeaderGroup>
			}
			showCloseButton={true}
			className={className}
			{...dialogProps}
		>
			<S.DialogBody>{children}</S.DialogBody>
		</Dialog>
	);
}
