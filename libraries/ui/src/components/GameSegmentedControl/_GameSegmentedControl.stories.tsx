import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { GameSegmentedControl } from '.';
import type { GameSegmentedOption } from './_GameSegmentedControl.types';

const SAMPLE_OPTIONS: GameSegmentedOption[] = [
	{ id: 'all', label: 'All Games' },
	{ id: 'sudoku', label: 'Sudoku', icon: '🔢' },
	{ id: 'minesweeper', label: 'Minesweeper', icon: '💣' },
	{ id: 'nonogram', label: 'Nonogram', icon: '🎨' },
	{ id: 'queens', label: 'Queens', icon: '👑' },
	{ id: 'tracks', label: 'Tracks', icon: '🚂' },
];

const meta: Meta<typeof GameSegmentedControl> = {
	title: 'Components/Actions & Inputs/GameSegmentedControl',
	component: GameSegmentedControl,
	parameters: {
		docs: {
			description: {
				component:
					'GameSegmentedControl is a responsive, accessible horizontal game filter tab-bar implementing the WAI-ARIA tablist pattern with keyboard navigation and icon support.',
			},
		},
	},
};

export default meta;
type Story = StoryObj<typeof GameSegmentedControl>;

export const Default: Story = {
	render: () => {
		const [selected, setSelected] = useState('all');
		return (
			<GameSegmentedControl
				options={SAMPLE_OPTIONS}
				selectedId={selected}
				onSelect={setSelected}
				ariaLabel="Select game view"
			/>
		);
	},
};

export const GameSelected: Story = {
	render: () => {
		const [selected, setSelected] = useState('sudoku');
		return (
			<GameSegmentedControl
				options={SAMPLE_OPTIONS}
				selectedId={selected}
				onSelect={setSelected}
				ariaLabel="Select game view"
			/>
		);
	},
};
