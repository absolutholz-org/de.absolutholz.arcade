import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { NumberStepper } from '.';

const meta = {
	component: NumberStepper,
	parameters: {
		layout: 'centered',
		docs: {
			description: {
				component:
					'NumberStepper is an accessible numeric stepper combining a native `<input type="text" inputMode="numeric">` with `−` and `+` `<Button>` controls and automatic `[min, max]` clamping.',
			},
		},
	},
	tags: ['autodocs'],
	title: 'Components/NumberStepper',
	args: {
		value: 1,
		min: 1,
		max: 10,
		step: 1,
		disabled: false,
		label: 'Number of coins',
		decrementLabel: 'Decrease count',
		incrementLabel: 'Increase count',
		onChange: () => {},
	},
} satisfies Meta<typeof NumberStepper>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	parameters: {
		docs: {
			description: {
				story: 'Standard numeric stepper clamped between 1 and 10.',
			},
		},
	},
	render: (args) => {
		const [value, setValue] = useState(args.value);
		return <NumberStepper {...args} value={value} onChange={setValue} />;
	},
};

export const Disabled: Story = {
	parameters: {
		docs: {
			description: {
				story: 'Disabled state preventing both keyboard entry and stepper clicks.',
			},
		},
	},
	args: {
		disabled: true,
		value: 3,
	},
};
