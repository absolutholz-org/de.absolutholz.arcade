import type { StorybookConfig } from '@storybook/react-vite';
import wyw from '@wyw-in-js/vite';

const config: StorybookConfig = {
	stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
	addons: [
		'@chromatic-com/storybook',
		'@storybook/addon-vitest',
		'@storybook/addon-a11y',
		'@storybook/addon-docs',
		'@storybook/addon-mcp',
	],
	framework: '@storybook/react-vite',
	async viteFinal(config) {
		config.plugins = config.plugins || [];
		config.plugins.push(
			wyw({
				include: ['**/*.{ts,tsx,js,jsx}'],
				babelOptions: {
					presets: ['@babel/preset-typescript', '@babel/preset-react'],
				},
			}),
		);
		return config;
	},
};
export default config;
