import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Coin } from '.';
import { Button } from '../Button';
import { COIN_FACES, COIN_SIZES, COIN_STYLES } from './_Coin.constants';
import type { CoinFace, CoinSpinVariant } from './_Coin.types';

const meta = {
	title: 'Components/Coin',
	component: Coin,
	parameters: {
		layout: 'centered',
		docs: {
			description: {
				component:
					'Coin is an accessible, 3D CSS transform coin component featuring three visual styles (token, classic, minimal), keyboard and pointer flip interaction, alternating spin keyframes, and reduced-motion support.',
			},
		},
	},
	tags: ['autodocs'],
	args: {
		face: 'heads',
		styleVariant: 'token',
		size: 'md',
		headsShort: 'H',
		tailsShort: 'T',
	},
	argTypes: {
		face: { control: 'radio', options: COIN_FACES },
		styleVariant: { control: 'radio', options: COIN_STYLES },
		size: { control: 'radio', options: COIN_SIZES },
		onClick: { action: 'flip' },
	},
} satisfies Meta<typeof Coin>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Interactive: Story = {
	parameters: {
		docs: {
			description: {
				story: 'Interactive coin that flips with 3D rotation on click. Toggle styleVariant and size in the Controls panel.',
			},
		},
	},
	render: (args) => {
		const [face, setFace] = useState<CoinFace>(args.face);
		const [isFlipping, setIsFlipping] = useState<boolean>(false);
		const [spinVariant, setSpinVariant] = useState<CoinSpinVariant>('a');

		const handleFlip = () => {
			if (isFlipping) return;
			args.onClick?.();
			setIsFlipping(true);
			setSpinVariant((prev) => (prev === 'a' ? 'b' : 'a'));
			setFace(Math.random() < 0.5 ? 'heads' : 'tails');
			setTimeout(() => {
				setIsFlipping(false);
			}, 620);
		};

		return (
			<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
				<Coin
					{...args}
					face={face}
					isFlipping={isFlipping}
					spinVariant={spinVariant}
					onClick={handleFlip}
					disabled={isFlipping}
				/>
				<Button variant="primary" size="sm" onClick={handleFlip} disabled={isFlipping}>
					Flip Coin
				</Button>
			</div>
		);
	},
};

export const ClassicStyle: Story = {
	parameters: {
		docs: {
			description: {
				story: 'Classic gold/silver coin style variant.',
			},
		},
	},
	args: {
		styleVariant: 'classic',
		face: 'heads',
	},
};

export const MinimalStyle: Story = {
	parameters: {
		docs: {
			description: {
				story: 'High-contrast minimal coin style variant.',
			},
		},
	},
	args: {
		styleVariant: 'minimal',
		face: 'tails',
	},
};
