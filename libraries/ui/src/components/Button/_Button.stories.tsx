import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '.';
import { Icon } from '../Icon';
import { BUTTON_SIZES, BUTTON_VARIANTS } from './_Button.constants';

const meta = {
	component: Button,
	parameters: {
		layout: 'centered',
		docs: {
			description: {
				component:
					'The Button component triggers actions or events. It supports 4 visual variants (primary, secondary, outline, ghost), 3 sizes (sm, md, lg), polymorphic rendering (`as`), leading/trailing icons, and icon-only configurations with full WCAG 2.2 AA accessibility.',
			},
		},
	},
	tags: ['autodocs'],
	title: 'Components/Button',
	argTypes: {
		variant: {
			control: 'select',
			options: BUTTON_VARIANTS,
			description: 'Visual variant representing hierarchy and intent',
		},
		size: {
			control: 'radio',
			options: BUTTON_SIZES,
			description: 'Sizing preset dictating dimensions and padding',
		},
		isIconOnly: {
			control: 'boolean',
			description: 'Renders a square button layout optimized for standalone icon presentation',
		},
		disabled: {
			control: 'boolean',
			description: 'Disables user interactions and applies disabled styling',
		},
		children: {
			control: 'text',
			description: 'Button label or nested content',
		},
	},
	args: {
		variant: 'primary',
		size: 'md',
		isIconOnly: false,
		disabled: false,
		children: 'Button',
	},
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
	parameters: {
		docs: {
			description: {
				story: 'High-emphasis primary button used for main call-to-actions, styled using the theme accent color.',
			},
		},
	},
	args: {
		variant: 'primary',
		children: 'Primary',
	},
};

export const Secondary: Story = {
	parameters: {
		docs: {
			description: {
				story: 'Medium-emphasis secondary button with container background styling.',
			},
		},
	},
	args: {
		variant: 'secondary',
		children: 'Secondary',
	},
};

export const Outline: Story = {
	parameters: {
		docs: {
			description: {
				story: 'Bordered outline button offering distinct visual boundaries without heavy surface fill.',
			},
		},
	},
	args: {
		variant: 'outline',
		children: 'Outline',
	},
};

export const Ghost: Story = {
	parameters: {
		docs: {
			description: {
				story: 'Low-emphasis ghost button that blends into backgrounds until hovered.',
			},
		},
	},
	args: {
		variant: 'ghost',
		children: 'Ghost',
	},
};

export const Small: Story = {
	parameters: {
		docs: {
			description: {
				story: 'Compact button variant suitable for dense toolbars or nested lists.',
			},
		},
	},
	args: {
		size: 'sm',
		children: 'Small Button',
	},
};

export const Large: Story = {
	parameters: {
		docs: {
			description: {
				story: 'Prominent large button variant suited for hero sections and standout CTAs.',
			},
		},
	},
	args: {
		size: 'lg',
		children: 'Large Button',
	},
};

export const WithLeadingIcon: Story = {
	parameters: {
		docs: {
			description: {
				story: 'Button configured with a leading decorative icon alongside text label.',
			},
		},
	},
	args: {
		variant: 'primary',
		children: 'Settings',
		leadingIcon: <Icon name="settings" size="sm" />,
	},
};

export const WithTrailingIcon: Story = {
	parameters: {
		docs: {
			description: {
				story: 'Button configured with a trailing action/indicator icon.',
			},
		},
	},
	args: {
		variant: 'secondary',
		children: 'Next Step',
		trailingIcon: <Icon name="chevron-right" size="sm" />,
	},
};

export const WithBothIcons: Story = {
	parameters: {
		docs: {
			description: {
				story: 'Button configured with both a leading icon and a trailing indicator icon.',
			},
		},
	},
	args: {
		variant: 'primary',
		children: 'Confirm',
		leadingIcon: <Icon name="check" size="sm" />,
		trailingIcon: <Icon name="chevron-right" size="sm" />,
	},
};

export const IconOnly: Story = {
	parameters: {
		docs: {
			description: {
				story: 'Icon-only square button with accessible `aria-label` for screen reader users.',
			},
		},
	},
	args: {
		variant: 'outline',
		isIconOnly: true,
		'aria-label': 'Settings',
		children: <Icon name="settings" size="md" />,
	},
};

export const Disabled: Story = {
	parameters: {
		docs: {
			description: {
				story: 'Disabled button state preventing clicks and communicating inert state to assistive tech.',
			},
		},
	},
	args: {
		variant: 'primary',
		children: 'Disabled',
		disabled: true,
	},
};

export const AsAnchorLink: Story = {
	parameters: {
		docs: {
			description: {
				story: 'Button rendered semantically as an anchor tag (`<a>`) via the polymorphic `as` prop.',
			},
		},
	},
	args: {
		as: 'a',
		href: '#',
		variant: 'primary',
		children: 'Link Button',
	},
};
