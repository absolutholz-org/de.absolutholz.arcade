import type { Meta, StoryObj } from '@storybook/react-vite';
import { Icon } from '.';
import { Text } from '../Text';
import { Theme } from '../Theme';
import { ICON_CATALOG, ICON_SIZES } from './_Icon.constants';

const meta = {
	component: Icon,
	parameters: {
		layout: 'centered',
	},
	tags: ['autodocs'],
	title: 'Components/Icon',
	argTypes: {
		name: {
			control: 'select',
			options: Object.keys(ICON_CATALOG),
			description: 'Predefined icon name from the inline SVG catalog',
		},
		size: {
			control: 'select',
			options: Object.keys(ICON_SIZES),
			description: 'Dedicated sizing scale preset',
		},
		emoji: {
			control: 'text',
			description: 'Emoji character rendered within the icon boundary',
		},
		text: {
			control: 'text',
			description: 'Short text character or glyph (max 2 chars) rendered as an icon',
		},
		label: {
			control: 'text',
			description: 'Accessible screen-reader label (sets role="img")',
		},
	},
	args: {
		name: 'settings',
		size: 'md',
	},
} satisfies Meta<typeof Icon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	parameters: {
		docs: {
			description: {
				story: 'Default inline SVG icon rendering the settings gear at medium size.',
			},
		},
	},
};

export const DuoToneAccent: Story = {
	args: {
		name: 'info',
		size: 'lg',
	},
	parameters: {
		docs: {
			description: {
				story: 'Duo-tone SVG icon using var(--color-accent, currentColor). In themed contexts it reflects the theme accent color; otherwise it automatically falls back to currentColor.',
			},
		},
	},
};

export const Emoji: Story = {
	args: {
		name: undefined,
		emoji: '🎮',
		size: 'xl',
		label: 'Arcade Controller',
	},
	parameters: {
		docs: {
			description: {
				story: 'Emoji rendered inside the icon bounding box with an accessible label and role="img".',
			},
		},
	},
};

export const TextGlyph: Story = {
	args: {
		name: undefined,
		text: '★',
		size: 'lg',
		label: 'Star rating',
	},
	parameters: {
		docs: {
			description: {
				story: 'Typographical glyph or character clamped to a maximum of 2 characters and scaled to the icon size.',
			},
		},
	},
};

export const CustomSvg: Story = {
	args: {
		name: undefined,
		size: 'xl',
		label: 'Custom Sparkle Icon',
		svg: (
			<svg
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth={2}
				strokeLinecap="round"
				strokeLinejoin="round"
				focusable="false"
				aria-hidden="true"
			>
				<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
				<circle cx="12" cy="12" r="3" fill="var(--color-accent, currentColor)" stroke="none" />
			</svg>
		),
	},
	parameters: {
		docs: {
			description: {
				story: 'Arbitrary custom inline SVG passed via the dedicated svg prop, utilizing var(--color-accent, currentColor) directly.',
			},
		},
	},
};

export const InheritInTypography: Story = {
	args: {
		name: 'check',
		size: 'inherit',
	},
	render: (args) => (
		<Text variant="h2" as="h2">
			Success verified <Icon {...args} />
		</Text>
	),
	parameters: {
		docs: {
			description: {
				story: 'Using size="inherit" allows the icon to scale dynamically with the parent typography component.',
			},
		},
	},
};

export const InsideTheme: Story = {
	args: {
		name: 'info',
		size: 'xl',
	},
	render: (args) => (
		<Theme name="stpatricks">
			<Icon {...args} />
		</Theme>
	),
	parameters: {
		docs: {
			description: {
				story: 'Icon nested inside a Theme provider, dynamically inheriting the theme context --color-accent token.',
			},
		},
	},
};
