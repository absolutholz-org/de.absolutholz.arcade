import { useCallback, useEffect, useState } from 'react';

export type OfflineGameStatus = 'idle' | 'checking' | 'installed' | 'downloading' | 'error';

export interface GameManifestData {
	gameId: string;
	base: string;
	version: string;
	totalBytes: number;
	routes: string[];
	assets: Array<{ url: string; bytes: number }>;
}

export interface UseOfflineGameResult {
	status: OfflineGameStatus;
	manifest: GameManifestData | null;
	totalBytes: number;
	error: string | null;
	installGame: () => Promise<boolean>;
	uninstallGame: () => Promise<boolean>;
	checkStatus: () => Promise<void>;
}

export function formatBytes(bytes: number): string {
	if (bytes === 0) return '0 B';
	const k = 1024;
	const sizes = ['B', 'KB', 'MB', 'GB'];
	const i = Math.floor(Math.log(bytes) / Math.log(k));
	return `${Number.parseFloat((bytes / k ** i).toFixed(1))} ${sizes[i]}`;
}

export function useOfflineGame(gameId: string): UseOfflineGameResult {
	const [status, setStatus] = useState<OfflineGameStatus>('idle');
	const [manifest, setManifest] = useState<GameManifestData | null>(null);
	const [error, setError] = useState<string | null>(null);

	const isSupported = typeof window !== 'undefined' && 'serviceWorker' in navigator && 'caches' in window;

	const checkStatus = useCallback(async () => {
		if (!isSupported) {
			setStatus('idle');
			return;
		}

		setStatus('checking');
		setError(null);

		try {
			let currentManifest = manifest;
			if (!currentManifest) {
				const manifestUrl = `/${gameId}/arcade-manifest.json`;
				try {
					const res = await fetch(manifestUrl);
					if (res.ok) {
						currentManifest = await res.json();
						setManifest(currentManifest);
					}
				} catch {
					// Offline
				}
			}

			const cacheKeys = await window.caches.keys();
			const isInstalled = cacheKeys.some((key) => key.startsWith(`arcade-game-${gameId}-`));

			setStatus(isInstalled ? 'installed' : 'idle');
		} catch (err) {
			setStatus('error');
			setError(err instanceof Error ? err.message : 'Unknown status check error');
		}
	}, [gameId, isSupported, manifest]);

	useEffect(() => {
		checkStatus();
	}, [checkStatus]);

	const installGame = useCallback(async (): Promise<boolean> => {
		if (!isSupported) {
			setError('Service Worker not supported in this browser');
			setStatus('error');
			return false;
		}

		setStatus('downloading');
		setError(null);

		try {
			const manifestUrl = `/${gameId}/arcade-manifest.json`;
			const sw = navigator.serviceWorker.controller || (await navigator.serviceWorker.ready).active;

			if (!sw) {
				throw new Error('Service Worker is not active yet. Please reload the page.');
			}

			return await new Promise<boolean>((resolve) => {
				const messageChannel = new MessageChannel();

				messageChannel.port1.onmessage = (event) => {
					if (event.data?.success) {
						setStatus('installed');
						resolve(true);
					} else {
						setStatus('error');
						setError(event.data?.error || 'Installation failed');
						resolve(false);
					}
				};

				sw.postMessage(
					{
						type: 'CACHE_GAME',
						gameId,
						manifestUrl,
					},
					[messageChannel.port2],
				);
			});
		} catch (err) {
			setStatus('error');
			setError(err instanceof Error ? err.message : 'Failed to install game');
			return false;
		}
	}, [gameId, isSupported]);

	const uninstallGame = useCallback(async (): Promise<boolean> => {
		if (!isSupported) return false;

		setStatus('checking');
		setError(null);

		try {
			const sw = navigator.serviceWorker.controller || (await navigator.serviceWorker.ready).active;

			if (sw) {
				await new Promise<boolean>((resolve) => {
					const messageChannel = new MessageChannel();
					messageChannel.port1.onmessage = (event) => {
						resolve(event.data?.success ?? true);
					};
					sw.postMessage(
						{
							type: 'EVICT_GAME',
							gameId,
						},
						[messageChannel.port2],
					);
				});
			} else {
				const cacheKeys = await window.caches.keys();
				const targetCaches = cacheKeys.filter((key) => key.startsWith(`arcade-game-${gameId}-`));
				await Promise.all(targetCaches.map((k) => window.caches.delete(k)));
			}

			setStatus('idle');
			return true;
		} catch (err) {
			setStatus('error');
			setError(err instanceof Error ? err.message : 'Failed to uninstall game');
			return false;
		}
	}, [gameId, isSupported]);

	return {
		status,
		manifest,
		totalBytes: manifest?.totalBytes || 0,
		error,
		installGame,
		uninstallGame,
		checkStatus,
	};
}
