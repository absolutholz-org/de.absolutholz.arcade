import type { Meta, StoryObj } from '@storybook/react-vite';
import { Text } from '.';
import {
	LOREM_SHORT,
	LOREM_MEDIUM,
	LOREM_LONG,
	LOREM_FULL,
	SEMANTIC_VARIANTS,
	TEXT_WRAP_OPTIONS,
} from './_Text.constants';

const meta = {
	component: Text,
	parameters: {
		layout: 'centered',
	},
	tags: ['autodocs'],
	title: 'Components/Text',
	argTypes: {
		variant: {
			control: 'select',
			options: Object.keys(SEMANTIC_VARIANTS),
			description: 'The high-level semantic typography variant',
		},
		wrap: {
			control: 'select',
			options: TEXT_WRAP_OPTIONS,
			description: 'Control how text wraps or truncates',
		},
		as: {
			control: 'text',
			description: 'The HTML element or custom component to render',
		},
	},
	args: {
		variant: 'base',
		wrap: 'pretty',
		children: LOREM_SHORT,
	},
} satisfies Meta<typeof Text>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	parameters: {
		docs: {
			description: {
				story:
					'The default Text component rendering a div element with base typography and pretty text wrapping.',
			},
		},
	},
};

export const Pretty: Story = {
	args: {
		wrap: 'pretty',
		children: LOREM_LONG,
	},
	parameters: {
		docs: {
			description: {
				story:
					'Pretty wrapping prevents line orphans (single words on the last line) and adjusts justification for harmonious long-form reading.',
			},
		},
	},
};

export const Balance: Story = {
	args: {
		wrap: 'balance',
		children: LOREM_MEDIUM,
	},
	parameters: {
		docs: {
			description: {
				story:
					'Balanced wrapping distributes words evenly across lines to form a clean, balanced block. Best used for short titles and headings.',
			},
		},
	},
};

export const Truncate: Story = {
	args: {
		wrap: 'truncate',
		children: LOREM_FULL,
	},
	parameters: {
		docs: {
			description: {
				story:
					'Truncation cuts off text exceeding its container limits, appending a clean ellipsis (...).',
			},
		},
	},
	decorators: [
		(Story) => (
			<div
				style={{ maxWidth: '200px', border: '1px dashed #ccc', padding: '8px' }}
			>
				<Story />
			</div>
		),
	],
};

export const Normal: Story = {
	args: {
		wrap: 'normal',
		children: LOREM_LONG,
	},
	parameters: {
		docs: {
			description: {
				story:
					'Normal wrapping style defaults line-breaking logic to standard browser layout rules.',
			},
		},
	},
};
