import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { BUTTON_SIZES } from '../Button/_Button.constants';
import { POPOVER_ALIGNMENTS } from '../Popover/_Popover.constants';
import { Theme } from '../Theme';
import { CollapsibleListbox } from './_CollapsibleListbox';
import { COLLAPSIBLE_LISTBOX_VARIANTS } from './_CollapsibleListbox.constants';
import type { CollapsibleListboxOption } from './_CollapsibleListbox.types';

const SAMPLE_OPTIONS: CollapsibleListboxOption[] = [
	{
		id: 'account',
		label: 'Account Settings',
		title: 'Manage account profile and privacy',
		icon: 'settings',
	},
	{
		id: 'notifications',
		label: 'Notifications',
		title: 'Configure alerts and email preferences',
		icon: 'alert-circle',
	},
	{
		id: 'information',
		label: 'System Information',
		title: 'View build version and license',
		icon: 'info',
	},
];

const meta = {
	component: CollapsibleListbox,
	parameters: {
		layout: 'centered',
		docs: {
			description: {
				component:
					'The CollapsibleListbox component provides an accessible select-like dropdown menu anchored using native browser popover capabilities (`popover="auto"`), WAI-ARIA listbox pattern, roving keyboard interaction, and design system Button and Icon components.',
			},
		},
	},
	tags: ['autodocs'],
	title: 'Components/CollapsibleListbox',
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
			description: 'Accessible label for the listbox widget',
		},
	},
	args: {
		'aria-label': 'Select an option',
		activeId: 'account',
		align: 'bottom',
		disabled: false,
		options: SAMPLE_OPTIONS,
		showLabel: true,
		size: 'md',
	},
	render: (args) => {
		const [activeId, setActiveId] = useState(args.activeId);
		return (
			<CollapsibleListbox
				{...args}
				activeId={activeId}
				onSelect={(id) => {
					setActiveId(id);
					args.onSelect?.(id);
				}}
			/>
		);
	},
} satisfies Meta<typeof CollapsibleListbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const PrimaryVariant: Story = {
	args: { variant: 'primary' },
};

export const OutlineVariant: Story = {
	args: { variant: 'outline' },
};

export const GhostVariant: Story = {
	args: { variant: 'ghost' },
};

export const IconOnly: Story = {
	args: { 'aria-label': 'Quick Settings Menu', showLabel: false },
};

export const Small: Story = {
	args: { size: 'sm' },
};

export const Large: Story = {
	args: { size: 'lg' },
};

export const TopAligned: Story = {
	args: { align: 'top' },
};

export const Disabled: Story = {
	args: { disabled: true },
};

export const InsideTheme: Story = {
	decorators: [
		(Story) => (
			<Theme name="secondary">
				<div style={{ padding: '2rem', backgroundColor: 'var(--color-surface)' }}>
					<Story />
				</div>
			</Theme>
		),
	],
};
