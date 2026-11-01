import type { DieState } from '@arcade/lib-dice';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Die } from '.';
import { Button } from '../Button';

const meta = {
	title: 'Components/Die',
	component: Die,
	parameters: {
		layout: 'centered',
		docs: {
			description: {
				component:
					'Die is an accessible, 3D CSS transform D6 die component featuring pure theme-token styling, high-contrast pips, keyboard controls, non-color visual held indicators, and reduced-motion support.',
			},
		},
	},
	tags: ['autodocs'],
	args: {
		state: {
			id: 'die-demo',
			sides: 6,
			value: 4,
			isHeld: false,
			isRolling: false,
		},
		index: 0,
	},
	argTypes: {
		onToggleHold: { action: 'toggleHold' },
	},
} satisfies Meta<typeof Die>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Interactive: Story = {
	parameters: {
		docs: {
			description: {
				story: 'Fully interactive D6 die. Click the die or press Space/Enter to toggle the held state. Use the "Roll Die" button to trigger a multi-axis tumble animation with physics hopping that randomly lands on a face.',
			},
		},
	},
	render: (args) => {
		const [die, setDie] = useState<DieState>(args.state);
		const [isRolling, setIsRolling] = useState<boolean>(false);

		const handleToggle = (id: string) => {
			args.onToggleHold?.(id);
			setDie((prev) => ({ ...prev, isHeld: !prev.isHeld }));
		};

		const handleRoll = () => {
			if (die.isHeld || isRolling) return;
			setIsRolling(true);

			const interval = setInterval(() => {
				const randomFace = (Math.floor(Math.random() * 6) + 1) as 1 | 2 | 3 | 4 | 5 | 6;
				setDie((prev) => ({ ...prev, value: randomFace }));
			}, 70);

			setTimeout(() => {
				clearInterval(interval);
				const finalFace = (Math.floor(Math.random() * 6) + 1) as 1 | 2 | 3 | 4 | 5 | 6;
				setDie((prev) => ({ ...prev, value: finalFace }));
				setIsRolling(false);
			}, 520);
		};

		return (
			<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
				<Die {...args} state={die} isRolling={isRolling} onToggleHold={handleToggle} />
				<div style={{ display: 'flex', gap: '0.5rem' }}>
					<Button variant="primary" size="sm" onClick={handleRoll} disabled={die.isHeld || isRolling}>
						Roll Die
					</Button>
					<Button
						variant="outline"
						size="sm"
						onClick={() => setDie((prev) => ({ ...prev, isHeld: !prev.isHeld }))}
					>
						{die.isHeld ? 'Unlock Die' : 'Lock (Hold) Die'}
					</Button>
				</div>
			</div>
		);
	},
};

export const HeldState: Story = {
	parameters: {
		docs: {
			description: {
				story: 'A held die is protected against rerolls. It renders an accent outline ring and a dedicated non-color "HELD" lock badge ensuring WCAG 2.2 accessibility without relying solely on color.',
			},
		},
	},
	args: {
		state: {
			id: 'die-held',
			sides: 6,
			value: 6,
			isHeld: true,
			isRolling: false,
		},
		index: 1,
	},
};
