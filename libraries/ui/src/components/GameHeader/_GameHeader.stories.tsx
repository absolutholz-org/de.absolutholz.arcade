import type { Meta, StoryObj } from '@storybook/react-vite';
import { Timer } from '../Timer';
import { GameHeader } from './_GameHeader';

const meta = {
	title: 'Components/Navigation/GameHeader',
	component: GameHeader,
	parameters: {
		layout: 'fullscreen',
	},
} satisfies Meta<typeof GameHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		backHref: '/lobby',
		backLabel: 'Lobby',
		difficulty: 'Easy',
		timer: <Timer seconds={222} isPaused={false} />,
		onOpenSettings: () => {},
	},
};

export const CompactMinimal: Story = {
	name: 'Compact / Minimal',
	args: {
		backHref: '/lobby',
		backLabel: 'Lobby',
		onOpenSettings: () => {},
	},
};
