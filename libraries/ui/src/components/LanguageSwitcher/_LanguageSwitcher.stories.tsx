import { I18nProvider } from '@arcade/lib-i18n/provider/I18nProvider';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { LanguageSwitcher } from '.';
import { BUTTON_SIZES } from '../Button/_Button.constants';
import { COLLAPSIBLE_LISTBOX_VARIANTS } from '../CollapsibleListbox/_CollapsibleListbox.constants';
import { POPOVER_ALIGNMENTS } from '../Popover/_Popover.constants';
import { Theme } from '../Theme';

const meta = {
	component: LanguageSwitcher,
	parameters: {
		layout: 'centered',
		docs: {
			description: {
				component:
					'The LanguageSwitcher component renders an accessible dropdown listbox allowing users to switch the active language across supported locales. It integrates seamlessly with `@arcade/lib-i18n`, synchronizes the document root `lang` attribute, and persists the chosen language according to ADR 012.',
			},
		},
	},
	tags: ['autodocs'],
	title: 'Components/LanguageSwitcher',
	decorators: [
		(Story) => (
			<I18nProvider>
				<Story />
			</I18nProvider>
		),
	],
	argTypes: {
		variant: {
			control: 'select',
			options: COLLAPSIBLE_LISTBOX_VARIANTS,
			description: 'Visual variant of the trigger button',
		},
		size: {
			control: 'select',
			options: BUTTON_SIZES,
			description: 'Sizing preset dictating padding and touch bounds',
		},
		align: {
			control: 'select',
			options: POPOVER_ALIGNMENTS,
			description: 'Positioning alignment of the popover relative to the trigger',
		},
		showLabel: {
			control: 'boolean',
			description: 'Whether to display the text label in the trigger button or render as icon-only',
		},
		disabled: {
			control: 'boolean',
			description: 'Whether the listbox trigger is disabled',
		},
		'aria-label': {
			control: 'text',
			description: 'Accessible label for the language switcher',
		},
	},
	args: {
		size: 'md',
		align: 'bottom',
		showLabel: false,
		disabled: false,
	},
} satisfies Meta<typeof LanguageSwitcher>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	parameters: {
		docs: {
			description: {
				story: 'Default icon-only language switcher rendering the current language flag and a selectable list of locales.',
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
				story: 'Language switcher showing the active language name alongside the flag icon.',
			},
		},
	},
};

export const PrimaryVariant: Story = {
	args: {
		variant: 'primary',
	},
	parameters: {
		docs: {
			description: {
				story: 'Primary high-contrast button variant for call-to-action headers or prominent hero switchers.',
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
				story: 'Compact size preset optimized for dense navigation bars or mobile headers.',
			},
		},
	},
};

export const Large: Story = {
	args: {
		size: 'lg',
	},
	parameters: {
		docs: {
			description: {
				story: 'Enlarged size preset providing generous touch target bounds for accessibility-first screens.',
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
				story: 'Disabled state when language changing is temporarily restricted.',
			},
		},
	},
};

export const InsideTheme: Story = {
	decorators: [
		(Story) => (
			<Theme name="secondary">
				<div
					style={{
						padding: '2rem',
						backgroundColor: 'var(--color-surface)',
						borderRadius: '0.75rem',
						border: '1px solid var(--color-container-2)',
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
				story: 'LanguageSwitcher rendered inside a secondary theme container, inheriting contextual theme tokens.',
			},
		},
	},
};
