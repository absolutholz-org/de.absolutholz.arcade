import type { Meta, StoryObj } from '@storybook/react-vite';
import { Switch } from '.';
import { Text } from '../Text';
import { Theme } from '../Theme';
import { SWITCH_SIZES } from './_Switch.constants';

const meta = {
	component: Switch,
	parameters: {
		layout: 'centered',
		docs: {
			description: {
				component:
					'The Switch component provides an accessible toggle control adhering to WCAG 2.2 AA and BITV 2.0 specifications. Built on native checkbox elements with role="switch", it supports controlled and uncontrolled state, sizing variants, full-width layouts, and high-contrast Forced Colors Mode.',
			},
		},
	},
	tags: ['autodocs'],
	title: 'Components/Switch',
	argTypes: {
		size: {
			control: 'radio',
			options: SWITCH_SIZES,
			description: 'Sizing preset dictating track and thumb dimensions',
		},
		label: {
			control: 'text',
			description: 'Visual label rendered beside the switch',
		},
		checked: {
			control: 'boolean',
			description: 'Controlled checked state',
		},
		defaultChecked: {
			control: 'boolean',
			description: 'Initial checked state when uncontrolled',
		},
		disabled: {
			control: 'boolean',
			description: 'Disables user interactions and applies dimmed visual styling',
		},
		fullWidth: {
			control: 'boolean',
			description: 'Expands container to fill 100% of parent width',
		},
	},
	args: {
		label: 'Airplane Mode',
		size: 'md',
		disabled: false,
		fullWidth: false,
	},
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	parameters: {
		docs: {
			description: {
				story: 'Standard switch component in an unchecked, interactive state.',
			},
		},
	},
	args: {
		label: 'Airplane Mode',
	},
};

export const Checked: Story = {
	parameters: {
		docs: {
			description: {
				story: 'Switch initialized in the checked/active state.',
			},
		},
	},
	args: {
		label: 'Wi-Fi',
		defaultChecked: true,
	},
};

export const Small: Story = {
	parameters: {
		docs: {
			description: {
				story: 'Compact switch variant designed for dense toolbars or settings lists.',
			},
		},
	},
	args: {
		label: 'Compact Mode',
		size: 'sm',
	},
};

export const Disabled: Story = {
	parameters: {
		docs: {
			description: {
				story: 'Disabled switch state preventing user interaction with dimmed styling.',
			},
		},
	},
	args: {
		label: 'Bluetooth (Unavailable)',
		disabled: true,
		defaultChecked: true,
	},
};

export const FullWidth: Story = {
	parameters: {
		layout: 'padded',
		docs: {
			description: {
				story: 'Full-width switch layout distributing label and toggle to opposite edges.',
			},
		},
	},
	decorators: [
		(Story) => (
			<div style={{ maxWidth: '24rem', width: '100%', margin: '0 auto' }}>
				<Story />
			</div>
		),
	],
	args: {
		label: 'Push Notifications',
		fullWidth: true,
	},
};

export const WithoutLabel: Story = {
	parameters: {
		docs: {
			description: {
				story: 'Switch rendered without visible text, relying on aria-label for accessibility.',
			},
		},
	},
	args: {
		label: undefined,
		'aria-label': 'Toggle sound effects',
	},
};

export const Themed: Story = {
	parameters: {
		docs: {
			description: {
				story: 'Switch rendered inside a themed container, demonstrating theme token inheritance.',
			},
		},
	},
	render: (args) => (
		<Theme name="secondary">
			<div
				style={{
					padding: '1.5rem',
					display: 'flex',
					flexDirection: 'column',
					gap: '1rem',
					borderRadius: '0.75rem',
				}}
			>
				<Text variant="h3" as="h3">
					Themed Settings
				</Text>
				<Switch {...args} />
			</div>
		</Theme>
	),
	args: {
		label: 'Dark Mode Override',
		defaultChecked: true,
	},
};
