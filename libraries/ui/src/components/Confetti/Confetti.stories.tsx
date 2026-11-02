import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Button } from '../Button';
import { Theme } from '../Theme';
import { Confetti } from './Confetti';

const meta = {
	component: Confetti,
	parameters: {
		layout: 'centered',
		docs: {
			description: {
				component:
					'The Confetti component provides a lightweight, zero-dependency HTML5 2D canvas particle effect bursting from screen flanks with 3D tumbling physics and automatic prefers-reduced-motion support.',
			},
		},
	},
	tags: ['autodocs'],
	title: 'Components/Confetti',
	args: {
		particleCount: 140,
	},
	render: (args) => {
		const [triggerKey, setTriggerKey] = useState(0);

		return (
			<Theme>
				<Button onClick={() => setTriggerKey((prev) => prev + 1)}>Trigger Confetti</Button>
				<Confetti key={triggerKey} {...args} />
			</Theme>
		);
	},
} satisfies Meta<typeof Confetti>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
