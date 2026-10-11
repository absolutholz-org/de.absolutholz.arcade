import { styled } from '@linaria/react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { themeColor } from '../../styles/theme/theme.utils';
import { Button } from '../Button';
import { PauseOverlay } from '../PauseOverlay';
import { GameContainer } from './_GameContainer';

const SimulatedHeader = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 0.75rem 1rem;
	width: 100%;
	background-color: ${themeColor('surface')};
	border-bottom: 1px solid ${themeColor('container-2')};
	font-weight: 600;
`;

const SimulatedBoard = styled.div`
	width: min(80vw, 24rem);
	aspect-ratio: 1 / 1;
	display: flex;
	align-items: center;
	justify-content: center;
	background-color: ${themeColor('container-1')};
	border: 2px solid ${themeColor('container-2')};
	border-radius: var(--radius-md);
`;

const SimulatedControls = styled.div`
	margin-top: 1rem;
	display: flex;
	gap: 0.5rem;
`;

const meta = {
	component: GameContainer,
	parameters: {
		layout: 'fullscreen',
		docs: {
			description: {
				component:
					'The GameContainer layout standardizes the interactive game screen across all arcade games. It pins a persistent header to the top of the viewport and renders a full-bleed play area below it that natively confines pause masks and game boards.',
			},
		},
	},
	tags: ['autodocs'],
	title: 'Components/GameContainer',
	args: {
		header: (
			<SimulatedHeader>
				<span>Arcade Game Header</span>
				<Button variant="secondary" size="sm">
					Pause
				</Button>
			</SimulatedHeader>
		),
		children: (
			<>
				<SimulatedBoard>Interactive Game Board</SimulatedBoard>
				<SimulatedControls>
					<Button variant="primary" size="md">
						Action 1
					</Button>
					<Button variant="secondary" size="md">
						Action 2
					</Button>
				</SimulatedControls>
			</>
		),
	},
} satisfies Meta<typeof GameContainer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	parameters: {
		docs: {
			description: {
				story: 'Standard unpaused game viewport with header pinned at the top and vertically centered gameplay area.',
			},
		},
	},
};

export const Paused: Story = {
	args: {
		overlay: (
			<PauseOverlay
				isOpen={true}
				title="Game Paused"
				description="The timer is halted and the game board is hidden."
				resumeLabel="Resume"
				restartLabel="Restart"
				onResume={() => {}}
				onRestart={() => {}}
			/>
		),
	},
	parameters: {
		docs: {
			description: {
				story: 'Paused game viewport where the backdrop covers the entire area below the header, leaving header controls accessible.',
			},
		},
	},
};
