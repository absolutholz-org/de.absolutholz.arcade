import type { Preview } from '@storybook/react-vite';

// Import our clean theme configurations
import { storybookLightTheme, storybookDarkTheme } from './StorybookThemes';

// Import the relocated decorator wrapper
import { themeDecorator } from './StorybookWrappers';

const preview: Preview = {
	parameters: {
		controls: {
			matchers: {
				color: /(background|color)$/i,
				date: /Date$/i,
			},
		},
		a11y: {
			test: 'todo',
		},
		docs: {
			theme: window.matchMedia('(prefers-color-scheme: dark)').matches
				? storybookDarkTheme
				: storybookLightTheme,
		},
	},
	globalTypes: {
		themeset: {
			description: 'Global White-Label Themeset',
			defaultValue: 'base',
			toolbar: {
				title: 'Themeset',
				icon: 'paintbrush',
				items: [
					{ value: 'base', title: 'Base' },
					{ value: 'christmas', title: 'Christmas' },
					{ value: 'easter', title: 'Easter' },
					{ value: 'mcdonalds', title: "McDonald's" },
					{ value: 'july4th', title: '4th of July' },
					{ value: 'stpatricks', title: "St. Patrick's Day" },
					{ value: 'browns', title: 'Cleveland Browns' },
					{ value: 'osu', title: 'Ohio State University' },
					{ value: 'germany', title: 'Germany' },
				],
				dynamicTitle: true,
			},
		},
		scheme: {
			defaultValue: 'system',
			description: 'Color scheme',
			toolbar: {
				icon: 'circlehollow',
				items: [
					{ icon: 'sun', title: 'Light', value: 'light' },
					{ icon: 'moon', title: 'Dark', value: 'dark' },
					{ icon: 'browser', title: 'System', value: 'system' },
				],
				dynamicTitle: true,
			},
		},
	},
	decorators: [themeDecorator],
};

export default preview;
