import type { Meta, StoryObj } from '@storybook/react-vite';
import { IconButton } from '.';
import { Icon } from '../Icon';
import {
	ICON_BUTTON_ACCENTS,
	ICON_BUTTON_DISPLAYS,
	ICON_BUTTON_VARIANTS,
} from './_IconButton.constants';

const meta = {
	component: IconButton,
	parameters: {
		layout: 'centered',
	},
	tags: ['autodocs'],
	title: 'Components/IconButton',
	argTypes: {
		variant: {
			control: 'select',
			options: ICON_BUTTON_VARIANTS,
			description: 'The visual appearance variant of the icon button',
		},
		accent: {
			control: 'select',
			options: ICON_BUTTON_ACCENTS,
			description: 'The theme accent color applied to the icon button',
		},
		display: {
			control: 'select',
			options: ICON_BUTTON_DISPLAYS,
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
		'aria-label': 'Configure Settings',
		display: 'inline',
		icon: <Icon name="settings" size="sm" label="" />,
		variant: 'solid',
	},
} satisfies Meta<typeof IconButton>;

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
				story: 'The default solid icon button using the primary accent color.',
			},
		},
	},
};

export const SolidSecondary: Story = {
	args: {
		accent: 'secondary',
		icon: <Icon name="check" size="sm" label="" />,
		variant: 'solid',
		'aria-label': 'Confirm Selection',
	},
	parameters: {
		docs: {
			description: {
				story: 'A solid icon button using the secondary accent color.',
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
				story: 'An outlined icon button using the primary accent color.',
			},
		},
	},
};

export const OutlinedSecondary: Story = {
	args: {
		accent: 'secondary',
		icon: <Icon name="check" size="sm" label="" />,
		variant: 'outlined',
		'aria-label': 'Confirm Selection',
	},
	parameters: {
		docs: {
			description: {
				story: 'An outlined icon button using the secondary accent color.',
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
				story: 'A ghost icon button using the primary accent color.',
			},
		},
	},
};

export const GhostSecondary: Story = {
	args: {
		accent: 'secondary',
		icon: <Icon name="close" size="sm" label="" />,
		variant: 'ghost',
		'aria-label': 'Dismiss Dialog',
	},
	parameters: {
		docs: {
			description: {
				story: 'A ghost icon button using the secondary accent color.',
			},
		},
	},
};

export const AsAnchorLink: Story = {
	args: {
		href: 'https://example.com',
		target: '_blank',
		'aria-label': 'Visit External Website',
	},
	parameters: {
		docs: {
			description: {
				story:
					'Renders as an HTML anchor element (`<a>`) instead of a `<button>`. Supports standard attributes like `target="_blank"`. Enforces `aria-label` for screen reader users.',
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
					'A full-width block icon button. Spans the entire width of its container.',
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
					'A disabled icon button. Correctly receives visual styling and native DOM attributes to prevent interactions.',
			},
		},
	},
};
