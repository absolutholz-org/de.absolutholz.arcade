import type { Meta, StoryObj } from '@storybook/react-vite';
import { useEffect, useState } from 'react';
import { Button } from '../Button';
import { Theme } from '../Theme';
import { VictoryDialog } from './_VictoryDialog';

const meta = {
	component: VictoryDialog,
	parameters: {
		layout: 'centered',
		docs: {
			description: {
				component:
					'The VictoryDialog component provides a unified modal celebration dialog across all puzzle games, supporting responsive button splitting, time/move statistics cards, and game-specific custom slots.',
			},
		},
	},
	tags: ['autodocs'],
	title: 'Components/Overlays & Feedback/VictoryDialog',
	args: {
		isOpen: true,
		title: 'Puzzle Solved!',
		message: 'Congratulations! You successfully solved the puzzle.',
		elapsedSeconds: 146,
		timeLabel: 'TIME',
		isNewBestTime: true,
		bestTimeText: 'New Best Time!',
		playAgainLabel: 'Play Again',
		lobbyLabel: 'Back to Lobby',
		lobbyHref: '#',
	},
	render: (args) => {
		const [open, setOpen] = useState(args.isOpen);

		useEffect(() => {
			setOpen(args.isOpen);
		}, [args.isOpen]);

		return (
			<Theme>
				<Button onClick={() => setOpen(true)}>Open Victory Dialog</Button>
				<VictoryDialog
					{...args}
					isOpen={open}
					onClose={() => setOpen(false)}
					onPlayAgain={() => setOpen(false)}
				/>
			</Theme>
		);
	},
} satisfies Meta<typeof VictoryDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithNextPuzzle: Story = {
	args: {
		hasNextPuzzle: true,
		nextPuzzleLabel: 'Next Puzzle',
		onNextPuzzle: () => {},
	},
};

export const WithMovesAndDualStats: Story = {
	args: {
		movesCount: 16,
		movesLabel: 'MOVES',
		hasNextPuzzle: true,
		nextPuzzleLabel: 'Next Puzzle',
	},
};
