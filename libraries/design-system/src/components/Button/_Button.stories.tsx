import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '.';
import { Icon } from '../Icon';
import {
	BUTTON_ACCENTS,
	BUTTON_DISPLAYS,
	BUTTON_VARIANTS,
} from './_Button.constants';

const meta = {
	component: Button,
	parameters: {
		layout: 'centered',
	},
	tags: ['autodocs'],
	title: 'Components/Button',
	argTypes: {
		variant: {
			control: 'select',
			options: BUTTON_VARIANTS,
			description: 'The visual appearance variant of the button',
		},
		accent: {
			control: 'select',
			options: BUTTON_ACCENTS,
			description: 'The theme accent color applied to the button',
		},
		display: {
			control: 'select',
			options: BUTTON_DISPLAYS,
			description: 'Whether the button is block or inline',
		},
		disabled: {
			control: 'boolean',
			description: 'Disables standard button actions and styling',
		},
		href: {
			control: 'text',
			description:
				'If provided, the button dynamically renders as an anchor (<a>) tag',
		},
	},
	args: {
		accent: 'primary',
		children: 'Button Text',
		display: 'inline',
		variant: 'solid',
	},
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SolidPrimary: Story = {
	args: {
		accent: 'primary',
		variant: 'solid',
	},
	parameters: {
		docs: {
			description: {
				story: 'The default solid button using the primary accent color.',
			},
		},
	},
};

export const SolidSecondary: Story = {
	args: {
		accent: 'secondary',
		variant: 'solid',
	},
	parameters: {
		docs: {
			description: {
				story: 'A solid button using the secondary accent color.',
			},
		},
	},
};

export const OutlinedPrimary: Story = {
	args: {
		accent: 'primary',
		variant: 'outlined',
	},
	parameters: {
		docs: {
			description: {
				story: 'An outlined button using the primary accent color.',
			},
		},
	},
};

export const OutlinedSecondary: Story = {
	args: {
		accent: 'secondary',
		variant: 'outlined',
	},
	parameters: {
		docs: {
			description: {
				story: 'An outlined button using the secondary accent color.',
			},
		},
	},
};

export const GhostPrimary: Story = {
	args: {
		accent: 'primary',
		variant: 'ghost',
	},
	parameters: {
		docs: {
			description: {
				story: 'A ghost button using the primary accent color.',
			},
		},
	},
};

export const GhostSecondary: Story = {
	args: {
		accent: 'secondary',
		variant: 'ghost',
	},
	parameters: {
		docs: {
			description: {
				story: 'A ghost button using the secondary accent color.',
			},
		},
	},
};

export const WithLeadingIcon: Story = {
	args: {
		leadingIcon: <Icon name="settings" size="sm" label="" />,
	},
	parameters: {
		docs: {
			description: {
				story: 'A button containing a leading SVG icon.',
			},
		},
	},
};

export const WithTrailingIcon: Story = {
	args: {
		trailingIcon: <Icon name="chevron-right" size="sm" label="" />,
	},
	parameters: {
		docs: {
			description: {
				story: 'A button containing a trailing SVG icon.',
			},
		},
	},
};

export const AsAnchorLink: Story = {
	args: {
		children: 'Visit Website',
		href: 'https://example.com',
		target: '_blank',
	},
	parameters: {
		docs: {
			description: {
				story:
					'By supplying an `href` prop, the component automatically renders an HTML anchor element (`<a>`) instead of a `<button>`. All native attributes like `target="_blank"` are typechecked and supported.',
			},
		},
	},
};

export const BlockLayout: Story = {
	args: {
		display: 'block',
	},
	parameters: {
		docs: {
			description: {
				story:
					'A full-width block button. This fills its container and behaves as a block-level element.',
			},
		},
	},
};

export const DisabledState: Story = {
	args: {
		disabled: true,
	},
	parameters: {
		docs: {
			description: {
				story:
					'A disabled button. The hover transitions are disabled, standard clicks are ignored, and it receives visual styling representing inactivity.',
			},
		},
	},
};
