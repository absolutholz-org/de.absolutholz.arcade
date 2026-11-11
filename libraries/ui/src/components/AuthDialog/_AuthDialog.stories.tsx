import type { Meta, StoryObj } from '@storybook/react-vite';
import { AuthDialog } from './_AuthDialog';

const meta: Meta<typeof AuthDialog> = {
	title: 'Components/AuthDialog',
	component: AuthDialog,
	parameters: {
		layout: 'centered',
	},
	argTypes: {
		onClose: { action: 'closed' },
		initialMode: {
			control: 'select',
			options: ['signIn', 'signUp', 'forgotPassword'],
		},
	},
};

export default meta;
type Story = StoryObj<typeof AuthDialog>;

export const SignIn: Story = {
	args: {
		isOpen: true,
		initialMode: 'signIn',
	},
	parameters: {
		docs: {
			description: {
				story: 'Authentication modal presenting email/password and Google sign-in workflows.',
			},
		},
	},
};

export const SignUp: Story = {
	args: {
		isOpen: true,
		initialMode: 'signUp',
	},
	parameters: {
		docs: {
			description: {
				story: 'Authentication modal presenting account creation workflow.',
			},
		},
	},
};

export const ForgotPassword: Story = {
	args: {
		isOpen: true,
		initialMode: 'forgotPassword',
	},
	parameters: {
		docs: {
			description: {
				story: 'Authentication modal presenting password reset workflow.',
			},
		},
	},
};
