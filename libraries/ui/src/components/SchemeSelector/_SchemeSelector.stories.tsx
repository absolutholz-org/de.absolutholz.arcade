import { I18nProvider } from '@arcade/lib-i18n/provider/I18nProvider';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { SchemeSelector } from '.';

const meta = {
	component: SchemeSelector,
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
					'The SchemeSelector component renders an accessible grid of cards representing light, dark, and system color schemes with icons and preview swatches. Users can click to select and apply their scheme choice.',
			},
		},
	},
	tags: ['autodocs'],
	title: 'Components/Navigation & Shell/SchemeSelector',
} satisfies Meta<typeof SchemeSelector>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
