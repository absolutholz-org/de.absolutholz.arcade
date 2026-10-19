import { I18nProvider } from '@arcade/lib-i18n/provider/I18nProvider';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { ThemeSelector } from '.';

const meta = {
	component: ThemeSelector,
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
					'The ThemeSelector component renders an accessible grid of cards representing each white-label themeset. Users can preview sample colors and click to dynamically apply and persist their theme selection.',
			},
		},
	},
	tags: ['autodocs'],
	title: 'Components/Navigation & Shell/ThemeSelector',
} satisfies Meta<typeof ThemeSelector>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
