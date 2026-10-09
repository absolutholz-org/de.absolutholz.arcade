import type { Meta, StoryObj } from '@storybook/react-vite';
import { Hero } from '.';
import { Button } from '../Button';
import { Logo } from '../Logo';
import { Theme } from '../Theme';
import { HERO_ALIGN_OPTIONS, HERO_HEADING_LEVELS } from './_Hero.constants';

const meta = {
	component: Hero,
	parameters: {
		layout: 'padded',
		docs: {
			description: {
				component:
					'The Hero component provides a high-impact intro section with an optional visual graphic/logo, prominent heading, tagline, and action items. Supports left-aligned side-by-side or centered stacked layouts.',
			},
		},
	},
	tags: ['autodocs'],
	title: 'Components/Hero',
	argTypes: {
		align: {
			control: 'inline-radio',
			options: HERO_ALIGN_OPTIONS,
			description: 'Visual alignment and orientation layout of the hero content.',
		},
		headingLevel: {
			control: 'select',
			options: HERO_HEADING_LEVELS,
			description: 'Semantic HTML heading tag for the hero title.',
		},
		as: {
			control: 'text',
			description: 'The HTML element or custom component to render as the root container.',
		},
		title: {
			control: 'text',
			description: 'Primary title text or element.',
		},
		tagline: {
			control: 'text',
			description: 'Secondary tagline or supporting description text.',
		},
	},
	args: {
		align: 'left',
		as: 'header',
		headingLevel: 'h1',
		logo: <Logo size="xl" />,
		tagline: 'Classic games built with accessibility in mind.',
		title: 'Arcade',
	},
	decorators: [
		(Story) => (
			<Theme name="primary">
				<div style={{ padding: '2rem', maxWidth: '48rem', margin: '0 auto' }}>
					<Story />
				</div>
			</Theme>
		),
	],
} satisfies Meta<typeof Hero>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	parameters: {
		docs: {
			description: {
				story: 'Default left-aligned hero with extra-large logo, bold title, and tagline side-by-side.',
			},
		},
	},
};

export const Centered: Story = {
	args: {
		align: 'center',
	},
	parameters: {
		docs: {
			description: {
				story: 'Centered hero layout with stacked logo, title, and tagline.',
			},
		},
	},
};

export const TextOnly: Story = {
	args: {
		logo: undefined,
	},
	parameters: {
		docs: {
			description: {
				story: 'Text-only hero without a logo or graphic visual.',
			},
		},
	},
};

export const WithActions: Story = {
	args: {
		children: (
			<>
				<Button variant="primary" size="md">
					Play Now
				</Button>
				<Button variant="outline" size="md">
					High Scores
				</Button>
			</>
		),
	},
	parameters: {
		docs: {
			description: {
				story: 'Hero section with call-to-action buttons provided via children.',
			},
		},
	},
};
