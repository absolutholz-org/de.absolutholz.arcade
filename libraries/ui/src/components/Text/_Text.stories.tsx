import type { Meta, StoryObj } from '@storybook/react-vite';
import { Text } from '.';
import { SEMANTIC_VARIANTS, TEXT_WRAP_OPTIONS } from './_Text.constants';

const LOREM_SHORT = 'Lorem ipsum dolor sit amet consectetur adipiscing elit.';

const LOREM_MEDIUM =
	'Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis.';

const LOREM_LONG =
	'Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas.';

const LOREM_FULL =
	'Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos.';

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
				story: 'The default Text component rendering a div element with base typography and pretty text wrapping.',
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
				story: 'Pretty wrapping prevents line orphans (single words on the last line) and adjusts justification for harmonious long-form reading.',
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
				story: 'Balanced wrapping distributes words evenly across lines to form a clean, balanced block. Best used for short titles and headings.',
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
				story: 'Truncation cuts off text exceeding its container limits, appending a clean ellipsis (...).',
			},
		},
	},
	decorators: [
		(Story) => (
			<div style={{ maxWidth: '200px', border: '1px dashed #ccc', padding: '8px' }}>
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
				story: 'Normal wrapping style defaults line-breaking logic to standard browser layout rules.',
			},
		},
	},
};

export const InteractiveLinks: Story = {
	render: () => (
		<div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '36rem' }}>
			<Text variant="h3" as="h3">
				Semantic Links & Anchor Tags
			</Text>
			<Text variant="base" as="p">
				Here is an inline paragraph with an <a href="#demo-link">accessible semantic link</a> embedded within
				body copy. Notice the subtle offset underline that lifts below descenders to ensure WCAG 1.4.1
				compliance.
			</Text>
			<Text variant="small" as="p">
				Try keyboard navigation: press <kbd>Tab</kbd> to inspect the high-contrast focus ring on{' '}
				<a href="#keyboard-focus">focused anchor elements</a>.
			</Text>
			<div style={{ display: 'flex', gap: '1.5rem', paddingTop: '0.5rem' }}>
				<a href="#standalone-1">Standalone Nav Link</a>
				<a href="#standalone-2">Secondary Nav Link</a>
			</div>
		</div>
	),
	parameters: {
		docs: {
			description: {
				story: 'Demonstrates context-aware global link styling. Inline links within paragraphs feature a subtle offset underline for WCAG 1.4.1 compliance, while standalone navigation links remain clean until hovered or focused.',
			},
		},
	},
};
