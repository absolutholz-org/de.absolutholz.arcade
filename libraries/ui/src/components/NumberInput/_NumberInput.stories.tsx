import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { NumberInput } from '.';

const meta = {
	component: NumberInput,
	parameters: {
		layout: 'centered',
		docs: {
			description: {
				component:
					'NumberInput is a numeric stepper combining a native `<input type="number">` with accessible `−` and `+` `<Button>` controls and automatic `[min, max]` clamping.',
			},
		},
	},
	tags: ['autodocs'],
	title: 'Components/NumberInput',
	args: {
		value: 1,
		min: 1,
		max: 10,
		step: 1,
		size: 'md',
		disabled: false,
		ariaLabel: 'Number of coins',
		decrementAriaLabel: 'Decrease count',
		incrementAriaLabel: 'Increase count',
		onChange: () => {},
	},
} satisfies Meta<typeof NumberInput>;

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
		return <NumberInput {...args} value={value} onChange={setValue} />;
	},
};

export const Small: Story = {
	parameters: {
		docs: {
			description: {
				story: 'Compact `sm` variant for toolbars and inline controls.',
			},
		},
	},
	args: {
		size: 'sm',
		value: 5,
	},
	render: (args) => {
		const [value, setValue] = useState(args.value);
		return <NumberInput {...args} value={value} onChange={setValue} />;
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
