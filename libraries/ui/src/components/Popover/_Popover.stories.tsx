import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../Button';
import { Stack } from '../Stack';
import { Text } from '../Text';
import { Popover } from './_Popover';
import { POPOVER_ALIGNMENTS } from './_Popover.constants';

const meta = {
	component: Popover,
	parameters: {
		layout: 'centered',
		docs: {
			description: {
				component:
					'The Popover component displays rich floating content anchored to a trigger element using native browser popover capabilities (`popover="auto"` and `popovertarget`), combined with collision-aware floating positioning and modern top-layer entry animations (`@starting-style`).',
			},
		},
	},
	tags: ['autodocs'],
	title: 'Components/Popover',
	argTypes: {
		align: {
			control: 'select',
			options: POPOVER_ALIGNMENTS,
			description: 'Preferred floating position of the popover relative to the trigger element',
		},
		children: {
			control: false,
			description: 'First child is the interactive trigger; remaining children form the popover body',
		},
	},
	args: {
		align: 'bottom',
		children: [
			<Button key="trigger" variant="primary">
				Open Popover
			</Button>,
			<Stack key="content" spacing="xs">
				<Text variant="h3" as="h3">
					Native Popover
				</Text>
				<Text variant="base">This overlay leverages top-layer rendering and light-dismiss functionality.</Text>
			</Stack>,
		],
	},
} satisfies Meta<typeof Popover>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	parameters: {
		docs: {
			description: {
				story: 'Standard bottom-aligned popover anchored directly beneath the trigger button.',
			},
		},
	},
};

export const Top: Story = {
	args: {
		align: 'top',
	},
	parameters: {
		docs: {
			description: {
				story: 'Popover positioned above the trigger with collision-aware repositioning.',
			},
		},
	},
};

export const Left: Story = {
	args: {
		align: 'left',
	},
	parameters: {
		docs: {
			description: {
				story: 'Popover positioned to the left side of the trigger element.',
			},
		},
	},
};

export const Right: Story = {
	args: {
		align: 'right',
	},
	parameters: {
		docs: {
			description: {
				story: 'Popover positioned to the right side of the trigger element.',
			},
		},
	},
};

export const WithInteractiveContent: Story = {
	args: {
		align: 'bottom',
		children: [
			<Button key="trigger" variant="secondary">
				Manage Settings
			</Button>,
			<Stack key="content" spacing="sm">
				<Text variant="h3" as="h3">
					Account Actions
				</Text>
				<Text variant="small">Clicking an action button inside automatically closes the popover.</Text>
				<Stack spacing="xs">
					<Button size="sm" variant="primary">
						Confirm Choice
					</Button>
					<Button size="sm" variant="ghost">
						Cancel
					</Button>
				</Stack>
			</Stack>,
		],
	},
	parameters: {
		docs: {
			description: {
				story: 'Demonstrates auto-dismiss behavior when buttons or links inside the popover card are activated.',
			},
		},
	},
};
