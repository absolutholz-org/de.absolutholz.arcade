import type { Meta, StoryObj } from '@storybook/react-vite';
import { SiteFooter } from '.';
import packageJson from '../../../package.json';
import { Theme } from '../Theme';

const meta = {
	component: SiteFooter,
	parameters: {
		layout: 'fullscreen',
		docs: {
			description: {
				component:
					'The SiteFooter component provides a structured, responsive multi-column landmark footer across the arcade. It organizes brand identity, game catalog navigation, arcade profile/settings, platform resources, and legal compliance across desktop and mobile viewports.',
			},
		},
	},
	tags: ['autodocs'],
	title: 'Layouts/Base Layout/SiteFooter',
	argTypes: {
		ariaLabel: {
			control: 'text',
			description: 'Accessible name for the entire footer landmark.',
		},
		catalogAriaLabel: {
			control: 'text',
			description: 'Accessible name for the catalog navigation column.',
		},
		arcadeAriaLabel: {
			control: 'text',
			description: 'Accessible name for the arcade navigation column.',
		},
		aboutAriaLabel: {
			control: 'text',
			description: 'Accessible name for the about/platform navigation column.',
		},
		legalAriaLabel: {
			control: 'text',
			description: 'Accessible name for the sub-footer legal navigation bar.',
		},
		copyrightAriaLabel: {
			control: 'text',
			description: 'Accessible name for the copyright notice span.',
		},
		version: {
			control: 'text',
			description: 'Application or game version string.',
		},
	},
	args: {
		ariaLabel: 'Site Footer',
		copyright: {
			currentYear: 2026,
			owner: 'absolutholz',
			startYear: 2024,
		},
		copyrightAriaLabel: 'Copyright notice',
		legalAriaLabel: 'Legal',
		version: packageJson.version,
	},
	decorators: [
		(Story) => (
			<Theme name="primary">
				<div
					style={{
						backgroundColor: 'var(--color-surface)',
						color: 'var(--color-text-1)',
						display: 'flex',
						flexDirection: 'column',
						justifyContent: 'flex-end',
						minHeight: '20rem',
						width: '100%',
					}}
				>
					<Story />
				</div>
			</Theme>
		),
	],
} satisfies Meta<typeof SiteFooter>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	parameters: {
		docs: {
			description: {
				story: 'Default site footer rendering Tier 1 (4-column grid: Brand & Actions, Catalog, Arcade, About) and Tier 2 (Sub-footer legal & utility bar).',
			},
		},
	},
};
