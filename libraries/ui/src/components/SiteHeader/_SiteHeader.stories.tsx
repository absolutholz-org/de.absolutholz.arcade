import type { Meta, StoryObj } from '@storybook/react-vite';
import { SiteHeader } from '.';
import { Logo } from '../Logo';
import { Text } from '../Text';
import { Theme } from '../Theme';

const meta = {
	component: SiteHeader,
	parameters: {
		layout: 'fullscreen',
		docs: {
			description: {
				component:
					'The SiteHeader component provides a top-level banner landmark container with consistent bottom border and responsive layout padding.',
			},
		},
	},
	tags: ['autodocs'],
	title: 'Components/SiteHeader',
	argTypes: {
		children: {
			control: false,
			description: 'Child elements rendered inside the header container.',
		},
	},
	decorators: [
		(Story) => (
			<Theme name="primary">
				<div
					style={{
						backgroundColor: 'var(--color-surface)',
						color: 'var(--color-text-1)',
						minHeight: '12rem',
						width: '100%',
					}}
				>
					<Story />
				</div>
			</Theme>
		),
	],
} satisfies Meta<typeof SiteHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	parameters: {
		docs: {
			description: {
				story: 'Default site header rendering an empty banner landmark container.',
			},
		},
	},
};

export const WithContent: Story = {
	args: {
		children: (
			<div style={{ alignItems: 'center', display: 'inline-flex', gap: '0.75rem' }}>
				<Logo size="sm" />
				<Text variant="h3" as="span">
					Arcade
				</Text>
			</div>
		),
	},
	parameters: {
		docs: {
			description: {
				story: 'Site header rendered with example child content.',
			},
		},
	},
};
