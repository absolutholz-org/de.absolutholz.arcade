import { css } from '@linaria/core';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Theme } from '.';
import { themeColor } from '../../styles/theme/theme.utils';
import { Text } from '../Text';
import { THEME_NAMES } from './_Theme.constants';

const cardStyle = css`
	background-color: ${themeColor('surface')};
	color: ${themeColor('text-1')};
	border: 1px solid ${themeColor('container-2')};
	border-radius: 1rem;
	padding: 1.5rem;
	box-shadow: 0 0.5rem 1.5rem rgba(0, 0, 0, 0.04);
	transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
	width: 20rem;
	display: flex;
	flex-direction: column;
	gap: 0.75rem;

	&:hover {
		transform: translateY(-0.25rem);
		box-shadow: 0 0.75rem 2rem rgba(0, 0, 0, 0.08);
		border-color: ${themeColor('accent')};
	}
`;

const buttonStyle = css`
	background-color: ${themeColor('accent')};
	color: ${themeColor('accent-contrast')};
	border: none;
	border-radius: 0.5rem;
	padding: 0.625rem 1.125rem;
	font-family: inherit;
	font-size: 0.875rem;
	font-weight: 600;
	cursor: pointer;
	transition: opacity 0.2s ease, transform 0.1s ease;
	margin-top: 0.5rem;

	&:hover {
		opacity: 0.9;
	}
	&:active {
		transform: scale(0.97);
	}
`;

const DemoCard = ({ themeName }: { themeName: string }) => (
	<div className={cardStyle}>
		<Text variant="small" style={{ color: themeColor('text-3'), textTransform: 'uppercase' }}>
			{themeName} theme
		</Text>
		<Text variant="h3" as="h3">
			Premium Woodcrafts
		</Text>
		<Text variant="base">
			Handcrafted with precision using sustainable local oak and walnut. Every piece tells a unique story.
		</Text>
		<button type="button" className={buttonStyle}>
			Explore Collection
		</button>
	</div>
);

const meta = {
	component: Theme,
	parameters: {
		layout: 'centered',
		docs: {
			description: {
				component:
					"The Theme component is a layout context wrapper that maps generic CSS Custom Properties (e.g., `--color-surface`, `--color-text-1`) to concrete, brand-specific themeset variables (e.g., `var(--theme-secondary-surface)`).\n\nFor details on the system's two-tier branding strategy, see the [Theme Architecture documentation](?path=/docs/foundations-theme-logic-architecture--docs).",
			},
		},
	},
	tags: ['autodocs'],
	title: 'Components/Theme',
	argTypes: {
		name: {
			control: 'select',
			options: THEME_NAMES,
			description: 'The name of the theme to apply (e.g., primary, secondary, contrast, accent)',
		},
		as: {
			control: 'text',
			description: 'The HTML element or custom component to render as the wrapping element',
		},
	},
	args: {
		name: 'primary',
		as: 'div',
	},
	render: (args) => (
		<Theme {...args}>
			<DemoCard themeName={args.name || 'primary'} />
		</Theme>
	),
} satisfies Meta<typeof Theme>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
	args: {
		name: 'primary',
	},
	parameters: {
		docs: {
			description: {
				story: 'Primary theme variant provides the baseline palette with balanced containers and neutral surfaces.',
			},
		},
	},
};

export const Secondary: Story = {
	args: {
		name: 'secondary',
	},
	parameters: {
		docs: {
			description: {
				story: 'Secondary theme variant applies complementary tones, ideal for secondary content blocks and sidebars.',
			},
		},
	},
};

export const Contrast: Story = {
	args: {
		name: 'contrast',
	},
	parameters: {
		docs: {
			description: {
				story: 'Contrast theme variant inverts surface and text polarities for high-impact visual sections.',
			},
		},
	},
};

export const Accent: Story = {
	args: {
		name: 'accent',
	},
	parameters: {
		docs: {
			description: {
				story: 'Accent theme variant elevates the brand accent color across surfaces and borders for callout highlights.',
			},
		},
	},
};
