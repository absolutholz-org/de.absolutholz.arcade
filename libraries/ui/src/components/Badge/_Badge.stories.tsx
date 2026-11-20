import type { Meta, StoryObj } from '@storybook/react-vite';
import { Badge } from '.';
import { BADGE_SIZES, BADGE_TONES, BADGE_VARIANTS } from './_Badge.constants';

const meta = {
	component: Badge,
	parameters: {
		layout: 'centered',
		docs: {
			description: {
				component:
					'Badge is the canonical capsule primitive for static metadata tags, status indicators, interactive toggle chips (`as="button"`), and taxonomy links (`as="a"`).',
			},
		},
	},
	tags: ['autodocs'],
	title: 'Components/Badge',
	argTypes: {
		variant: {
			control: 'select',
			options: BADGE_VARIANTS,
			description: 'Surface treatment variant',
		},
		tone: {
			control: 'select',
			options: BADGE_TONES,
			description: 'Semantic color tone',
		},
		size: {
			control: 'radio',
			options: BADGE_SIZES,
			description: 'Sizing scale',
		},
		tabular: {
			control: 'boolean',
			description: 'Enables tabular numerals for counters and history rolls',
		},
		children: {
			control: 'text',
			description: 'Label content',
		},
	},
	args: {
		variant: 'subtle',
		tone: 'neutral',
		size: 'md',
		children: 'Badge Label',
	},
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SubtleNeutral: Story = {
	parameters: {
		docs: {
			description: {
				story: 'Default subtle neutral badge for metadata tags and category labels.',
			},
		},
	},
	args: {
		variant: 'subtle',
		tone: 'neutral',
		children: 'Logic & Numbers',
	},
};

export const SolidAccent: Story = {
	parameters: {
		docs: {
			description: {
				story: 'High-emphasis solid accent badge for key callouts like New Best Time.',
			},
		},
	},
	args: {
		variant: 'solid',
		tone: 'accent',
		children: 'New Best Time!',
	},
};

export const Success: Story = {
	parameters: {
		docs: {
			description: {
				story: 'Success tone badge backed by root OKLCH status tokens.',
			},
		},
	},
	args: {
		variant: 'subtle',
		tone: 'success',
		children: 'Completed',
	},
};

export const Warning: Story = {
	parameters: {
		docs: {
			description: {
				story: 'Warning tone badge backed by root OKLCH status tokens.',
			},
		},
	},
	args: {
		variant: 'subtle',
		tone: 'warning',
		children: 'Heads',
	},
};

export const Danger: Story = {
	parameters: {
		docs: {
			description: {
				story: 'Danger tone badge backed by root OKLCH status tokens.',
			},
		},
	},
	args: {
		variant: 'subtle',
		tone: 'danger',
		children: 'Blocked',
	},
};

export const Info: Story = {
	parameters: {
		docs: {
			description: {
				story: 'Info tone badge backed by root OKLCH status tokens.',
			},
		},
	},
	args: {
		variant: 'subtle',
		tone: 'info',
		children: 'Tails',
	},
};

export const DashedOutline: Story = {
	parameters: {
		docs: {
			description: {
				story: 'Dashed outline badge for paused, skipped, or OS-blocked states.',
			},
		},
	},
	args: {
		variant: 'dashed',
		tone: 'neutral',
		children: 'Paused',
	},
};

export const InteractiveToggleButton: Story = {
	parameters: {
		docs: {
			description: {
				story: 'Interactive toggle badge rendered as a native `<button type="button">` with `aria-pressed`.',
			},
		},
	},
	args: {
		as: 'button',
		pressed: true,
		variant: 'subtle',
		tone: 'accent',
		children: 'Keep Screen On',
	},
};

export const InteractiveLink: Story = {
	parameters: {
		docs: {
			description: {
				story: 'Navigation badge rendered as a native `<a href>` with optional `aria-current`.',
			},
		},
	},
	args: {
		as: 'a',
		href: '#category',
		current: 'page',
		variant: 'outline',
		tone: 'accent',
		children: 'Word Games',
	},
};
