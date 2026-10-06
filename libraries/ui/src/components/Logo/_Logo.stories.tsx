import type { Meta, StoryObj } from '@storybook/react-vite';
import { Logo } from '.';
import { Theme } from '../Theme';
import { LOGO_SIZES } from './_Logo.constants';

const meta = {
	component: Logo,
	parameters: {
		layout: 'centered',
		docs: {
			description: {
				component:
					'The Logo component features an arcade controller vector foreground layered over an authentic natural wood-grain background, celebrating Absolut Holz Arcade.',
			},
		},
	},
	tags: ['autodocs'],
	title: 'Components/Logo',
	argTypes: {
		size: {
			control: 'select',
			options: Object.keys(LOGO_SIZES),
			description: 'Preset sizing scale for the logo',
		},
		label: {
			control: 'text',
			description: 'Accessible screen reader label (sets role="img")',
		},
		as: {
			control: 'text',
			description: 'HTML element to render as the wrapper',
		},
	},
	args: {
		size: 'md',
		label: 'Absolut Holz Arcade',
	},
} satisfies Meta<typeof Logo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	parameters: {
		docs: {
			description: {
				story: 'Default medium logo rendering the arcade controller over the wood grain background.',
			},
		},
	},
	render: (args) => (
		<Theme name="primary">
			<Logo {...args} />
		</Theme>
	),
};

export const Small: Story = {
	args: {
		size: 'sm',
	},
	parameters: {
		docs: {
			description: {
				story: 'Small variant suitable for compact navigation bars and headers.',
			},
		},
	},
	render: (args) => (
		<Theme name="primary">
			<Logo {...args} />
		</Theme>
	),
};

export const Large: Story = {
	args: {
		size: 'lg',
	},
	parameters: {
		docs: {
			description: {
				story: 'Large variant showcasing the fine wood-grain texture and gamepad details.',
			},
		},
	},
	render: (args) => (
		<Theme name="primary">
			<Logo {...args} />
		</Theme>
	),
};

export const ExtraLarge: Story = {
	args: {
		size: 'xl',
	},
	parameters: {
		docs: {
			description: {
				story: 'Extra-large variant suitable for hero banners or splash screens.',
			},
		},
	},
	render: (args) => (
		<Theme name="primary">
			<Logo {...args} />
		</Theme>
	),
};

export const Decorative: Story = {
	args: {
		label: undefined,
	},
	parameters: {
		docs: {
			description: {
				story: 'Decorative logo hidden from screen readers via aria-hidden when accompanied by visible text.',
			},
		},
	},
	render: (args) => (
		<Theme name="primary">
			<Logo {...args} />
		</Theme>
	),
};
