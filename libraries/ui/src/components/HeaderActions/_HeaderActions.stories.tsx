import { I18nProvider } from '@arcade/lib-i18n/provider/I18nProvider';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { HeaderActions } from '.';
import { Theme } from '../Theme';

const meta = {
	component: HeaderActions,
	parameters: {
		layout: 'centered',
		docs: {
			description: {
				component:
					'The HeaderActions component renders the cluster of dynamic switchers (LanguageSwitcher and SchemeSwitcher) for the site header.',
			},
		},
	},
	tags: ['autodocs'],
	title: 'Components/HeaderActions',
	argTypes: {
		lang: {
			control: 'select',
			options: ['en', 'de', 'fr', 'pt'],
			description: 'The currently active language code.',
		},
		currentSlug: {
			control: 'text',
			description: 'Optional slug used for route switching.',
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
} satisfies Meta<typeof HeaderActions>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		lang: 'en',
	},
	parameters: {
		docs: {
			description: {
				story: 'Default header actions showing English language and system theme active.',
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
				story: 'Header actions with German language active.',
			},
		},
	},
};
