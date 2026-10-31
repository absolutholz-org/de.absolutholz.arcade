import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../Button';
import { Text } from '../Text';
import { Tooltip } from './_Tooltip';
import { TOOLTIP_POSITIONS } from './_Tooltip.constants';

const meta = {
	component: Tooltip,
	parameters: {
		layout: 'centered',
		docs: {
			description: {
				component:
					'The Tooltip component provides supplementary contextual information anchored to an interactive trigger element. It implements WCAG 2.2 AA / BITV 2.0 requirements (dismissable via Escape, hoverable with enter/exit grace intervals, persistent, and accessible via focus/blur).',
			},
		},
	},
	tags: ['autodocs'],
	title: 'Components/Tooltip',
	argTypes: {
		position: {
			control: 'select',
			options: TOOLTIP_POSITIONS,
			description: 'Preferred floating position of the tooltip relative to the trigger element',
		},
		content: {
			control: 'text',
			description: 'Text or rich content to display in the tooltip',
		},
		children: {
			control: false,
			description: 'Single interactive child element acting as the trigger',
		},
	},
	args: {
		content: 'Helpful context or shortcut information',
		position: 'top',
		children: <Button variant="secondary">Hover or Focus Me</Button>,
	},
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	parameters: {
		docs: {
			description: {
				story: 'Standard top-positioned tooltip anchored above the trigger element.',
			},
		},
	},
};

export const Bottom: Story = {
	args: {
		position: 'bottom',
		content: 'Tooltip displayed below the trigger element',
	},
	parameters: {
		docs: {
			description: {
				story: 'Tooltip positioned directly beneath the trigger element.',
			},
		},
	},
};

export const Left: Story = {
	args: {
		position: 'left',
		content: 'Tooltip positioned on the left side',
	},
	parameters: {
		docs: {
			description: {
				story: 'Tooltip positioned to the left of the trigger element.',
			},
		},
	},
};

export const Right: Story = {
	args: {
		position: 'right',
		content: 'Tooltip positioned on the right side',
	},
	parameters: {
		docs: {
			description: {
				story: 'Tooltip positioned to the right of the trigger element.',
			},
		},
	},
};

export const WithRichContent: Story = {
	args: {
		position: 'top',
		content: (
			<Text variant="small">
				Keyboard shortcut: <strong>⌘K</strong>
			</Text>
		),
	},
	parameters: {
		docs: {
			description: {
				story: 'Demonstrates rich React node content rendered within the tooltip using design system typography.',
			},
		},
	},
};
