import type { Meta, StoryObj } from '@storybook/react-vite';
import { SchemeSwitcher } from '.';

const meta = {
	component: SchemeSwitcher,
	parameters: {
		layout: 'centered',
	},
	tags: ['autodocs'],
	title: 'Components/SchemeSwitcher',
} satisfies Meta<typeof SchemeSwitcher>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
