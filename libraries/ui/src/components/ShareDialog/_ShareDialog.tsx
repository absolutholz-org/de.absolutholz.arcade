import { useI18n } from '@arcade/lib-i18n/hooks/useI18n';
import { QRCodeSVG } from 'qrcode.react';
import type { JSX } from 'react';
import { Button } from '../Button';
import { Dialog } from '../Dialog';
import { useShareContent } from './_ShareDialog.hooks';
import * as S from './_ShareDialog.styles';
import type { IShareDialog, ShareContentProps } from './_ShareDialog.types';

/**
 * Reusable body content for sharing URLs via QR Code, native Web Share API, and clipboard copy.
 */
export function ShareContent({
	shareUrl,
	shareText,
	title,
	copySuccessMessage,
	roomCode,
	copyCodeLabel,
	codeCopiedMessage,
}: ShareContentProps): JSX.Element {
	const { t } = useI18n('common');
	const { canShare, copied, copiedType, copyLink, copyCode, shareNative } = useShareContent({
		shareUrl,
		title,
		shareText,
		roomCode,
	});

	const resolvedCopyMessage = copySuccessMessage ?? t('share.linkCopied');

	return (
		<S.ContentRoot>
			<S.QrCard>
				<QRCodeSVG
					value={shareUrl}
					size={168}
					fgColor="currentColor"
					bgColor="transparent"
					aria-hidden="true"
				/>
				<p>{t('share.scanToPlay')}</p>
			</S.QrCard>

			<S.ActionsContainer>
				{roomCode && (
					<S.RoomCodeBox>
						<S.RoomCodeValue>{roomCode}</S.RoomCodeValue>
						<Button variant="outline" size="sm" type="button" onClick={copyCode}>
							{copyCodeLabel ?? t('share.copyCode')}
						</Button>
					</S.RoomCodeBox>
				)}
				{canShare && (
					<Button variant="primary" size="md" type="button" onClick={shareNative}>
						{t('share.share')}
					</Button>
				)}
				<Button variant={canShare ? 'outline' : 'primary'} size="md" type="button" onClick={copyLink}>
					{t('share.copyLink')}
				</Button>
				{copied && (
					// biome-ignore lint/a11y/useSemanticElements: ARIA role="status" is mandated by the architectural specification for persistent toast live regions
					<S.StatusBanner role="status" aria-live="polite">
						{copiedType === 'code' ? (codeCopiedMessage ?? t('share.codeCopied')) : resolvedCopyMessage}
					</S.StatusBanner>
				)}
			</S.ActionsContainer>
		</S.ContentRoot>
	);
}

/**
 * Reusable modal dialog for sharing arcade pages or games.
 * Supports desktop QR code generation and mobile Web Share API.
 */
export function ShareDialog({
	id,
	isOpen,
	onClose,
	title,
	shareUrl,
	shareText,
	copySuccessMessage,
	roomCode,
	copyCodeLabel,
	codeCopiedMessage,
}: IShareDialog): JSX.Element {
	return (
		<Dialog id={id} isOpen={isOpen} onCancel={onClose} title={title}>
			<ShareContent
				shareUrl={shareUrl}
				shareText={shareText}
				title={title}
				copySuccessMessage={copySuccessMessage}
				roomCode={roomCode}
				copyCodeLabel={copyCodeLabel}
				codeCopiedMessage={codeCopiedMessage}
			/>
		</Dialog>
	);
}
