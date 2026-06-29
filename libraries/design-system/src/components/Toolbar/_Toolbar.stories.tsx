import type { Meta, StoryObj } from '@storybook/react-vite';

import { Toolbar, ToolbarGroup, ToolbarItem } from './_Toolbar';

const meta: Meta<typeof Toolbar> = {
	component: Toolbar,
	parameters: {
		layout: 'centered',
	},
	tags: ['autodocs'],
	title: 'Components/Toolbar',
};

export default meta;

type Story = StoryObj<typeof Toolbar>;

export const Default: Story = {
	args: {
		'aria-label': 'Standard toolbar options',
	},
	parameters: {
		docs: {
			description: {
				story: 'A standard toolbar layout with grouped actions.',
			},
		},
	},
	render: (args) => (
		<Toolbar {...args}>
			<ToolbarGroup>
				<ToolbarItem icon="share" label="Action 1" variant="secondary" />
				<ToolbarItem icon="edit" label="Action 2" variant="secondary" />
			</ToolbarGroup>
			<ToolbarGroup>
				<ToolbarItem icon="refresh" label="Action 3" variant="primary" />
			</ToolbarGroup>
		</Toolbar>
	),
};
