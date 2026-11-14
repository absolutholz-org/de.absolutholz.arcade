import type { Meta, StoryObj } from '@storybook/react-vite';
import { CoinTray } from '.';
import { COIN_STYLES } from '../Coin/_Coin.constants';

const meta = {
	title: 'Components/CoinTray',
	component: CoinTray,
	parameters: {
		layout: 'centered',
		docs: {
			description: {
				component:
					'CoinTray is a responsive, accessible tabletop coin-flipping tray managing 1 to 10 interactive 3D coins. It uses NumberStepper for quick coin-count adjustments, cryptographic RNG, native Web Audio sound synthesis, batch summary aggregation, and WCAG AA live announcements.',
			},
		},
	},
	tags: ['autodocs'],
	args: {
		defaultCount: 1,
		styleVariant: 'token',
		ariaLabel: 'Tabletop Coin Tray',
	},
	argTypes: {
		styleVariant: { control: 'radio', options: COIN_STYLES },
		onFlipComplete: { action: 'onFlipComplete' },
		onCountChange: { action: 'onCountChange' },
	},
} satisfies Meta<typeof CoinTray>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SingleCoin: Story = {
	parameters: {
		docs: {
			description: {
				story: 'Single-coin tabletop tray for quick 50/50 decisions. Click the coin or "Flip Coin" to trigger a 3D toss animation with Web Audio synthesis and live announcements.',
			},
		},
	},
	args: {
		defaultCount: 1,
	},
};

export const ThreeCoins: Story = {
	parameters: {
		docs: {
			description: {
				story: 'Three-coin batch configuration displaying a responsive grid and Heads/Tails summary pill after each flip.',
			},
		},
	},
	args: {
		defaultCount: 3,
	},
};

export const FiveCoins: Story = {
	parameters: {
		docs: {
			description: {
				story: 'Five-coin batch configuration with NumberStepper controls to adjust coin count between 1 and 10.',
			},
		},
	},
	args: {
		defaultCount: 5,
	},
};

export const TenCoinsMax: Story = {
	parameters: {
		docs: {
			description: {
				story: 'Maximum 10-coin tray configuration demonstrating responsive grid wrapping across mobile and desktop viewports.',
			},
		},
	},
	args: {
		defaultCount: 10,
	},
};

export const ClassicStyle: Story = {
	parameters: {
		docs: {
			description: {
				story: 'CoinTray configured with the classic gold/silver coin visual style.',
			},
		},
	},
	args: {
		defaultCount: 3,
		styleVariant: 'classic',
	},
};

export const MinimalStyle: Story = {
	parameters: {
		docs: {
			description: {
				story: 'CoinTray configured with the high-contrast minimal coin visual style.',
			},
		},
	},
	args: {
		defaultCount: 3,
		styleVariant: 'minimal',
	},
};
