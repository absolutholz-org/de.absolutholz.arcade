import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { SegmentedControl } from '.';
import type { SegmentedControlItem } from './_SegmentedControl.types';

const SAMPLE_ITEMS: SegmentedControlItem[] = [
	{ id: 'easy', label: 'Easy' },
	{ id: 'medium', label: 'Medium' },
	{ id: 'hard', label: 'Hard' },
	{ id: 'expert', label: 'Expert', disabled: true },
];

const SAMPLE_ITEMS_WITH_SUBLABELS: SegmentedControlItem[] = [
	{ id: '6x6', label: '6×6', sublabel: 'Fast' },
	{ id: '8x8', label: '8×8', sublabel: 'Standard' },
	{ id: '10x10', label: '10×10', sublabel: 'Complex' },
];

const meta = {
	component: SegmentedControl,
	parameters: {
		layout: 'centered',
		docs: {
			description: {
				component:
					'SegmentedControl is a responsive, accessible switcher primitive implementing the WAI-ARIA radiogroup pattern with arrow key roving focus.',
			},
		},
	},
	tags: ['autodocs'],
	title: 'Components/SegmentedControl',
	args: {
		items: SAMPLE_ITEMS,
		value: 'medium',
		onChange: () => {},
		ariaLabel: 'Difficulty selector',
	},
} satisfies Meta<typeof SegmentedControl>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	parameters: {
		docs: {
			description: {
				story: 'Standard difficulty options with active selection and disabled segment.',
			},
		},
	},
	render: (args) => {
		const [current, setCurrent] = useState(args.value);
		return <SegmentedControl {...args} value={current} onChange={setCurrent} />;
	},
};

export const WithSublabels: Story = {
	parameters: {
		docs: {
			description: {
				story: 'Grid size selection with descriptive sublabels below each segment.',
			},
		},
	},
	args: {
		items: SAMPLE_ITEMS_WITH_SUBLABELS,
		value: '8x8',
		ariaLabel: 'Grid size selector',
	},
	render: (args) => {
		const [current, setCurrent] = useState(args.value);
		return <SegmentedControl {...args} value={current} onChange={setCurrent} />;
	},
};
