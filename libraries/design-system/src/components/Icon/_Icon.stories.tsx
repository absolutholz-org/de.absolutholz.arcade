import type { Meta, StoryObj } from '@storybook/react-vite';
import { Icon } from '.';
import { ICON_SIZES, ICON_CATALOG } from './_Icon.constants';

const meta = {
	component: Icon,
	parameters: {
		layout: 'centered',
	},
	tags: ['autodocs'],
	title: 'Components/Icon',
	argTypes: {
		size: {
			control: 'select',
			options: Object.keys(ICON_SIZES),
			description: 'The sizing variant of the icon',
		},
		name: {
			control: 'select',
			options: Object.keys(ICON_CATALOG),
			description: 'The name of the catalog SVG icon to render',
		},
		emoji: {
			control: 'text',
			description: 'Unicode emoji string to render instead of SVG catalog',
		},
		label: {
			control: 'text',
			description:
				'Accessible label for screen readers. Omitting this makes the icon decorative (aria-hidden).',
		},
	},
	args: {
		size: 'md',
		name: 'settings',
		label: 'Settings',
	},
} satisfies Meta<typeof Icon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	parameters: {
		docs: {
			description: {
				story:
					'The default Icon rendering a settings SVG icon in medium size with an informative accessible label.',
			},
		},
	},
};

export const Small: Story = {
	args: {
		size: 'sm',
		name: 'check',
		label: 'Success Checkmark',
	},
	parameters: {
		docs: {
			description: {
				story: 'A small-sized success checkmark icon.',
			},
		},
	},
};

export const Large: Story = {
	args: {
		size: 'lg',
		name: 'info',
		label: 'Information Dialog',
	},
	parameters: {
		docs: {
			description: {
				story: 'A large-sized info icon.',
			},
		},
	},
};

export const ExtraLarge: Story = {
	args: {
		size: 'xl',
		name: 'alert-circle',
		label: 'Warning Alert',
	},
	parameters: {
		docs: {
			description: {
				story: 'An extra-large alert circle warning icon.',
			},
		},
	},
};

export const EmojiIcon: Story = {
	args: {
		name: undefined,
		emoji: '👋',
		label: 'Waving Hand',
		size: 'md',
	},
	parameters: {
		docs: {
			description: {
				story:
					'The Icon component rendering an emoji. It correctly applies the font-size scaling to match the container size and attaches the appropriate screen-reader role.',
			},
		},
	},
};

export const Decorative: Story = {
	args: {
		name: 'close',
		label: undefined, // empty makes it decorative
		size: 'md',
	},
	parameters: {
		docs: {
			description: {
				story:
					'A decorative icon with no accessible label. It outputs aria-hidden="true" to be completely ignored by screen readers.',
			},
		},
	},
};
