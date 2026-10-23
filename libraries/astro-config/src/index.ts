import { fileURLToPath } from 'node:url';
import { DEFAULT_LANGUAGE, SUPPORTED_LANGUAGES } from '@arcade/lib-i18n/constants/languages';
import react from '@astrojs/react';
import wyw from '@wyw-in-js/vite';
import type { AstroUserConfig } from 'astro';
import { vitePluginArcadeManifest } from './plugins/vitePluginArcadeManifest.js';

type VitePluginOption = NonNullable<NonNullable<AstroUserConfig['vite']>['plugins']>[number];

export function createBaseConfig(overrides: AstroUserConfig = {}): AstroUserConfig {
	const rootEnvDir = fileURLToPath(new URL('../../../', import.meta.url));
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
			...overrideVite,
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
