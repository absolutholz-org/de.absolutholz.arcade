import type { Meta, StoryObj } from '@storybook/react-vite';
import { SchemeSwitcher } from '.';
import { Theme } from '../Theme';
import { SCHEME_ORIENTATIONS } from './_SchemeSwitcher.constants';

const meta = {
	component: SchemeSwitcher,
	parameters: {
		layout: 'centered',
		docs: {
			description: {
				component:
					'The SchemeSwitcher component renders an accessible radio group to control color-scheme preferences (`light`, `dark`, or `system`). It automatically updates the document root `color-scheme` CSS property and persists the user preference in local storage.',
			},
		},
	},
	tags: ['autodocs'],
	title: 'Components/SchemeSwitcher',
	argTypes: {
		legend: {
			control: 'text',
			description: 'Accessible label or title for the scheme switcher radio group',
		},
		hideLegend: {
			control: 'boolean',
			description: 'Visually hide the legend while keeping it accessible to screen readers',
		},
		orientation: {
			control: 'radio',
			options: SCHEME_ORIENTATIONS,
			description: 'Layout orientation of the options',
		},
		as: {
			control: 'text',
			description: 'The HTML element or custom component to render as the wrapping element',
		},
	},
	args: {
		legend: 'Color Scheme',
		hideLegend: false,
		orientation: 'horizontal',
		as: 'fieldset',
	},
} satisfies Meta<typeof SchemeSwitcher>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	parameters: {
		docs: {
			description: {
				story: 'Default horizontal color scheme switcher with a visible group legend.',
			},
		},
	},
};

export const Vertical: Story = {
	args: {
		orientation: 'vertical',
	},
	parameters: {
		docs: {
			description: {
				story: 'Vertical layout orientation for sidebars, compact drawer menus, or settings dialogs.',
			},
		},
	},
};

export const HiddenLegend: Story = {
	args: {
		hideLegend: true,
	},
	parameters: {
		docs: {
			description: {
				story: 'Visually hidden legend for inline toolbars where an accessible name is required for screen readers but visual labels are omitted.',
			},
		},
	},
};

export const CustomLegend: Story = {
	args: {
		legend: 'Display Mode',
	},
	parameters: {
		docs: {
			description: {
				story: 'Customized legend title for specific application requirements.',
			},
		},
	},
};

export const ThemedSecondary: Story = {
	decorators: [
		(Story) => (
			<Theme name="secondary">
				<div
					style={{
						padding: '1.5rem',
						backgroundColor: 'var(--color-surface)',
						border: '1px solid var(--color-container-2)',
						borderRadius: '1rem',
					}}
				>
					<Story />
				</div>
			</Theme>
		),
	],
	parameters: {
		docs: {
			description: {
				story: 'SchemeSwitcher rendered inside a secondary theme context, adapting to themed colors and backgrounds.',
			},
		},
	},
};
