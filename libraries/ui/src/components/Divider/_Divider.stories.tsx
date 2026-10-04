import type { Meta, StoryObj } from '@storybook/react-vite';
import { Divider } from '.';

const meta = {
	component: Divider,
	parameters: {
		layout: 'padded',
		docs: {
			description: {
				component:
					'The Divider component renders a horizontal separation line with optional content and responsive visibility controls to partition distinct layout sections.',
			},
		},
	},
	tags: ['autodocs'],
	title: 'Components/Divider',
	argTypes: {
		as: {
			control: 'text',
			description: 'The HTML element or custom component to render',
		},
		children: {
			control: 'text',
			description: 'The content to display inside the divider.',
		},
		hideOnDesktop: {
			control: 'boolean',
			description: 'Whether the divider should be hidden on desktop screens.',
		},
	},
	args: {
		hideOnDesktop: false,
	},
	decorators: [
		(Story) => (
			<div style={{ margin: '0 auto', maxWidth: '36rem', width: '100%' }}>
				<Story />
			</div>
		),
	],
} satisfies Meta<typeof Divider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {},
	parameters: {
		docs: {
			description: {
				story: 'The default Divider renders a full-width horizontal rule.',
			},
		},
	},
};

export const WithText: Story = {
	args: {
		children: 'Or',
	},
	parameters: {
		docs: {
			description: {
				story: 'Divider with centered text content flanked by separator lines.',
			},
		},
	},
};

export const HideOnDesktop: Story = {
	args: {
		hideOnDesktop: true,
	},
	parameters: {
		docs: {
			description: {
				story: 'Divider hidden on desktop viewports (min-width: 1024px) and only visible on compact mobile screens.',
			},
		},
	},
};

export const HideOnDesktopWithText: Story = {
	args: {
		children: 'Section Divider',
		hideOnDesktop: true,
	},
	parameters: {
		docs: {
			description: {
				story: 'Divider with label text that is hidden on desktop screens and visible only on mobile viewports.',
			},
		},
	},
};
