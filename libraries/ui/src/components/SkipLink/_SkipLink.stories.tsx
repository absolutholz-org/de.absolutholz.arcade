import type { Meta, StoryObj } from '@storybook/react-vite';
import { SkipLink } from '.';
import { Theme } from '../Theme';

const meta = {
	component: SkipLink,
	parameters: {
		layout: 'padded',
		docs: {
			description: {
				component:
					'The SkipLink component provides an essential accessibility landmark link positioned off-screen that appears on focus, allowing keyboard users to bypass navigation clusters.',
			},
		},
	},
	tags: ['autodocs'],
	title: 'Components/SkipLink',
	argTypes: {
		href: {
			control: 'text',
			description: 'Target anchor ID of the primary content landmark.',
		},
		children: {
			control: 'text',
			description: 'Accessible label text.',
		},
	},
	args: {
		children: 'Skip to main content',
		href: '#main-content',
	},
	decorators: [
		(Story) => (
			<Theme name="primary">
				<div style={{ minHeight: '6rem', position: 'relative' }}>
					<p style={{ color: 'var(--color-text-2)', fontSize: '0.875rem' }}>
						Tab into this frame to focus and reveal the skip link:
					</p>
					<Story />
				</div>
			</Theme>
		),
	],
} satisfies Meta<typeof SkipLink>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	parameters: {
		docs: {
			description: {
				story: 'Default skip link positioned off-screen until focused via keyboard navigation.',
			},
		},
	},
};
