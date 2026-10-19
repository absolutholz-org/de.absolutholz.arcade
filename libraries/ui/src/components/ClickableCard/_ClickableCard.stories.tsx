import type { Meta, StoryObj } from '@storybook/react-vite';
import { ClickableCard } from '.';
import { CLICKABLE_CARD_DENSITIES } from './_ClickableCard.constants';

const meta = {
	component: ClickableCard,
	parameters: {
		layout: 'centered',
		docs: {
			description: {
				component:
					'ClickableCard is an app-agnostic interactive card primitive supporting polymorphic rendering (`button`, `a`), density spacing presets, 3D bottom-depth elevation, hover/focus rings, and selected/disabled states.',
			},
		},
	},
	tags: ['autodocs'],
	title: 'Components/Cards & Surfaces/ClickableCard',
	argTypes: {
		density: {
			control: 'radio',
			options: CLICKABLE_CARD_DENSITIES,
			description: 'Spacing density preset affecting padding and gaps',
		},
		selected: {
			control: 'boolean',
			description: 'Controls selected state highlighting the card with accent color',
		},
		disabled: {
			control: 'boolean',
			description: 'Disables interactions and renders muted visual state',
		},
		children: {
			control: 'text',
			description: 'Card body content',
		},
	},
	args: {
		density: 'normal',
		selected: false,
		disabled: false,
		children: 'Interactive Card Content',
	},
} satisfies Meta<typeof ClickableCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	parameters: {
		docs: {
			description: {
				story: 'Standard clickable card configured with default normal density.',
			},
		},
	},
	args: {
		children: 'Standard Clickable Card',
	},
};

export const Compact: Story = {
	parameters: {
		docs: {
			description: {
				story: 'Compact density variant suitable for dense grid listings and lists.',
			},
		},
	},
	args: {
		density: 'compact',
		children: 'Compact Density Card',
	},
};

export const Selected: Story = {
	parameters: {
		docs: {
			description: {
				story: 'Selected card state highlighted with the theme accent border, glow, and background tint.',
			},
		},
	},
	args: {
		selected: true,
		children: 'Selected Active Card',
	},
};

export const Disabled: Story = {
	parameters: {
		docs: {
			description: {
				story: 'Disabled card state preventing interaction with muted styling.',
			},
		},
	},
	args: {
		disabled: true,
		children: 'Disabled Non-Interactive Card',
	},
};

export const AsAnchorLink: Story = {
	parameters: {
		docs: {
			description: {
				story: 'Polymorphic card rendering as an anchor element (`as="a"`).',
			},
		},
	},
	args: {
		as: 'a',
		href: '#test-link',
		children: 'Card Rendered as Anchor Link',
	},
};
