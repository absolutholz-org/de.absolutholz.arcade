import { styled } from '@linaria/react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { themeColor } from '../../styles/theme/theme.utils';
import { PauseOverlay } from './_PauseOverlay';

const PreviewBoard = styled.div`
	position: relative;
	width: 32rem;
	height: 24rem;
	display: flex;
	align-items: center;
	justify-content: center;
	background-color: ${themeColor('container-1')};
	border: 1px dashed ${themeColor('container-2')};
	border-radius: var(--radius-lg);
	overflow: hidden;
`;

const meta = {
	component: PauseOverlay,
	parameters: {
		layout: 'centered',
		docs: {
			description: {
				component:
					'The PauseOverlay component dims and masks game boards during pause states, preventing puzzle inspection while keeping persistent navigation headers interactive.',
			},
		},
	},
	tags: ['autodocs'],
	title: 'Components/Overlays & Feedback/PauseOverlay',
	decorators: [
		(Story) => (
			<PreviewBoard>
				<span>Simulated Game Board</span>
				<Story />
			</PreviewBoard>
		),
	],
	argTypes: {
		isOpen: {
			control: 'boolean',
			description: 'Controls visibility of the overlay',
		},
		title: {
			control: 'text',
			description: 'Main heading text displayed on the pause card',
		},
		description: {
			control: 'text',
			description: 'Descriptive subtext explaining the paused state',
		},
		resumeLabel: {
			control: 'text',
			description: 'Label for the primary resume button',
		},
		restartLabel: {
			control: 'text',
			description: 'Label for the secondary restart button',
		},
		onResume: {
			action: 'resume clicked',
			description: 'Callback when resume action is triggered',
		},
		onRestart: {
			action: 'restart clicked',
			description: 'Callback when restart action is triggered',
		},
	},
	args: {
		isOpen: true,
		title: 'Game Paused',
		description: 'The timer is stopped and the board is hidden.',
		resumeLabel: 'Resume',
		restartLabel: 'Restart',
	},
} satisfies Meta<typeof PauseOverlay>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	parameters: {
		docs: {
			description: {
				story: 'Standard pause overlay displaying primary Resume and secondary Restart actions.',
			},
		},
	},
};

export const WithoutDescription: Story = {
	args: {
		description: undefined,
	},
	parameters: {
		docs: {
			description: {
				story: 'Minimal pause overlay omitting the descriptive message.',
			},
		},
	},
};
