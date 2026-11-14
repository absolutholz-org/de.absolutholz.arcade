import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { ShakeToggle } from '.';

const meta = {
	component: ShakeToggle,
	parameters: {
		layout: 'centered',
		docs: {
			description: {
				component:
					'ShakeToggle is a shared toggle button powered by `useShake` that detects physical shake gestures via `DeviceMotionEvent` feature detection (hiding itself automatically on devices without accelerometer hardware).',
			},
		},
	},
	tags: ['autodocs'],
	title: 'Components/ShakeToggle',
	args: {
		onShake: () => {},
		enableLabel: 'Enable Shake to Flip',
		enabledLabel: 'Shake to flip is active',
		disabledLabel: 'Shake to flip is disabled',
		threshold: 16,
		cooldownMs: 800,
		enableHaptics: true,
		defaultEnabled: true,
	},
} satisfies Meta<typeof ShakeToggle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	parameters: {
		docs: {
			description: {
				story: 'Renders on motion-capable devices (or iOS Safari with `DeviceMotionEvent.requestPermission`). On desktop without an accelerometer, `ShakeToggle` returns `null`.',
			},
		},
	},
	render: (args) => {
		const [shakes, setShakes] = useState(0);
		return (
			<div>
				<ShakeToggle {...args} onShake={() => setShakes((c) => c + 1)} />
				<p>Detected shakes: {shakes}</p>
			</div>
		);
	},
};
