import { DEFAULT_LANGUAGE, SUPPORTED_LANGUAGES } from '@arcade/lib-i18n/constants/languages';
import react from '@astrojs/react';
import wyw from '@wyw-in-js/vite';
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
	base: '/sudoku',
	output: 'static',
	integrations: [react()],
	vite: {
		plugins: [
			wyw({
				include: ['**/*.{ts,tsx,js,jsx}'],
				babelOptions: {
					presets: ['@babel/preset-typescript', '@babel/preset-react'],
				},
			}),
		],
	},
	i18n: {
		defaultLocale: DEFAULT_LANGUAGE,
		locales: SUPPORTED_LANGUAGES.map((item) => item.code),
		routing: {
			prefixDefaultLocale: true,
			redirectToDefaultLocale: false,
		},
	},
});
