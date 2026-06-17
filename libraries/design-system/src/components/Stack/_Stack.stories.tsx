import type { Meta, StoryObj } from '@storybook/react-vite';
import React from 'react';
import styled from '@emotion/styled';
import { Stack } from '.';
import { Theme } from '../Theme';
import { Text } from '../Text';
import {
	STACK_DIRECTIONS,
	STACK_ALIGNS,
	STACK_JUSTIFIES,
} from './_Stack.constants';
import { spacingScale } from '../../styles/spacing/spacing.constants';

const meta = {
	component: Stack,
	parameters: {
		layout: 'centered',
	},
	tags: ['autodocs'],
	title: 'Components/Stack',
	argTypes: {
		direction: {
			control: 'select',
			options: STACK_DIRECTIONS,
			description: 'The direction of the flex container',
		},
		align: {
			control: 'select',
			options: STACK_ALIGNS,
			description: 'The vertical or cross-axis alignment of items',
		},
		justify: {
			control: 'select',
			options: STACK_JUSTIFIES,
			description: 'The horizontal or main-axis alignment of items',
		},
		spacing: {
			control: 'select',
			options: Object.keys(spacingScale),
			description: 'The gap/spacing between flex elements',
		},
		crossSpacing: {
			control: 'select',
			options: Object.keys(spacingScale),
			description: 'The secondary axis gap/spacing when items wrap',
		},
		wrap: {
			control: 'boolean',
			description: 'Whether flex items should wrap onto multiple lines',
		},
		component: {
			control: 'text',
			description: 'HTML tag or React element wrapper override (alias of as)',
		},
		as: {
			control: 'text',
			description: 'HTML tag or React element wrapper override',
		},
	},
	args: {
		direction: 'column',
		align: 'stretch',
		justify: 'start',
		spacing: 'md',
		wrap: false,
		as: 'div',
	},
} satisfies Meta<typeof Stack>;

export default meta;
type Story = StoryObj<typeof meta>;

// Decorative container mimicking page surroundings
const Canvas = styled.div`
	background-color: var(--color-surface);
	border: 1px solid var(--color-container-2);
	border-radius: 12px;
	padding: 32px;
	min-width: 480px;
	max-width: 640px;
	box-sizing: border-box;
	font-family: 'Inter', system-ui, sans-serif;
`;

const DecorativeBlock = styled.div`
	background-color: var(--color-container-1);
	border: 2px dashed var(--color-accent);
	border-radius: 8px;
	padding: 16px;
	color: var(--color-text-1);
	font-weight: 600;
	text-align: center;
	min-width: 80px;
`;

export const Default: Story = {
	parameters: {
		docs: {
			description: {
				story:
					'The default Stack arranges child items vertically (direction: "column") with the standard "md" spacing between them.',
			},
		},
	},
	render: (args) => (
		<Theme name="primary">
			<Canvas>
				<Stack {...args}>
					<DecorativeBlock>Item 1</DecorativeBlock>
					<DecorativeBlock>Item 2</DecorativeBlock>
					<DecorativeBlock>Item 3</DecorativeBlock>
				</Stack>
			</Canvas>
		</Theme>
	),
};

export const Row: Story = {
	args: {
		direction: 'row',
		align: 'center',
		spacing: 'lg',
	},
	parameters: {
		docs: {
			description: {
				story:
					'A horizontal Stack (direction: "row") maps spacing to the horizontal axis, aligning children side-by-side.',
			},
		},
	},
	render: (args) => (
		<Theme name="primary">
			<Canvas>
				<Stack {...args}>
					<DecorativeBlock>Item 1</DecorativeBlock>
					<DecorativeBlock>Item 2</DecorativeBlock>
					<DecorativeBlock>Item 3</DecorativeBlock>
				</Stack>
			</Canvas>
		</Theme>
	),
};

export const Wrapped: Story = {
	args: {
		direction: 'row',
		wrap: true,
		spacing: 'md',
		crossSpacing: 'lg',
	},
	parameters: {
		docs: {
			description: {
				story:
					'When wrap is enabled, items flow onto new lines. You can configure a secondary "crossSpacing" to control vertical space between rows independently of horizontal column spacing.',
			},
		},
	},
	render: (args) => (
		<Theme name="primary">
			<Canvas>
				<Stack {...args}>
					<DecorativeBlock style={{ minWidth: '150px' }}>
						Item 1 (Wide)
					</DecorativeBlock>
					<DecorativeBlock style={{ minWidth: '180px' }}>
						Item 2 (Wider)
					</DecorativeBlock>
					<DecorativeBlock style={{ minWidth: '120px' }}>
						Item 3
					</DecorativeBlock>
					<DecorativeBlock style={{ minWidth: '200px' }}>
						Item 4 (Widest)
					</DecorativeBlock>
					<DecorativeBlock style={{ minWidth: '140px' }}>
						Item 5
					</DecorativeBlock>
				</Stack>
			</Canvas>
		</Theme>
	),
};

export const NestedCard: Story = {
	parameters: {
		docs: {
			description: {
				story:
					'Nesting Stacks enables complex, cleanly-spaced structural layouts like cards or list items without custom flexbox CSS.',
			},
		},
	},
	render: () => (
		<Theme name="primary">
			<Canvas>
				<Stack spacing="lg" align="stretch">
					{/* Card Header Stack */}
					<Stack direction="row" justify="between" align="center" spacing="md">
						<Stack spacing="2xs">
							<Text variant="h3" as="h2" style={{ margin: 0 }}>
								Solid Walnut Bed
							</Text>
							<Text variant="small" style={{ opacity: 0.7 }}>
								Collection: Bedroom Furniture
							</Text>
						</Stack>
						<DecorativeBlock style={{ padding: '6px 12px', minWidth: 'auto' }}>
							$1,499
						</DecorativeBlock>
					</Stack>

					{/* Divider */}
					<div
						style={{
							height: '1px',
							backgroundColor: 'var(--color-container-2)',
							width: '100%',
						}}
					/>

					{/* Description */}
					<Text variant="base">
						Handcrafted from local German walnut wood, finished with natural oil
						for a velvety sheen and lifetime durability. Minimalist joinery.
					</Text>

					{/* Footer Button Row Stack */}
					<Stack direction="row" justify="end" spacing="sm">
						<button
							style={{
								padding: '8px 16px',
								borderRadius: '6px',
								border: '1px solid var(--color-container-2)',
								backgroundColor: 'transparent',
								color: 'var(--color-text-1)',
								cursor: 'pointer',
								fontWeight: 500,
							}}
						>
							Cancel
						</button>
						<button
							style={{
								padding: '8px 16px',
								borderRadius: '6px',
								border: 'none',
								backgroundColor: 'var(--color-accent)',
								color: 'var(--color-surface)',
								cursor: 'pointer',
								fontWeight: 500,
							}}
						>
							Add to Cart
						</button>
					</Stack>
				</Stack>
			</Canvas>
		</Theme>
	),
};
