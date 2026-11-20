// astro.base.config.mjs
import { fileURLToPath } from 'node:url';
import { DEFAULT_LANGUAGE, SUPPORTED_LANGUAGES } from '@arcade/lib-i18n/constants/languages';
import react from '@astrojs/react';
import wyw from '@wyw-in-js/vite';
import browserslist from 'browserslist';
import browserslistToEsbuild from 'browserslist-to-esbuild';
import { browserslistToTargets } from 'lightningcss';

/**
 * @param {import('astro').UserConfig} overrides
 */
export function createBaseConfig(overrides = {}) {
	const rootDir = fileURLToPath(new URL('./', import.meta.url));
	const browserList = browserslist(undefined, { path: rootDir });

	return {
		// Point all apps to the monorepo root for .env files automatically
		envDir: './',
		output: 'static',
		integrations: [react()],
		vite: {
			css: {
				transformer: 'lightningcss',
				lightningcss: {
					targets: browserslistToTargets(browserList),
					...(overrides.vite?.css?.lightningcss || {}),
				},
				...(overrides.vite?.css || {}),
			},
			build: {
				target: browserslistToEsbuild(browserList),
				...(overrides.vite?.build || {}),
			},
			ssr: {
				noExternal: [/@arcade\/.*/],
			},
			plugins: [
				wyw({
					include: ['**/*.{ts,tsx,js,jsx}'],
					babelOptions: {
						presets: ['@babel/preset-typescript', '@babel/preset-react'],
					},
				}),
			],
			...(overrides.vite || {}),
		},
		i18n: {
			defaultLocale: DEFAULT_LANGUAGE,
			locales: SUPPORTED_LANGUAGES.map((item) => item.code),
			routing: {
				prefixDefaultLocale: true,
				redirectToDefaultLocale: false,
			},
		},
		...overrides,
	};
}
