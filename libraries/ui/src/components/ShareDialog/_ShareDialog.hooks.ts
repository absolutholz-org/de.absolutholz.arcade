import { useCallback, useEffect, useState } from 'react';

export interface UseShareContentOptions {
	shareUrl: string;
	title?: string;
	shareText?: string;
	roomCode?: string;
}

export function useShareContent({ shareUrl, title, shareText, roomCode }: UseShareContentOptions) {
	const [copiedType, setCopiedType] = useState<'link' | 'code' | null>(null);
	const [canShare, setCanShare] = useState(false);

	useEffect(() => {
		setCanShare(typeof navigator !== 'undefined' && typeof navigator.share === 'function');
	}, []);

	useEffect(() => {
		if (!copiedType) return;
		const timer = setTimeout(() => {
			setCopiedType(null);
		}, 3000);
		return () => clearTimeout(timer);
	}, [copiedType]);

	const copyLink = useCallback(async () => {
		if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
			try {
				await navigator.clipboard.writeText(shareUrl);
				setCopiedType('link');
			} catch {
				// Clipboard write failed or denied
			}
		}
	}, [shareUrl]);

	const copyCode = useCallback(async () => {
		if (!roomCode) return;
		if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
			try {
				await navigator.clipboard.writeText(roomCode);
				setCopiedType('code');
			} catch {
				// Clipboard write failed or denied
			}
		}
	}, [roomCode]);

	const shareNative = useCallback(async () => {
		if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
			try {
				await navigator.share({
					title,
					text: shareText,
					url: shareUrl,
				});
			} catch (err: unknown) {
				if (err instanceof Error && err.name === 'AbortError') {
					return;
				}
			}
		}
	}, [title, shareText, shareUrl]);

	return {
		canShare,
		copied: copiedType !== null,
		copiedType,
		copyLink,
		copyCode,
		shareNative,
	};
}
