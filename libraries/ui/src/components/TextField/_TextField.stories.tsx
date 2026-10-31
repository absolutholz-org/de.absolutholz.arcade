import type { Meta, StoryObj } from '@storybook/react-vite';
import { TextField } from '.';
import { TEXT_FIELD_SIZES } from './_TextField.constants';

const meta = {
	component: TextField,
	parameters: {
		layout: 'centered',
		docs: {
			description: {
				component:
					'The TextField component provides an accessible text input field adhering to WCAG 2.2 AA and BITV 2.0 standards. Features include semantic label binding via htmlFor/id, error messaging via aria-invalid and aria-errormessage, helper text linking via aria-describedby, and static Linaria styling.',
			},
		},
	},
	tags: ['autodocs'],
	title: 'Components/TextField',
	argTypes: {
		size: {
			control: 'radio',
			options: TEXT_FIELD_SIZES,
			description: 'Sizing preset dictating input height and padding',
		},
		label: {
			control: 'text',
			description: 'Accessible label rendered above the input',
		},
		placeholder: {
			control: 'text',
			description: 'Placeholder text displayed when empty',
		},
		helperText: {
			control: 'text',
			description: 'Informative helper text rendered beneath the field',
		},
		error: {
			control: 'text',
			description: 'Validation error message triggering invalid state',
		},
		disabled: {
			control: 'boolean',
			description: 'Disables user interactions and applies dimmed visual styling',
		},
		required: {
			control: 'boolean',
			description: 'Marks input as required and renders required indicator',
		},
		fullWidth: {
			control: 'boolean',
			description: 'Expands container to fill 100% of parent width',
		},
	},
	args: {
		label: 'Email address',
		placeholder: 'player@example.com',
		size: 'md',
		disabled: false,
		required: false,
		fullWidth: false,
	},
} satisfies Meta<typeof TextField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {},
};

export const WithHelperText: Story = {
	args: {
		helperText: 'We will send game notifications to this address.',
	},
};

export const WithError: Story = {
	args: {
		defaultValue: 'invalid-email',
		error: 'Please enter a valid email address.',
	},
};

export const Disabled: Story = {
	args: {
		defaultValue: 'disabled@example.com',
		disabled: true,
	},
};

export const RequiredField: Story = {
	args: {
		required: true,
	},
};
