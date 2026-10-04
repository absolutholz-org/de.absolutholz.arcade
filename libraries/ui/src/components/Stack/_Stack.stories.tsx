import { styled } from '@linaria/react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Stack } from '.';
import { spacingKeys } from '../../styles/spacing';
import { Text } from '../Text';
import { Theme } from '../Theme';
import { STACK_ALIGNS, STACK_DIRECTIONS, STACK_JUSTIFIES } from './_Stack.constants';

const meta = {
	component: Stack,
	parameters: {
		layout: 'centered',
		docs: {
			description: {
				component:
					'The Stack component provides a flexbox-based layout container to organize and space child elements along main and cross axes. Built with zero-runtime Linaria styles and locked spacing scale tokens.',
			},
		},
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
			description: 'The cross-axis alignment of items',
		},
		justify: {
			control: 'select',
			options: STACK_JUSTIFIES,
			description: 'The main-axis alignment of items',
		},
		spacing: {
			control: 'select',
			options: spacingKeys,
			description: 'The primary spacing/gap between flex elements',
		},
		crossSpacing: {
			control: 'select',
			options: spacingKeys,
			description: 'Optional secondary cross-axis gap when items wrap onto multiple lines',
		},
		wrap: {
			control: 'boolean',
			description: 'Whether flex items should wrap onto multiple lines',
		},
		fullWidth: {
			control: 'boolean',
			description: 'Whether the stack takes 100% of parent width',
		},
		inline: {
			control: 'boolean',
			description: 'Whether to render as inline-flex',
		},
		as: {
			control: 'text',
			description: 'HTML tag or component wrapper override',
		},
	},
	args: {
		direction: 'column',
		align: 'stretch',
		justify: 'start',
		spacing: 'md',
		wrap: false,
		fullWidth: true,
		inline: false,
		as: 'div',
	},
} satisfies Meta<typeof Stack>;

export default meta;
type Story = StoryObj<typeof meta>;

const Canvas = styled.div`
	background-color: var(--color-surface);
	border: 1px solid var(--color-container-2);
	border-radius: 0.75rem;
	max-width: 40rem;
	min-width: 28rem;
	padding: 2rem;
`;

const DecorativeBlock = styled.div`
	background-color: var(--color-container-1);
	border: 2px dashed var(--color-accent);
	border-radius: 0.5rem;
	color: var(--color-text-1);
	font-weight: 600;
	min-width: 5rem;
	padding: 1rem;
	text-align: center;
`;

export const Default: Story = {
	parameters: {
		docs: {
			description: {
				story: 'The default Stack arranges child items vertically (direction: "column") with the locked "md" spacing token between them.',
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
				story: 'A horizontal Stack (direction: "row") maps spacing to the horizontal axis, aligning children side-by-side.',
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
				story: 'When wrap is enabled, items flow onto new lines. Configuring crossSpacing controls the vertical row gap independently of horizontal column spacing.',
			},
		},
	},
	render: (args) => (
		<Theme name="primary">
			<Canvas>
				<Stack {...args}>
					<DecorativeBlock style={{ minWidth: '9rem' }}>Item 1 (Wide)</DecorativeBlock>
					<DecorativeBlock style={{ minWidth: '11rem' }}>Item 2 (Wider)</DecorativeBlock>
					<DecorativeBlock style={{ minWidth: '7.5rem' }}>Item 3</DecorativeBlock>
					<DecorativeBlock style={{ minWidth: '12rem' }}>Item 4 (Widest)</DecorativeBlock>
					<DecorativeBlock style={{ minWidth: '8.5rem' }}>Item 5</DecorativeBlock>
				</Stack>
			</Canvas>
		</Theme>
	),
};

export const InlineAndCompact: Story = {
	args: {
		direction: 'row',
		inline: true,
		spacing: 'sm',
		align: 'center',
	},
	parameters: {
		docs: {
			description: {
				story: 'Setting inline={true} renders as inline-flex and prevents the stack from expanding to 100% width, ideal for button groups, tags, and inline toolbar items.',
			},
		},
	},
	render: (args) => (
		<Theme name="primary">
			<Canvas>
				<Text variant="base" as="p">
					Here is an inline tag cluster positioned within content:
				</Text>
				<div style={{ marginTop: '1rem' }}>
					<Stack {...args}>
						<DecorativeBlock style={{ padding: '0.25rem 0.75rem', minWidth: 'auto' }}>
							Tag 1
						</DecorativeBlock>
						<DecorativeBlock style={{ padding: '0.25rem 0.75rem', minWidth: 'auto' }}>
							Tag 2
						</DecorativeBlock>
						<DecorativeBlock style={{ padding: '0.25rem 0.75rem', minWidth: 'auto' }}>
							Tag 3
						</DecorativeBlock>
					</Stack>
				</div>
			</Canvas>
		</Theme>
	),
};

export const NestedCard: Story = {
	parameters: {
		docs: {
			description: {
				story: 'Nesting Stacks enables complex, cleanly-spaced structural layouts like cards or list items without custom flexbox CSS.',
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
							<Text variant="h3" as="h2">
								Solid Walnut Table
							</Text>
							<Text variant="small">Collection: Dining Furniture</Text>
						</Stack>
						<DecorativeBlock style={{ padding: '0.375rem 0.75rem', minWidth: 'auto' }}>
							$1,499
						</DecorativeBlock>
					</Stack>

					{/* Divider */}
					<div
						style={{
							backgroundColor: 'var(--color-container-2)',
							height: '1px',
							width: '100%',
						}}
					/>

					{/* Description */}
					<Text variant="base">
						Handcrafted from local German walnut wood, finished with natural oil for a velvety sheen and
						lifetime durability. Minimalist joinery.
					</Text>

					{/* Footer Button Row Stack */}
					<Stack direction="row" justify="end" spacing="sm">
						<button
							type="button"
							style={{
								backgroundColor: 'transparent',
								border: '1px solid var(--color-container-2)',
								borderRadius: '0.375rem',
								color: 'var(--color-text-1)',
								cursor: 'pointer',
								fontWeight: 500,
								padding: '0.5rem 1rem',
							}}
						>
							Cancel
						</button>
						<button
							type="button"
							style={{
								backgroundColor: 'var(--color-accent)',
								border: 'none',
								borderRadius: '0.375rem',
								color: 'var(--color-accent-contrast)',
								cursor: 'pointer',
								fontWeight: 500,
								padding: '0.5rem 1rem',
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
