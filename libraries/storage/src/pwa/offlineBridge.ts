export interface GameManifestData {
	gameId: string;
	base: string;
	version: string;
	totalBytes: number;
	routes: string[];
	assets: Array<{ url: string; bytes: number }>;
}

export function formatBytes(bytes: number): string {
	if (bytes === 0) return '0 B';
	const k = 1024;
	const sizes = ['B', 'KB', 'MB', 'GB'];
	const i = Math.floor(Math.log(bytes) / Math.log(k));
	return `${Number.parseFloat((bytes / k ** i).toFixed(1))} ${sizes[i]}`;
}

export async function checkGameInstalled(gameId: string): Promise<boolean> {
	if (typeof window === 'undefined' || !('caches' in window)) return false;
	try {
		const keys = await window.caches.keys();
		return keys.some((k) => k.startsWith(`arcade-game-${gameId}-`));
	} catch {
		return false;
	}
}

export async function fetchGameManifest(gameId: string): Promise<GameManifestData | null> {
	if (typeof window === 'undefined') return null;
	try {
		const res = await fetch(`/${gameId}/arcade-manifest.json`);
		if (res.ok) return await res.json();
	} catch {
		// Offline or unreachable
	}
	return null;
}

export async function installGame(gameId: string): Promise<boolean> {
	if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return false;
	try {
		const manifestUrl = `/${gameId}/arcade-manifest.json`;
		const sw = navigator.serviceWorker.controller || (await navigator.serviceWorker.ready).active;
		if (!sw) return false;

		return await new Promise<boolean>((resolve) => {
			const channel = new MessageChannel();
			channel.port1.onmessage = (event) => {
				resolve(event.data?.success ?? false);
			};
			sw.postMessage({ type: 'CACHE_GAME', gameId, manifestUrl }, [channel.port2]);
		});
	} catch {
		return false;
	}
}

export async function uninstallGame(gameId: string): Promise<boolean> {
	if (typeof window === 'undefined') return false;
	try {
		if ('serviceWorker' in navigator) {
			const sw = navigator.serviceWorker.controller || (await navigator.serviceWorker.ready).active;
			if (sw) {
				return await new Promise<boolean>((resolve) => {
					const channel = new MessageChannel();
					channel.port1.onmessage = (event) => {
						resolve(event.data?.success ?? true);
					};
					sw.postMessage({ type: 'EVICT_GAME', gameId }, [channel.port2]);
				});
			}
		}
		if ('caches' in window) {
			const keys = await window.caches.keys();
			const targets = keys.filter((k) => k.startsWith(`arcade-game-${gameId}-`));
			await Promise.all(targets.map((k) => window.caches.delete(k)));
			return true;
		}
	} catch {
		// ignore
	}
	return false;
}
