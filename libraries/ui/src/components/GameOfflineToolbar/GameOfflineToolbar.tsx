import { useI18n } from '@arcade/lib-i18n/hooks/useI18n';
import type { SupportedLanguageCode } from '@arcade/lib-i18n/types/i18n.types';
import { useEffect, useState } from 'react';
import { useOfflineGame } from '../../hooks/useOfflineGame';
import { Button } from '../Button';
import { FavoriteButton } from '../FavoriteButton';
import { Icon } from '../Icon';
import { OfflineToggle } from '../OfflineToggle/OfflineToggle';
import { ShareDialog } from '../ShareDialog';
import * as S from './GameOfflineToolbar.styles';

export interface GameOfflineToolbarProps {
	gameId: string;
	gameTitle?: string;
	className?: string;
}

export function GameOfflineToolbar({ gameId, gameTitle, className }: GameOfflineToolbarProps) {
	const { t, language } = useI18n('common');
	const currentLang = (language ?? 'en') as SupportedLanguageCode;
	const { status, installGame, uninstallGame } = useOfflineGame(gameId);
	const [isShareOpen, setIsShareOpen] = useState(false);

	const relativeCanonicalUrl = `/${currentLang}/games/${gameId}`;
	const [shareUrl, setShareUrl] = useState(relativeCanonicalUrl);

	useEffect(() => {
		if (typeof window !== 'undefined') {
			setShareUrl(`${window.location.origin}${relativeCanonicalUrl}`);
		}
	}, [relativeCanonicalUrl]);

	const shareDialogTitle = gameTitle ? `${t('share.share')}: ${gameTitle}` : t('share.shareGame');

	return (
		<S.Root className={className}>
			<OfflineToggle
				gameId={gameId}
				status={status}
				onToggle={status === 'installed' ? uninstallGame : installGame}
				onUninstall={uninstallGame}
			/>
			<FavoriteButton gameId={gameId} gameTitle={gameTitle ?? ''} size="sm" />
			<Button
				variant="secondary"
				size="sm"
				onClick={() => setIsShareOpen(true)}
				aria-label={t('share.shareGame')}
				leadingIcon={<Icon name="share" size="xs" />}
			>
				{t('share.shareGame')}
			</Button>
			<ShareDialog
				id={`share-dialog-${gameId}`}
				isOpen={isShareOpen}
				onClose={() => setIsShareOpen(false)}
				title={shareDialogTitle}
				shareUrl={shareUrl}
				shareText={gameTitle}
			/>
		</S.Root>
	);
}
