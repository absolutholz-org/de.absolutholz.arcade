import type { Meta, StoryObj } from '@storybook/react-vite';
import { MedalIcon } from './MedalIcon';

const meta = {
	component: MedalIcon,
	parameters: {
		layout: 'centered',
		docs: {
			description: {
				component:
					'MedalIcon is a vector award medal component featuring top ribbons, a circular medallion, a dashed inner accent border, and a modular center emblem slot. Supports gold, silver, bronze tiers, and ghosted locked states.',
			},
		},
	},
	tags: ['autodocs'],
	title: 'Components/Data & Display/MedalIcon',
	argTypes: {
		tier: {
			control: 'radio',
			options: ['bronze', 'silver', 'gold'],
			description: 'Metallic award tier',
		},
		state: {
			control: 'radio',
			options: ['unlocked', 'locked'],
			description: 'Unlock status: vibrant metallic or ghosted silhouette',
		},
		size: {
			control: 'number',
			description: 'Size in pixels',
		},
	},
	args: {
		tier: 'gold',
		state: 'unlocked',
		size: 48,
	},
} satisfies Meta<typeof MedalIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Gold: Story = {
	args: {
		tier: 'gold',
		state: 'unlocked',
		size: 48,
	},
};

export const Silver: Story = {
	args: {
		tier: 'silver',
		state: 'unlocked',
		size: 48,
	},
};

export const Bronze: Story = {
	args: {
		tier: 'bronze',
		state: 'unlocked',
		size: 48,
	},
};

export const Locked: Story = {
	args: {
		tier: 'gold',
		state: 'locked',
		size: 48,
	},
};
