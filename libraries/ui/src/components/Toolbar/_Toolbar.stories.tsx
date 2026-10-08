import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../Button';
import { Divider } from '../Divider';
import { Icon } from '../Icon';
import { Switch } from '../Switch';
import { Text } from '../Text';
import { Theme } from '../Theme';
import { Toolbar } from './_Toolbar';
import { TOOLBAR_ALIGNS, TOOLBAR_ORIENTATIONS, TOOLBAR_SIZES, TOOLBAR_VARIANTS } from './_Toolbar.constants';

const meta = {
	component: Toolbar,
	parameters: {
		layout: 'centered',
		docs: {
			description: {
				component:
					'The Toolbar component provides an accessible grouping container for interactive controls adhering strictly to W3C WAI-ARIA Authoring Practices (APG), WCAG 2.2 Level AA, and BITV 2.0 specifications. Features roving tabindex keyboard navigation (ArrowLeft/ArrowRight for horizontal, ArrowUp/ArrowDown for vertical), Home/End jumping, wrap-around looping, and dynamic DOM mutation synchronization.',
			},
		},
	},
	tags: ['autodocs'],
	title: 'Components/Toolbar',
	argTypes: {
		orientation: {
			control: 'radio',
			options: TOOLBAR_ORIENTATIONS,
			description: 'Primary layout orientation dictating arrow navigation keys (horizontal vs vertical)',
		},
		variant: {
			control: 'select',
			options: TOOLBAR_VARIANTS,
			description: 'Visual surface styling preset',
		},
		size: {
			control: 'radio',
			options: TOOLBAR_SIZES,
			description: 'Sizing preset dictating padding and item gaps',
		},
		align: {
			control: 'select',
			options: TOOLBAR_ALIGNS,
			description: 'Alignment of items along the main axis',
		},
		loop: {
			control: 'boolean',
			description: 'Whether keyboard arrow navigation wraps around from start to end and vice versa',
		},
		fullWidth: {
			control: 'boolean',
			description: 'Expands the toolbar container across 100% of parent width',
		},
		'aria-label': {
			control: 'text',
			description: 'Accessible label describing toolbar functionality to screen readers',
		},
	},
	args: {
		'aria-label': 'Document Actions',
		align: 'start',
		fullWidth: false,
		loop: true,
		orientation: 'horizontal',
		size: 'md',
		variant: 'default',
	},
} satisfies Meta<typeof Toolbar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	parameters: {
		docs: {
			description: {
				story: 'Standard horizontal toolbar with interactive buttons navigating via roving tabindex and Left/Right arrow keys.',
			},
		},
	},
	render: (args) => (
		<Toolbar {...args}>
			<Button variant="ghost" size="sm" isIconOnly aria-label="Undo">
				<Icon name="undo" size="sm" />
			</Button>
			<Button variant="ghost" size="sm" isIconOnly aria-label="Redo">
				<Icon name="redo" size="sm" />
			</Button>
			<Button variant="ghost" size="sm" isIconOnly aria-label="Pencil tool">
				<Icon name="pencil" size="sm" />
			</Button>
			<Button variant="ghost" size="sm" isIconOnly aria-label="Eraser tool">
				<Icon name="eraser" size="sm" />
			</Button>
			<Button variant="ghost" size="sm" isIconOnly aria-label="Settings">
				<Icon name="settings" size="sm" />
			</Button>
		</Toolbar>
	),
};

export const Vertical: Story = {
	parameters: {
		docs: {
			description: {
				story: 'Vertical toolbar layout responding to Up/Down arrow keys per W3C APG specification.',
			},
		},
	},
	render: (args) => (
		<Toolbar {...args}>
			<Button variant="ghost" size="sm" isIconOnly aria-label="Pencil tool">
				<Icon name="pencil" size="sm" />
			</Button>
			<Button variant="ghost" size="sm" isIconOnly aria-label="Eraser tool">
				<Icon name="eraser" size="sm" />
			</Button>
			<Button variant="ghost" size="sm" isIconOnly aria-label="Settings">
				<Icon name="settings" size="sm" />
			</Button>
		</Toolbar>
	),
	args: {
		'aria-label': 'Drawing Tools',
		orientation: 'vertical',
	},
};

export const WithSeparators: Story = {
	parameters: {
		docs: {
			description: {
				story: 'Toolbar featuring semantic dividers separating functional action groups.',
			},
		},
	},
	render: (args) => (
		<Toolbar {...args}>
			{/* biome-ignore lint/a11y/useSemanticElements: W3C APG Toolbar pattern groups controls using role="group" */}
			<div role="group" aria-label="History">
				<Button variant="ghost" size="sm" isIconOnly aria-label="Undo">
					<Icon name="undo" size="sm" />
				</Button>
				<Button variant="ghost" size="sm" isIconOnly aria-label="Redo">
					<Icon name="redo" size="sm" />
				</Button>
			</div>
			<Divider />
			{/* biome-ignore lint/a11y/useSemanticElements: W3C APG Toolbar pattern groups controls using role="group" */}
			<div role="group" aria-label="Tools">
				<Button variant="ghost" size="sm" isIconOnly aria-label="Pencil">
					<Icon name="pencil" size="sm" />
				</Button>
				<Button variant="ghost" size="sm" isIconOnly aria-label="Eraser">
					<Icon name="eraser" size="sm" />
				</Button>
			</div>
			<Divider />
			<Button variant="ghost" size="sm" isIconOnly aria-label="Settings">
				<Icon name="settings" size="sm" />
			</Button>
		</Toolbar>
	),
	args: {
		'aria-label': 'Canvas controls',
	},
};

