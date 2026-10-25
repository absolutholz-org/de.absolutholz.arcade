import type { Meta, StoryObj } from '@storybook/react-vite';
import { Text } from '../Text';
import { Timer } from '../Timer';
import { GameHeader } from './_GameHeader';

const fn = () => () => {};

const meta = {
	title: 'Components/Game/GameHeader',
	component: GameHeader,
	parameters: {
		layout: 'fullscreen',
	},
	args: {
		onLobbyClick: fn(),
		onOpenSettings: fn(),
		onUserClick: fn(),
	},
} satisfies Meta<typeof GameHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: (args) => (
		<GameHeader {...args}>
			<Text variant="small">EASY</Text>
			<Timer seconds={84} isPaused={false} onTogglePause={fn()} />
		</GameHeader>
	),
};

export const NarrowMobile: Story = {
	parameters: {
		viewport: {
			defaultViewport: 'mobile1',
		},
	},
	render: (args) => (
		<div style={{ maxWidth: '320px', margin: '0 auto' }}>
			<GameHeader {...args}>
				<Text variant="small">HARD</Text>
				<Timer seconds={142} isPaused={false} onTogglePause={fn()} />
			</GameHeader>
		</div>
	),
};

export const WithoutUserAction: Story = {
	render: (args) => {
		const { onUserClick: _omitted, ...rest } = args;
		return (
			<GameHeader {...rest}>
				<Text variant="small">MEDIUM</Text>
				<Timer seconds={42} isPaused={false} onTogglePause={fn()} />
			</GameHeader>
		);
	},
};

export const PausedState: Story = {
	render: (args) => (
		<GameHeader {...args}>
			<Text variant="small">PAUSED</Text>
			<Timer seconds={84} isPaused={true} onTogglePause={fn()} />
		</GameHeader>
	),
};
