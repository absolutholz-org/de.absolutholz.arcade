import { fileURLToPath } from 'node:url';
import { DEFAULT_LANGUAGE, SUPPORTED_LANGUAGES } from '@arcade/lib-i18n/constants/languages';
import react from '@astrojs/react';
import wyw from '@wyw-in-js/vite';
import type { AstroUserConfig } from 'astro';
import browserslist from 'browserslist';
import browserslistToEsbuild from 'browserslist-to-esbuild';
import { browserslistToTargets } from 'lightningcss';
import { vitePluginArcadeManifest } from './plugins/vitePluginArcadeManifest.js';

type VitePluginOption = NonNullable<NonNullable<AstroUserConfig['vite']>['plugins']>[number];

export function createBaseConfig(overrides: AstroUserConfig = {}): AstroUserConfig {
	const rootEnvDir = fileURLToPath(new URL('../../../', import.meta.url));
	const browserList = browserslist(undefined, { path: rootEnvDir });
	const { vite: overrideVite, ...restOverrides } = overrides;
	const wywPlugin = typeof wyw === 'function' ? wyw : (wyw as unknown as { default: typeof wyw }).default;

	return {
		output: 'static',
		integrations: [react()],
		i18n: {
			defaultLocale: DEFAULT_LANGUAGE,
			locales: SUPPORTED_LANGUAGES.map((item) => item.code),
			routing: {
				prefixDefaultLocale: true,
				redirectToDefaultLocale: false,
			},
		},
		...restOverrides,
		vite: {
			envDir: overrideVite?.envDir ?? rootEnvDir,
			envPrefix: overrideVite?.envPrefix ?? ['PUBLIC_', 'VITE_'],
			...overrideVite,
			css: {
				transformer: 'lightningcss',
				lightningcss: {
					targets: browserslistToTargets(browserList),
					...(overrideVite?.css?.lightningcss || {}),
				},
				...(overrideVite?.css || {}),
			},
			build: {
				target: browserslistToEsbuild(browserList),
				...(overrideVite?.build || {}),
			},
			ssr: {
				noExternal: [/@arcade\/.*/],
				...(overrideVite?.ssr || {}),
			},
			plugins: [
				wywPlugin({
					include: ['**/*.{ts,tsx,js,jsx}'],
					babelOptions: {
						presets: ['@babel/preset-typescript', '@babel/preset-react'],
					},
				}) as VitePluginOption,
				vitePluginArcadeManifest({ base: restOverrides.base }) as VitePluginOption,
				...(overrideVite?.plugins || []),
			],
		},
	};
}

export { vitePluginArcadeManifest } from './plugins/vitePluginArcadeManifest.js';
export type {
	ArcadeManifest,
	ArcadeManifestAsset,
	ArcadeManifestOptions,
} from './plugins/vitePluginArcadeManifest.js';
