import type { Meta, StoryObj } from '@storybook/react-vite';
import { MedalCard } from './MedalCard';

const meta = {
	component: MedalCard,
	parameters: {
		layout: 'centered',
		docs: {
			description: {
				component:
					'MedalCard displays achievement feats in either standalone single-tier mode or progressive 3-tier ladder mode consuming MedalIcon and TriadBadge.',
			},
		},
	},
	tags: ['autodocs'],
	title: 'Components/Cards & Surfaces/MedalCard',
	args: {
		title: 'Speed Demon',
		description: 'Complete a puzzle in under 3 minutes.',
		gameBadge: 'Sudoku',
		tier: 'gold',
		unlocked: true,
		unlockedDateText: 'Unlocked on Oct 19, 2026',
	},
} satisfies Meta<typeof MedalCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const StandaloneUnlocked: Story = {
	args: {
		mode: 'standalone',
		title: 'Speed Demon',
		description: 'Complete a puzzle in under 3 minutes.',
		tier: 'gold',
		unlocked: true,
		unlockedDateText: 'Unlocked on Oct 19, 2026',
	},
};

export const StandaloneWithProgress: Story = {
	args: {
		mode: 'standalone',
		title: 'Puzzle Novice',
		description: 'Win 10 games of Sudoku on any difficulty.',
		tier: 'bronze',
		unlocked: false,
		progress: {
			current: 7,
			target: 10,
		},
	},
};

export const ProgressiveLadder: Story = {
	args: {
		mode: 'progressive',
		title: 'Win Streak Master',
		description: 'Win consecutive games without making mistakes.',
		bronzeUnlocked: true,
		silverUnlocked: false,
		goldUnlocked: false,
		progressiveProgress: {
			current: 2,
			target: 3,
			nextTier: 'silver',
		},
	},
};
