import type { Meta, StoryObj } from '@storybook/react-vite';
import { useEffect, useState } from 'react';
import { Button } from '../Button';
import { UserProfileDialog } from './_UserProfileDialog';

const meta = {
	component: UserProfileDialog,
	parameters: {
		layout: 'centered',
		docs: {
			description: {
				component:
					'The UserProfileDialog presents user profile preferences, cloud synchronization status, and authentication workflows (sign in, registration, password reset) adhering to WCAG 2.2 AA and BITV 2.0 standards.',
			},
		},
	},
	tags: ['autodocs'],
	title: 'Components/Overlays & Feedback/UserProfileDialog',
	args: {
		errorMessage: null,
		isLoading: false,
		isOpen: true,
		onClose: () => {},
		onResetPassword: async () => {},
		onSignInEmail: async () => {},
		onSignOut: async () => {},
		onSignUpEmail: async () => {},
		onSwitchStorageMode: async () => {},
		onUpdateDisplayName: async () => {},
		session: {
			isAuthenticated: false,
			user: {
				displayName: 'Guest Player',
				storageMode: 'local',
			},
		},
	},
	render: (args) => {
		const [isOpen, setIsOpen] = useState(args.isOpen);

		useEffect(() => {
			setIsOpen(args.isOpen);
		}, [args.isOpen]);

		return (
			<>
				<Button variant="primary" onClick={() => setIsOpen(true)}>
					Open Profile Dialog
				</Button>
				<UserProfileDialog
					{...args}
					isOpen={isOpen}
					onClose={() => {
						setIsOpen(false);
						args.onClose();
					}}
				/>
			</>
		);
	},
} satisfies Meta<typeof UserProfileDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const GuestLocal: Story = {
	args: {
		session: {
			isAuthenticated: false,
			user: {
				displayName: 'Guest Player',
				storageMode: 'local',
			},
		},
	},
	parameters: {
		docs: {
			description: {
				story: 'Displays profile dialog for an unauthenticated user playing locally with guest settings.',
			},
		},
	},
};

export const AuthenticatedCloud: Story = {
	args: {
		session: {
			isAuthenticated: true,
			user: {
				displayName: 'Arcade Champion',
				email: 'champion@arcade.dev',
				storageMode: 'cloud',
			},
		},
	},
	parameters: {
		docs: {
			description: {
				story: 'Displays profile dialog for an authenticated user with cloud sync enabled.',
			},
		},
	},
};

export const Loading: Story = {
	args: {
		isLoading: true,
		session: {
			isAuthenticated: true,
			user: {
				displayName: 'Arcade Champion',
				email: 'champion@arcade.dev',
				storageMode: 'cloud',
			},
		},
	},
	parameters: {
		docs: {
			description: {
				story: 'Demonstrates disabled interactions during active network operations.',
			},
		},
	},
};

export const WithError: Story = {
	args: {
		errorMessage: 'Authentication failed. Please verify your credentials and try again.',
		session: {
			isAuthenticated: false,
			user: {
				displayName: 'Guest Player',
				storageMode: 'local',
			},
		},
	},
	parameters: {
		docs: {
			description: {
				story: 'Displays the accessible alert error banner when an error message is passed.',
			},
		},
	},
};
