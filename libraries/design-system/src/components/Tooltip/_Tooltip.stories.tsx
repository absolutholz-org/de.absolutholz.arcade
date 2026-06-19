import styled from '@emotion/styled';
import type { Meta, StoryObj } from '@storybook/react-vite';
import React from 'react';
import { themeColor } from '../../styles/theme/theme.utils';
import { FLOATING_POSITIONS } from './_Tooltip.constants';
import { Tooltip } from './index';

// Small, compact container to keep Storybook canvas small
const StoryContainer = styled.div`
	align-items: center;
	background-color: ${themeColor('surface')};
	display: flex;
	font-family:
		system-ui,
		-apple-system,
		sans-serif;
	justify-content: center;
	padding: 48px;
`;

const DemoButton = styled.button`
	background-color: ${themeColor('accent')};
	border: none;
	border-radius: 6px;
	color: ${themeColor('accent-contrast')};
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
		outline: 3px solid ${themeColor('accent')};
		outline-offset: 2px;
	}
`;

const meta = {
	component: Tooltip,
	parameters: {
		docs: {
			description: {
				component:
					'The Tooltip component is an accessible popup overlay used to display context-dependent text descriptions. It automatically binds event listeners (hover, focus) to its child element.\n\n### Position Configuration & Collision Avoidance\n- **Preferred Position**: You can select a preferred placement relative to the trigger using the `position` prop (`top`, `bottom`, `left`, or `right`).\n- **Automatic Boundary Adjustment**: When there is insufficient space in the preferred direction (such as displaying a `left` tooltip close to the left edge of the viewport), the positioning engine automatically detects the boundary collision and flips the tooltip to the opposite side (e.g. `right`) where there is enough space, ensuring the tooltip remains visible.',
			},
		},
	},
	tags: ['autodocs'],
	title: 'Components/Tooltip',
	argTypes: {
		children: {
			control: false,
		},
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
		// Satisfies TypeScript's required children prop without causing serialization warnings
		children: undefined as unknown as React.ReactElement,
		content: 'This is a premium tooltip message',
		position: 'top',
	},
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

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
