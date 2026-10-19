import { I18nProvider } from '@arcade/lib-i18n/provider/I18nProvider';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { LanguageSelector } from '.';

const meta = {
	component: LanguageSelector,
	decorators: [
		(Story) => (
			<I18nProvider>
				<div style={{ maxWidth: '48rem', width: '100%', margin: '0 auto', padding: '1rem' }}>
					<Story />
				</div>
			</I18nProvider>
		),
	],
	parameters: {
		layout: 'fullscreen',
		docs: {
			description: {
				component:
					'The LanguageSelector component renders an accessible grid of cards representing each supported locale in its native name. Users can click to select and persist their language preference.',
			},
		},
	},
	tags: ['autodocs'],
	title: 'Components/Navigation & Shell/LanguageSelector',
} satisfies Meta<typeof LanguageSelector>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
