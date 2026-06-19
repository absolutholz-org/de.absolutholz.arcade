import styled from '@emotion/styled';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Tooltip } from './index';
import { FLOATING_POSITIONS } from './_Tooltip.constants';

const meta = {
	component: Tooltip,
	tags: ['autodocs'],
	title: 'Components/Tooltip',
	argTypes: {
		position: {
			control: 'select',
			options: FLOATING_POSITIONS,
			description:
				'Preferred default placement of the tooltip relative to the trigger.',
		},
		content: {
			control: 'text',
			description:
				'The plain text content to display inside the tooltip bubble.',
		},
	},
	args: {
		content: 'This is a premium tooltip message',
		position: 'top',
	},
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

// Small, compact container to keep Storybook canvas small
const StoryContainer = styled.div`
	align-items: center;
	background-color: var(--color-surface);
	display: flex;
	font-family:
		system-ui,
		-apple-system,
		sans-serif;
	justify-content: center;
	padding: 48px;
`;

const DemoButton = styled.button`
	background-color: var(--color-accent);
	border: none;
	border-radius: 6px;
	color: var(--color-accent-contrast);
	cursor: pointer;
	font-size: var(--font-size-base);
	font-weight: 600;
	padding: 10px 20px;
	transition:
		opacity 0.2s ease,
		transform 0.1s ease;

	&:hover {
		opacity: 0.9;
	}

	&:active {
		transform: scale(0.98);
	}

	&:focus-visible {
		outline: 3px solid var(--color-accent);
		outline-offset: 2px;
	}
`;

export const Default: Story = {
	render: (args) => (
		<StoryContainer>
			<Tooltip {...args}>
				<DemoButton>Hover or Focus Me</DemoButton>
			</Tooltip>
		</StoryContainer>
	),
};

export const PlacementBottom: Story = {
	args: {
		position: 'bottom',
	},
	parameters: {
		docs: {
			description: {
				story: 'Demonstrates the tooltip placed below the trigger element.',
			},
		},
	},
	render: (args) => (
		<StoryContainer>
			<Tooltip {...args}>
				<DemoButton>Tooltip Bottom</DemoButton>
			</Tooltip>
		</StoryContainer>
	),
};

export const PlacementLeft: Story = {
	args: {
		position: 'left',
	},
	parameters: {
		docs: {
			description: {
				story:
					'Demonstrates the tooltip placed to the left of the trigger element.',
			},
		},
	},
	render: (args) => (
		<StoryContainer>
			<Tooltip {...args}>
				<DemoButton>Tooltip Left</DemoButton>
			</Tooltip>
		</StoryContainer>
	),
};

export const PlacementRight: Story = {
	args: {
		position: 'right',
	},
	parameters: {
		docs: {
			description: {
				story:
					'Demonstrates the tooltip placed to the right of the trigger element.',
			},
		},
	},
	render: (args) => (
		<StoryContainer>
			<Tooltip {...args}>
				<DemoButton>Tooltip Right</DemoButton>
			</Tooltip>
		</StoryContainer>
	),
};
