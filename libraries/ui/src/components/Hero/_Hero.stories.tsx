import type { Meta, StoryObj } from '@storybook/react-vite';
import { Hero } from '.';
import { Logo } from '../Logo';
import { PageContainer } from '../PageContainer';
import { Theme } from '../Theme';
import { HERO_HEADING_LEVELS } from './_Hero.constants';

const meta = {
	component: Hero,
	parameters: {
		layout: 'padded',
		docs: {
			description: {
				component:
					'The Hero component provides a high-impact intro section with an optional visual graphic/logo, prominent heading, and tagline.',
			},
		},
	},
	tags: ['autodocs'],
	title: 'Components/Hero',
	argTypes: {
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
		as: 'header',
		headingLevel: 'h1',
		logo: <Logo size="xl" />,
		tagline: 'Classic games built with accessibility in mind.',
		title: 'Arcade',
	},
	decorators: [
		(Story) => (
			<Theme name="primary">
				<PageContainer variant="wide">
					<Story />
				</PageContainer>
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
				story: 'Default hero with extra-large logo, bold title, and tagline side-by-side.',
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
