export interface ArcadeManifestOptions {
	base?: string;
	gameId?: string;
}

export interface ArcadeManifestAsset {
	url: string;
	bytes: number;
}

export interface ArcadeManifest {
	gameId: string;
	base: string;
	version: string;
	totalBytes: number;
	routes: string[];
	assets: ArcadeManifestAsset[];
}

export interface OutputChunkLike {
	type: 'chunk';
	code: string;
}

export interface OutputAssetLike {
	type: 'asset';
	source: string | Uint8Array;
}

export type OutputBundleLike = Record<string, OutputChunkLike | OutputAssetLike | unknown>;

export interface PluginContextLike {
	emitFile(emittedFile: { type: 'asset'; fileName: string; source: string }): void;
}

export interface VitePluginLike {
	name: string;
	apply?: 'build' | 'serve';
	configResolved?: (config: { base?: string }) => void;
	generateBundle?: (this: PluginContextLike, outputOptions: unknown, bundle: OutputBundleLike) => void;
}

export function vitePluginArcadeManifest(options: ArcadeManifestOptions = {}): VitePluginLike {
	let resolvedBase = options.base ?? '/';

	return {
		name: 'vite-plugin-arcade-manifest',
		apply: 'build',
		configResolved(config) {
			if (options.base) {
				resolvedBase = options.base;
			} else if (config.base) {
				resolvedBase = config.base;
			}
		},
		generateBundle(_outputOptions, bundle) {
			const normalizedBase = resolvedBase.endsWith('/') ? resolvedBase.slice(0, -1) : resolvedBase;
			const cleanBase = normalizedBase.startsWith('/') ? normalizedBase : `/${normalizedBase}`;
			const gameId = options.gameId || cleanBase.replace(/^\//, '') || 'hub';

			const assets: ArcadeManifestAsset[] = [];
			let totalBytes = 0;

			for (const [fileName, file] of Object.entries(bundle)) {
				if (fileName.endsWith('arcade-manifest.json')) continue;

				let byteLength = 0;
				if (typeof file === 'object' && file !== null && 'type' in file) {
					const typedFile = file as { type: string; code?: string; source?: string | Uint8Array };
					if (typedFile.type === 'chunk' && typeof typedFile.code === 'string') {
						byteLength = new TextEncoder().encode(typedFile.code).length;
					} else if (typedFile.type === 'asset' && typedFile.source !== undefined) {
						if (typeof typedFile.source === 'string') {
							byteLength = new TextEncoder().encode(typedFile.source).length;
						} else if (typedFile.source instanceof Uint8Array) {
							byteLength = typedFile.source.byteLength;
						}
					}
				}

				const assetUrl = `${cleanBase}/${fileName}`.replace(/\/+/g, '/');
				assets.push({
					url: assetUrl,
					bytes: byteLength,
				});
				totalBytes += byteLength;
			}

			const supportedLocales = ['en', 'de', 'fr', 'pt'];
			const routes =
				cleanBase === '/' || cleanBase === ''
					? supportedLocales.map((locale) => `/${locale}/`)
					: supportedLocales.flatMap((locale) => [
							`${cleanBase}/${locale}/`,
							`${cleanBase}/${locale}/game/`,
							`${cleanBase}/${locale}/rules/`,
							`${cleanBase}/${locale}/settings/`,
							`${cleanBase}/${locale}/stats/`,
							`${cleanBase}/${locale}/high-scores/`,
						]);

			const version = Date.now().toString(36);

			const manifest: ArcadeManifest = {
				gameId,
				base: cleanBase || '/',
				version,
				totalBytes,
				routes,
				assets,
			};

			this.emitFile({
				type: 'asset',
				fileName: 'arcade-manifest.json',
				source: JSON.stringify(manifest, null, 2),
			});
		},
	};
}
