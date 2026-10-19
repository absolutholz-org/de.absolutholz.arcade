import { I18nProvider } from '@arcade/lib-i18n/provider/I18nProvider';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { HeaderUserMenu } from '.';
import { Theme } from '../Theme';

const meta = {
	component: HeaderUserMenu,
	parameters: {
		layout: 'centered',
		docs: {
			description: {
				component:
					'The HeaderUserMenu component renders the interactive user session trigger button and modal dialog for user authentication and profile management.',
			},
		},
	},
	tags: ['autodocs'],
	title: 'Components/Navigation & Shell/HeaderUserMenu',
	argTypes: {
		lang: {
			control: 'select',
			options: ['en', 'de', 'fr', 'pt'],
			description: 'The currently active language code.',
		},
	},
	decorators: [
		(Story) => (
			<I18nProvider>
				<Theme name="primary">
					<div style={{ padding: '2rem' }}>
						<Story />
					</div>
				</Theme>
			</I18nProvider>
		),
	],
} satisfies Meta<typeof HeaderUserMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		lang: 'en',
	},
	parameters: {
		docs: {
			description: {
				story: 'Default header user menu showing the user session trigger.',
			},
		},
	},
};

export const German: Story = {
	args: {
		lang: 'de',
	},
	parameters: {
		docs: {
			description: {
				story: 'Header user menu with German language active.',
			},
		},
	},
};
