import type { IncomingMessage, ServerResponse } from 'node:http';
import { type Targets, transform } from 'lightningcss';

export interface ThemesModule {
	NON_BASE_THEMESET_IDS: readonly string[];
	buildThemesetStylesheet: (id: string) => string | null;
	buildThemesPreviewStylesheet: () => string;
}

export interface ArcadeThemesPluginOptions {
	themes?: ThemesModule;
	targets?: Targets;
}

interface ViteMiddlewareServerLike {
	middlewares: {
		use: (fn: (req: IncomingMessage, res: ServerResponse, next: () => void) => void) => void;
	};
}

interface ViteDevServerLike extends ViteMiddlewareServerLike {
	ssrLoadModule: (id: string) => Promise<Record<string, unknown>>;
}

interface PluginContextLike {
	emitFile(emittedFile: { type: 'asset'; fileName: string; source: string }): void;
}

function minifyCss(css: string, fileName: string, targets?: Targets): string {
	const result = transform({
		filename: fileName,
		code: Buffer.from(css),
		minify: true,
		targets,
	});
	return Buffer.from(result.code).toString('utf-8');
}

function createThemesMiddleware(resolveThemes: () => Promise<ThemesModule> | ThemesModule) {
	return async (req: IncomingMessage, res: ServerResponse, next: () => void) => {
		const rawUrl = req.url?.split('?')[0];
		if (!rawUrl || !rawUrl.startsWith('/themes/') || !rawUrl.endsWith('.css')) {
			next();
			return;
		}

		const fileName = rawUrl.slice('/themes/'.length, -'.css'.length);
		if (!fileName || fileName.includes('/')) {
			next();
			return;
		}

		try {
			const mod = await resolveThemes();
			const css =
				fileName === 'preview' ? mod.buildThemesPreviewStylesheet() : mod.buildThemesetStylesheet(fileName);

			if (!css) {
				next();
				return;
			}

			res.statusCode = 200;
			res.setHeader('Content-Type', 'text/css; charset=utf-8');
			res.setHeader('Cache-Control', 'no-cache');
			res.end(css);
		} catch (err) {
			console.error('[vite-plugin-arcade-themes] Failed to serve theme CSS:', err);
			next();
		}
	};
}

export function vitePluginArcadeThemes(options: ArcadeThemesPluginOptions = {}) {
	return {
		name: 'vite-plugin-arcade-themes',

		configureServer(server: ViteDevServerLike) {
			server.middlewares.use(
				createThemesMiddleware(async () => {
					if (options.themes) {
						return options.themes;
					}
					return (await server.ssrLoadModule('@arcade/lib-ui/styles/themes')) as unknown as ThemesModule;
				}),
			);
		},

		configurePreviewServer(server: ViteMiddlewareServerLike) {
			if (!options.themes) {
				return;
			}
			const themes = options.themes;
			server.middlewares.use(createThemesMiddleware(() => themes));
		},

		generateBundle(this: PluginContextLike) {
			if (!options.themes) {
				return;
			}

			const mod = options.themes;

			for (const id of mod.NON_BASE_THEMESET_IDS) {
				const rawCss = mod.buildThemesetStylesheet(id);
				if (!rawCss) continue;

				const fileName = `themes/${id}.css`;
				this.emitFile({
					type: 'asset',
					fileName,
					source: minifyCss(rawCss, fileName, options.targets),
				});
			}

			const previewRaw = mod.buildThemesPreviewStylesheet();
			const previewFileName = 'themes/preview.css';
			this.emitFile({
				type: 'asset',
				fileName: previewFileName,
				source: minifyCss(previewRaw, previewFileName, options.targets),
			});
		},
	};
}
