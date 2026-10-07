import { I18nProvider } from '@arcade/lib-i18n/provider/I18nProvider';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { SchemeSwitcher } from '.';
import { BUTTON_SIZES, BUTTON_VARIANTS } from '../Button/_Button.constants';
import { POPOVER_ALIGNMENTS } from '../Popover/_Popover.constants';
import { Theme } from '../Theme';

const meta = {
	component: SchemeSwitcher,
	decorators: [
		(Story) => (
			<I18nProvider>
				<Story />
			</I18nProvider>
		),
	],
	parameters: {
		layout: 'centered',
		docs: {
			description: {
				component:
					'The SchemeSwitcher component renders an accessible dropdown listbox built on CollapsibleListbox to control color-scheme preferences (`light`, `dark`, or `system`). It automatically synchronizes the root document `color-scheme` CSS property and persists the selection in namespaced local storage (`arcade::ui::scheme`).',
			},
		},
	},
	tags: ['autodocs'],
	title: 'Components/SchemeSwitcher',
	argTypes: {
		variant: {
			control: 'select',
			options: BUTTON_VARIANTS,
			description: 'The visual variant of the trigger button',
		},
		size: {
			control: 'select',
			options: BUTTON_SIZES,
			description: 'Sizing preset dictating padding, font size, and bounds',
		},
		align: {
			control: 'select',
			options: POPOVER_ALIGNMENTS,
			description: 'Alignment position of the popover menu',
		},
		showLabel: {
			control: 'boolean',
			description: 'Whether to show the text label alongside the icon',
		},
		'aria-label': {
			control: 'text',
			description: 'Accessible label for the listbox element',
		},
		disabled: {
			control: 'boolean',
			description: 'Whether the scheme switcher trigger is disabled',
		},
	},
	args: {
		size: 'md',
		align: 'bottom',
		showLabel: false,
		'aria-label': 'Color scheme',
		disabled: false,
	},
} satisfies Meta<typeof SchemeSwitcher>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	parameters: {
		docs: {
			description: {
				story: 'Default icon-only color scheme switcher with an accessible tooltip and popover menu.',
			},
		},
	},
};

export const WithLabel: Story = {
	args: {
		showLabel: true,
	},
	parameters: {
		docs: {
			description: {
				story: 'Scheme switcher with both active icon and visible text label.',
			},
		},
	},
};

export const Small: Story = {
	args: {
		size: 'sm',
	},
	parameters: {
		docs: {
			description: {
				story: 'Compact small button size suitable for dense headers and toolbars.',
			},
		},
	},
};

export const Large: Story = {
	args: {
		size: 'lg',
		showLabel: true,
	},
	parameters: {
		docs: {
			description: {
				story: 'Prominent large size with visible text label.',
			},
		},
	},
};

export const Disabled: Story = {
	args: {
		disabled: true,
	},
	parameters: {
		docs: {
			description: {
				story: 'Disabled state preventing interaction.',
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
