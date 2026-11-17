export interface TurnAlertOptions {
	readonly title: string;
	readonly body: string;
	readonly tabTitlePrefix?: string;
}

export function isBrowserNotificationSupported(): boolean {
	return typeof window !== 'undefined' && 'Notification' in window;
}

export function getNotificationPermission(): NotificationPermission | 'unsupported' {
	if (!isBrowserNotificationSupported()) {
		return 'unsupported';
	}
	return Notification.permission;
}

export async function requestTurnNotificationPermission(): Promise<NotificationPermission | 'unsupported'> {
	if (!isBrowserNotificationSupported()) {
		return 'unsupported';
	}
	if (Notification.permission === 'granted' || Notification.permission === 'denied') {
		return Notification.permission;
	}
	try {
		return await Notification.requestPermission();
	} catch {
		return Notification.permission;
	}
}

/**
 * Alerts the user when it becomes their turn while the tab/app is hidden.
 * Flashes the document title until the tab becomes visible and fires a local
 * browser Notification if permission was granted.
 */
export function notifyTurnIfHidden({ title, body, tabTitlePrefix = 'Your turn!' }: TurnAlertOptions): () => void {
	if (typeof window === 'undefined' || typeof document === 'undefined') {
		return () => {};
	}

	if (document.visibilityState === 'visible') {
		return () => {};
	}

	const originalTitle = document.title;
	let showPrefix = true;

	const intervalId = window.setInterval(() => {
		document.title = showPrefix ? `${tabTitlePrefix} — ${originalTitle}` : originalTitle;
		showPrefix = !showPrefix;
	}, 1200);

	const cleanup = () => {
		window.clearInterval(intervalId);
		document.title = originalTitle;
		document.removeEventListener('visibilitychange', handleVisibility);
	};

	const handleVisibility = () => {
		if (document.visibilityState === 'visible') {
			cleanup();
		}
	};

	document.addEventListener('visibilitychange', handleVisibility);

	if (isBrowserNotificationSupported() && Notification.permission === 'granted') {
		try {
			const notification = new Notification(title, {
				body,
				tag: 'arcade-turn-alert',
			});
			notification.onclick = () => {
				window.focus();
				notification.close();
			};
		} catch {
			// Ignore environments (e.g. certain mobile browsers) where direct `new Notification` throws
		}
	}

	return cleanup;
}
