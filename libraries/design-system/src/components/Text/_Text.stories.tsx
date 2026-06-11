import type { Meta, StoryObj } from '@storybook/react-vite';
import { Text } from '.';

const meta = {
	component: Text,
	parameters: {
		layout: 'centered',
	},
	tags: ['autodocs'],
	title: 'Components/Text',
	argTypes: {
		variant: {
			control: 'select',
			options: ['small', 'base', 'h3', 'h2', 'h1', 'display'],
			description: 'The high-level semantic typography variant',
		},
		as: {
			control: 'text',
			description: 'The HTML element or custom component to render',
		},
	},
	args: {
		variant: 'base',
		children: 'The quick brown fox jumps over the lazy dog',
	},
} satisfies Meta<typeof Text>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
