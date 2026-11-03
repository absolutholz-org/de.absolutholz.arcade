import type { Meta, StoryObj } from '@storybook/react-vite';
import { GamesGrid } from '.';
import { GameCard } from '../GameCard';

const meta = {
	component: GamesGrid,
	parameters: {
		layout: 'padded',
		docs: {
			description: {
				component:
					'GamesGrid provides a responsive auto-fill grid layout for displaying game and tool catalog cards.',
			},
		},
	},
	tags: ['autodocs'],
	title: 'Components/GamesGrid',
} satisfies Meta<typeof GamesGrid>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	parameters: {
		docs: {
			description: {
				story: 'Responsive grid rendering multiple GameCard instances.',
			},
		},
	},
	render: () => (
		<GamesGrid>
			<GameCard
				title="Sudoku"
				description="Classic 9×9 number placement puzzle."
				icon="🔢"
				badge="Logic"
				href="/sudoku/en/"
			/>
			<GameCard
				title="Minesweeper"
				description="Deduce hidden mine locations."
				icon="💣"
				badge="Strategy"
				href="/minesweeper/en/"
			/>
			<GameCard
				title="Dice Roller"
				description="Interactive 3D dice physics utility."
				icon="🎲"
				href="/en/tools/dice/"
			/>
		</GamesGrid>
	),
};
