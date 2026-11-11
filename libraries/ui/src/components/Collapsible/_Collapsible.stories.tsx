import type { Meta, StoryObj } from '@storybook/react-vite';
import { Collapsible } from '.';
import { COLLAPSIBLE_VARIANTS } from './_Collapsible.constants';

const meta = {
	component: Collapsible,
	parameters: {
		layout: 'padded',
		docs: {
			description: {
				component:
					'Collapsible is an accessible, native disclosure container built on HTML5 <details> and <summary>. It supports smooth chevron indicator rotation, badges/counts, and controlled or uncontrolled open state.',
			},
		},
	},
	tags: ['autodocs'],
	title: 'Components/Collapsible',
	argTypes: {
		variant: {
			control: 'select',
			options: COLLAPSIBLE_VARIANTS,
			description: 'Visual container styling variant',
		},
		title: {
			control: 'text',
			description: 'Header title text or element',
		},
		count: {
			control: 'number',
			description: 'Optional count displayed in a badge',
		},
		defaultOpen: {
			control: 'boolean',
			description: 'Whether the collapsible starts in an expanded state',
		},
	},
	args: {
		title: 'Browse Curated Puzzles',
		variant: 'default',
		defaultOpen: false,
		children: 'Collapsible content panel containing curated level grids and options.',
	},
} satisfies Meta<typeof Collapsible>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	parameters: {
		docs: {
			description: {
				story: 'Standard collapsible component in collapsed state.',
			},
		},
	},
	args: {
		title: 'Curated Puzzles',
	},
};

export const WithBadgeCount: Story = {
	parameters: {
		docs: {
			description: {
				story: 'Collapsible with a numeric badge indicating item count.',
			},
		},
	},
	args: {
		title: 'Curated Puzzles',
		count: 24,
	},
};

export const DefaultOpen: Story = {
	parameters: {
		docs: {
			description: {
				story: 'Collapsible initialized in the open state.',
			},
		},
	},
	args: {
		title: 'Curated Puzzles',
		count: 12,
		defaultOpen: true,
	},
};
