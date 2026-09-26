import type { Meta, StoryObj } from '@storybook/react-vite';
import { Text } from '../Text';
import { Theme } from '../Theme';
import { TextArea } from './_TextArea';
import { TEXT_AREA_RESIZE_OPTIONS } from './_TextArea.constants';

const meta = {
	component: TextArea,
	parameters: {
		layout: 'centered',
	},
	tags: ['autodocs'],
	title: 'Components/TextArea',
	argTypes: {
		resize: {
			control: 'select',
			options: TEXT_AREA_RESIZE_OPTIONS,
			description: 'Controls the resize behavior of the textarea.',
		},
		disabled: {
			control: 'boolean',
			description: 'Disables standard textarea interaction and styling.',
		},
		readOnly: {
			control: 'boolean',
			description: 'Prevents the user from modifying the value.',
		},
		placeholder: {
			control: 'text',
			description: 'Placeholder text displayed when the textarea is empty.',
		},
		defaultValue: {
			control: 'text',
			description: 'Initial text content of the textarea.',
		},
		'aria-invalid': {
			control: 'boolean',
			description: 'Marks the field as invalid for accessibility and styling.',
		},
	},
	args: {
		'aria-label': 'Feedback comment',
		placeholder: 'Type your message...',
		resize: 'none',
	},
	decorators: [
		(Story) => (
			<div style={{ width: '28rem', maxWidth: '100%' }}>
				<Story />
			</div>
		),
	],
} satisfies Meta<typeof TextArea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {},
	parameters: {
		docs: {
			description: {
				story:
					'Default empty TextArea showcasing a minimum height of 5lh and field-sizing: content.',
			},
		},
	},
};

export const WithPlaceholder: Story = {
	args: {
		placeholder: 'Please describe the issue in detail...',
	},
	parameters: {
		docs: {
			description: {
				story: 'TextArea displaying a helpful placeholder string.',
			},
		},
	},
};

export const WithPreFilledContent: Story = {
	args: {
		defaultValue:
			'Line 1: Absolutholz design system.\nLine 2: Modern web design with CSS field-sizing: content.\nLine 3: Automatically stretches beyond the 5lh minimum block size.\nLine 4: No JavaScript scrollHeight calculation needed.\nLine 5: Fifth line reaches minimum height baseline.\nLine 6: Content automatically expands vertically.\nLine 7: Clean native browser performance.',
	},
	parameters: {
		docs: {
			description: {
				story:
					'TextArea with multi-line content showing auto-expansion beyond 5lh via field-sizing: content.',
			},
		},
	},
};

export const VerticalResize: Story = {
	args: {
		defaultValue: 'This textarea allows manual vertical resizing.',
		resize: 'vertical',
	},
	parameters: {
		docs: {
			description: {
				story:
					'TextArea configured with resize="vertical" to allow user-driven resizing.',
			},
		},
	},
};

export const DisabledState: Story = {
	args: {
		defaultValue:
			'This content cannot be edited because the field is disabled.',
		disabled: true,
	},
	parameters: {
		docs: {
			description: {
				story:
					'A disabled TextArea with diminished opacity and disabled cursor.',
			},
		},
	},
};

export const ReadOnlyState: Story = {
	args: {
		defaultValue:
			'This content is read-only. It can be selected and copied, but not modified.',
		readOnly: true,
	},
	parameters: {
		docs: {
			description: {
				story: 'A read-only TextArea that cannot be altered by the user.',
			},
		},
	},
};

export const InvalidState: Story = {
	args: {
		'aria-invalid': true,
		defaultValue: 'Invalid input value requiring correction.',
	},
	parameters: {
		docs: {
			description: {
				story:
					'TextArea in an invalid error state with red border and outline styling.',
			},
		},
	},
};

export const ThemedExample: Story = {
	render: (args) => (
		<Theme name="secondary">
			<div
				style={{
					display: 'flex',
					flexDirection: 'column',
					gap: '0.75rem',
					padding: '1.5rem',
				}}
			>
				<Text variant="h3" as="h3">
					Themed TextArea
				</Text>
				<Text variant="base">
					This textarea inherits colors and accent borders from the secondary
					theme context.
				</Text>
				<TextArea {...args} />
			</div>
		</Theme>
	),
	parameters: {
		docs: {
			description: {
				story:
					'TextArea rendered inside a Theme context showing container and accent color adaptation.',
			},
		},
	},
};