export const WithControls: Story = {
	parameters: {
		docs: {
			description: {
				story: 'Toolbar hosting composite interactive controls such as toggle switches alongside standard action buttons.',
			},
		},
	},
	render: (args) => (
		<Toolbar {...args}>
			<Button variant="secondary" size="sm">
				Pause
			</Button>
			<Button variant="ghost" size="sm" isIconOnly aria-label="Settings">
				<Icon name="settings" size="sm" />
			</Button>
			<Divider />
			<Switch size="sm" label="Grid" defaultChecked />
		</Toolbar>
	),
	args: {
		'aria-label': 'Game controls',
	},
};

export const Elevated: Story = {
	parameters: {
		docs: {
			description: {
				story: 'Elevated toolbar variant with container surface background and floating drop shadow.',
			},
		},
	},
	render: (args) => (
		<Toolbar {...args}>
			<Button variant="ghost" size="sm" isIconOnly aria-label="Pencil">
				<Icon name="pencil" size="sm" />
			</Button>
			<Button variant="ghost" size="sm" isIconOnly aria-label="Eraser">
				<Icon name="eraser" size="sm" />
			</Button>
			<Button variant="ghost" size="sm" isIconOnly aria-label="Settings">
				<Icon name="settings" size="sm" />
			</Button>
		</Toolbar>
	),
	args: {
		variant: 'elevated',
	},
};

export const Outline: Story = {
	parameters: {
		docs: {
			description: {
				story: 'Outline toolbar variant displaying crisp border with transparent background.',
			},
		},
	},
	render: (args) => (
		<Toolbar {...args}>
			<Button variant="ghost" size="sm" isIconOnly aria-label="Pencil">
				<Icon name="pencil" size="sm" />
			</Button>
			<Button variant="ghost" size="sm" isIconOnly aria-label="Eraser">
				<Icon name="eraser" size="sm" />
			</Button>
			<Button variant="ghost" size="sm" isIconOnly aria-label="Settings">
				<Icon name="settings" size="sm" />
			</Button>
		</Toolbar>
	),
	args: {
		variant: 'outline',
	},
};

export const Ghost: Story = {
	parameters: {
		docs: {
			description: {
				story: 'Ghost toolbar variant with no background or border, ideal for unembellished header placements.',
			},
		},
	},
	render: (args) => (
		<Toolbar {...args}>
			<Button variant="ghost" size="sm" isIconOnly aria-label="Undo">
				<Icon name="undo" size="sm" />
			</Button>
			<Button variant="ghost" size="sm" isIconOnly aria-label="Redo">
				<Icon name="redo" size="sm" />
			</Button>
			<Button variant="ghost" size="sm" isIconOnly aria-label="Settings">
				<Icon name="settings" size="sm" />
			</Button>
		</Toolbar>
	),
	args: {
		variant: 'ghost',
	},
};

export const DisabledItems: Story = {
	parameters: {
		docs: {
			description: {
				story: 'Demonstrates roving tabindex skipping disabled controls during arrow key navigation per W3C APG.',
			},
		},
	},
	render: (args) => (
		<Toolbar {...args}>
			<Button variant="ghost" size="sm" isIconOnly aria-label="Undo" disabled>
				<Icon name="undo" size="sm" />
			</Button>
			<Button variant="ghost" size="sm" isIconOnly aria-label="Redo" disabled>
				<Icon name="redo" size="sm" />
			</Button>
			<Button variant="ghost" size="sm" isIconOnly aria-label="Pencil tool">
				<Icon name="pencil" size="sm" />
			</Button>
			<Button variant="ghost" size="sm" isIconOnly aria-label="Eraser tool">
				<Icon name="eraser" size="sm" />
			</Button>
		</Toolbar>
	),
	args: {
		'aria-label': 'Canvas History',
	},
};

export const Themed: Story = {
	parameters: {
		docs: {
			description: {
				story: 'Toolbar rendered inside a themed container, inheriting themed container tokens.',
			},
		},
	},
	render: (args) => (
		<Theme name="secondary">
			<div
				style={{
					borderRadius: '0.75rem',
					display: 'flex',
					flexDirection: 'column',
					gap: '1rem',
					padding: '1.5rem',
				}}
			>
				<Text variant="h3" as="h3">
					Themed Toolbar
				</Text>
				<Toolbar {...args}>
					<Button variant="secondary" size="sm" isIconOnly aria-label="Undo">
						<Icon name="undo" size="sm" />
					</Button>
					<Button variant="secondary" size="sm" isIconOnly aria-label="Redo">
						<Icon name="redo" size="sm" />
					</Button>
					<Button variant="primary" size="sm" isIconOnly aria-label="Settings">
						<Icon name="settings" size="sm" />
					</Button>
				</Toolbar>
			</div>
		</Theme>
	),
	args: {
		'aria-label': 'Themed Actions',
		variant: 'elevated',
	},
};
