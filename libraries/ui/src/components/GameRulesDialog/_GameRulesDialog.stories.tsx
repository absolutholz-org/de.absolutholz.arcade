import type { Meta, StoryObj } from '@storybook/react-vite';
import { MarkdownContent } from '../MarkdownContent';
import { GameRulesDialog } from './_GameRulesDialog';

const meta: Meta<typeof GameRulesDialog> = {
	title: 'Layouts/Game Layout/GameRulesDialog',
	component: GameRulesDialog,
	parameters: {
		layout: 'centered',
	},
	argTypes: {
		onClose: { action: 'closed' },
	},
};

export default meta;
type Story = StoryObj<typeof GameRulesDialog>;

export const Default: Story = {
	args: {
		isOpen: true,
		gameTitle: 'Sudoku',
		children: (
			<MarkdownContent>
				<h1>How to Play Sudoku</h1>
				<h2>Objective</h2>
				<p>
					Fill the 9×9 grid with digits from 1 to 9 so that each column, each row, and each of the nine 3×3
					subgrids contain all digits without repetition.
				</p>
				<h2>Rules</h2>
				<p>Each row and column must contain each number exactly once.</p>
			</MarkdownContent>
		),
	},
	parameters: {
		docs: {
			description: {
				story: 'Standard in-game rules dialog featuring uniform two-line header hierarchy and seamless markdown content.',
			},
		},
	},
};
