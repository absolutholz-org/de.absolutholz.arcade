import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { StorybookConfig } from '@storybook/react-vite';
import wyw from '@wyw-in-js/vite';
import browserslist from 'browserslist';
import browserslistToEsbuild from 'browserslist-to-esbuild';
import { browserslistToTargets } from 'lightningcss';

const ROOT_DIR = fileURLToPath(new URL('../../../', import.meta.url));

const config: StorybookConfig = {
	stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
	addons: [
		getAbsolutePath('@chromatic-com/storybook'),
		getAbsolutePath('@storybook/addon-vitest'),
		getAbsolutePath('@storybook/addon-a11y'),
		getAbsolutePath('@storybook/addon-docs'),
		getAbsolutePath('@storybook/addon-mcp'),
	],
	framework: getAbsolutePath('@storybook/react-vite'),
	async viteFinal(config) {
		const browserList = browserslist(undefined, { path: ROOT_DIR });
		config.css = {
			...config.css,
			transformer: 'lightningcss',
			lightningcss: {
				...config.css?.lightningcss,
				targets: browserslistToTargets(browserList),
			},
		};
		config.build = {
			...config.build,
			target: browserslistToEsbuild(browserList),
		};
		config.plugins = config.plugins || [];
		config.plugins.push(
			wyw({
				include: ['**/*.{ts,tsx,js,jsx}'],
				babelOptions: {
					presets: ['@babel/preset-typescript', '@babel/preset-react'],
				},
			}),
			{
				name: 'storybook-arcade-themes',
				configureServer(server) {
					server.middlewares.use(async (req, res, next) => {
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
							const mod = await server.ssrLoadModule('/src/styles/themes.ts');
							const css =
								fileName === 'preview'
									? mod.buildThemesPreviewStylesheet()
									: mod.buildThemesetStylesheet(fileName);
							if (!css) {
								next();
								return;
							}
							res.statusCode = 200;
							res.setHeader('Content-Type', 'text/css; charset=utf-8');
							res.setHeader('Cache-Control', 'no-cache');
							res.end(css);
						} catch {
							next();
						}
					});
				},
			},
		);
		return config;
	},
};
export default config;

function getAbsolutePath(value: string): string {
	return dirname(fileURLToPath(import.meta.resolve(`${value}/package.json`)));
}
