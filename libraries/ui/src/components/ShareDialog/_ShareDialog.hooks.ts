import { useCallback, useEffect, useState } from 'react';

export interface UseShareContentOptions {
	shareUrl: string;
	title?: string;
	shareText?: string;
}

export function useShareContent({ shareUrl, title, shareText }: UseShareContentOptions) {
	const [copied, setCopied] = useState(false);
	const [canShare, setCanShare] = useState(false);

	useEffect(() => {
		setCanShare(typeof navigator !== 'undefined' && typeof navigator.share === 'function');
	}, []);

	useEffect(() => {
		if (!copied) return;
		const timer = setTimeout(() => {
			setCopied(false);
		}, 3000);
		return () => clearTimeout(timer);
	}, [copied]);

	const copyLink = useCallback(async () => {
		if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
			try {
				await navigator.clipboard.writeText(shareUrl);
				setCopied(true);
			} catch {
				// Clipboard write failed or denied
			}
		}
	}, [shareUrl]);

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
		copied,
		copyLink,
		shareNative,
	};
}
