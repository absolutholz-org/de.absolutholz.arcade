import type { Meta, StoryObj } from '@storybook/react-vite';
import { Badge } from '.';
import { BADGE_SIZES, BADGE_VARIANTS } from './_Badge.constants';

const meta = {
	component: Badge,
	parameters: {
		layout: 'centered',
		docs: {
			description: {
				component:
					'Badge is an app-agnostic inline primitive for metadata tags, status pills, and state indicators. Supports neutral, success, accent, and outline variants, two sizes, and optional leading/trailing icon slots.',
			},
		},
	},
	tags: ['autodocs'],
	title: 'Components/Data & Display/Badge',
	argTypes: {
		variant: {
			control: 'select',
			options: BADGE_VARIANTS,
			description: 'Semantic visual styling variant',
		},
		size: {
			control: 'radio',
			options: BADGE_SIZES,
			description: 'Sizing scale',
		},
		children: {
			control: 'text',
			description: 'Label content',
		},
	},
	args: {
		variant: 'neutral',
		size: 'md',
		children: 'Badge Label',
	},
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Neutral: Story = {
	parameters: {
		docs: {
			description: {
				story: 'Neutral badge variant for standard or muted metadata tags.',
			},
		},
	},
	args: {
		variant: 'neutral',
		children: 'Neutral Tag',
	},
};

export const Success: Story = {
	parameters: {
		docs: {
			description: {
				story: 'Success badge variant indicating positive or completed states.',
			},
		},
	},
	args: {
		variant: 'success',
		children: 'Completed',
	},
};

export const Accent: Story = {
	parameters: {
		docs: {
			description: {
				story: 'Accent badge variant for highlighting active, new, or featured statuses.',
			},
		},
	},
	args: {
		variant: 'accent',
		children: 'New Feature',
	},
};

export const Outline: Story = {
	parameters: {
		docs: {
			description: {
				story: 'Outline badge variant providing subtle bordered contrast.',
			},
		},
	},
	args: {
		variant: 'outline',
		children: 'Outline Pill',
	},
};

export const Small: Story = {
	parameters: {
		docs: {
			description: {
				story: 'Small size badge for compact spaces or inline text metadata.',
			},
		},
	},
	args: {
		size: 'sm',
		children: 'Small Pill',
	},
};

export const WithIcons: Story = {
	parameters: {
		docs: {
			description: {
				story: 'Badge configured with both leading and trailing icon slots.',
			},
		},
	},
	args: {
		variant: 'accent',
		leadingIcon: (
			<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
				<circle cx="12" cy="12" r="8" />
			</svg>
		),
		trailingIcon: (
			<svg
				width="12"
				height="12"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="2"
				aria-hidden="true"
			>
				<path d="M5 12h14M12 5l7 7-7 7" />
			</svg>
		),
		children: 'Active Quest',
	},
};
