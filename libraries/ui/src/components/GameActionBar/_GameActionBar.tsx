import { useI18n } from '@arcade/lib-i18n/hooks/useI18n';
import type { SupportedLanguageCode } from '@arcade/lib-i18n/types/i18n.types';
import { useFavorites } from '@arcade/lib-user';
import { type MouseEvent, useEffect, useState } from 'react';
import { useOfflineGame } from '../../hooks/useOfflineGame';
import { Button } from '../Button';
import { Icon } from '../Icon';
import { ShareDialog } from '../ShareDialog';
import { Stack } from '../Stack';
import type { GameActionBarProps } from './_GameActionBar.types';

/**
 * Standardized Game Action Bar rendering the unified game action cluster:
 * 1. Save Offline (state-aware caching action with download/check icon)
 * 2. Favorite (toggle button with outline/filled heart and aria-pressed)
 * 3. Share Game (triggers Web Share API with ShareDialog fallback)
 *
 * Laid out horizontally using the shared Stack primitive with flex-wrap enabled.
 */
export function GameActionBar({
	gameId,
	gameTitle,
	isFavorited,
	onToggleFavorite,
	isSavedOffline,
	onSaveOffline,
	onShare,
	shareUrl,
	shareText,
	favoriteAriaLabel = 'Favorite game',
	favoriteLabel,
	favoritedLabel,
	saveOfflineLabel,
	shareLabel,
	variant = 'outline',
	justify = 'start',
	spacing = 'sm',
	size = 'sm',
	className,
}: GameActionBarProps) {
	const { t, language } = useI18n('common');
	const currentLang = (language ?? 'en') as SupportedLanguageCode;

	// Integrated hooks for automatic persistence when gameId is supplied
	const { isFavorite, toggleFavorite } = useFavorites();
	const offlineHook = useOfflineGame(gameId ?? '');

	const resolvedFavorited = isFavorited !== undefined ? isFavorited : gameId ? isFavorite(gameId) : false;
	const resolvedSavedOffline = isSavedOffline !== undefined ? isSavedOffline : offlineHook.status === 'installed';
	const isDownloading = offlineHook.status === 'downloading';

	// Share Dialog fallback state
	const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
	const relativeCanonicalUrl = gameId ? `/${currentLang}/games/${gameId}` : `/${currentLang}/`;
	const [resolvedShareUrl, setResolvedShareUrl] = useState(shareUrl ?? relativeCanonicalUrl);

	useEffect(() => {
		if (shareUrl) {
			setResolvedShareUrl(shareUrl);
		} else if (typeof window !== 'undefined') {
			setResolvedShareUrl(gameId ? `${window.location.origin}${relativeCanonicalUrl}` : window.location.href);
		}
	}, [shareUrl, gameId, relativeCanonicalUrl]);

	const handleSaveOffline = () => {
		if (onSaveOffline) {
			void onSaveOffline();
		} else if (gameId) {
			if (offlineHook.status === 'installed') {
				void offlineHook.uninstallGame();
			} else {
				void offlineHook.installGame();
			}
		}
	};

	const handleToggleFavorite = (e: MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		e.stopPropagation();
		if (onToggleFavorite) {
			void onToggleFavorite();
		} else if (gameId) {
			void toggleFavorite(gameId);
		}
	};

	const shareDialogTitle = gameTitle ? `${t('share.share')}: ${gameTitle}` : t('share.shareGame');
	const resolvedShareText = shareText ?? gameTitle ?? t('app.tagline');

	const handleShare = async (e: MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		if (onShare) {
			void onShare();
			return;
		}

		if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
			try {
				await navigator.share({
					title: shareDialogTitle,
					text: resolvedShareText,
					url: resolvedShareUrl,
				});
				return;
			} catch (err: unknown) {
				if (err instanceof Error && err.name === 'AbortError') {
					return;
				}
			}
		}

		setIsShareDialogOpen(true);
	};

	const buttonIconSize = size === 'sm' ? 'xs' : 'sm';

	const renderedSaveOfflineText = saveOfflineLabel ?? t('offline.saveOffline');
	const renderedFavoriteText =
		(resolvedFavorited && favoritedLabel ? favoritedLabel : undefined) ??
		favoriteLabel ??
		(resolvedFavorited ? t('favorites.favorited') : t('favorites.favorite'));
	const renderedShareText = shareLabel ?? t('share.shareGame');

	const saveOfflineAriaLabel = resolvedSavedOffline
		? `${t('offline.installed')}${gameTitle ? `: ${gameTitle}` : ''}`
		: `${renderedSaveOfflineText}${gameTitle ? `: ${gameTitle}` : ''}`;

	return (
		<>
			<Stack direction="row" wrap spacing={spacing} align="center" justify={justify} className={className}>
				{/* 1. Save Offline Action */}
				<Button
					variant={variant}
					size={size}
					isRound
					pressed={resolvedSavedOffline}
					disabled={isDownloading}
					onClick={handleSaveOffline}
					aria-label={saveOfflineAriaLabel}
					leadingIcon={<Icon name={resolvedSavedOffline ? 'check' : 'download'} size={buttonIconSize} />}
				>
					{renderedSaveOfflineText}
				</Button>

				{/* 2. Favorite Action */}
				<Button
					variant={variant}
					size={size}
					isRound
					pressed={resolvedFavorited}
					aria-label={favoriteAriaLabel}
					title={favoriteAriaLabel}
					onClick={handleToggleFavorite}
					leadingIcon={<Icon name={resolvedFavorited ? 'heart-filled' : 'heart'} size={buttonIconSize} />}
				>
					{renderedFavoriteText}
				</Button>

				{/* 3. Share Game Action */}
				<Button
					variant={variant}
					size={size}
					isRound
					onClick={handleShare}
					aria-label={renderedShareText}
					leadingIcon={<Icon name="share" size={buttonIconSize} />}
				>
					{renderedShareText}
				</Button>
			</Stack>

			{/* Contextual Web Share API Fallback Dialog */}
			<ShareDialog
				id={`share-dialog-${gameId ?? 'action-bar'}`}
				isOpen={isShareDialogOpen}
				onClose={() => setIsShareDialogOpen(false)}
				title={shareDialogTitle}
				shareUrl={resolvedShareUrl}
				shareText={resolvedShareText}
			/>
		</>
	);
}
