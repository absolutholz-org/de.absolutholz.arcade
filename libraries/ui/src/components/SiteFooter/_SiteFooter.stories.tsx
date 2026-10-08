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
					'The SiteFooter component provides a responsive landmark footer with three layout clusters: legal navigation, identity / copyright notice, and project resource links. On desktop viewports, items are distributed evenly; on mobile screens, sections stack with subtle border dividers.',
			},
		},
	},
	tags: ['autodocs'],
	title: 'Components/SiteFooter',
	argTypes: {
		as: {
			control: 'text',
			description: 'The HTML element or custom component to render as the root container.',
		},
		legalAriaLabel: {
			control: 'text',
			description: 'Accessible name for the legal navigation section.',
		},
		copyrightAriaLabel: {
			control: 'text',
			description: 'Accessible name for the copyright notice span.',
		},
		resourcesAriaLabel: {
			control: 'text',
			description: 'Accessible name for the resources navigation section.',
		},
		version: {
			control: 'text',
			description: 'Application or game version string.',
		},
	},
	args: {
		as: 'footer',
		copyright: {
			currentYear: 2026,
			owner: 'absolutholz',
			startYear: 2024,
		},
		copyrightAriaLabel: 'Copyright notice',
		legalAriaLabel: 'Legal',
		legalLinks: [
			{ href: '/privacy', label: 'Privacy' },
			{ href: '/accessibility', label: 'Accessibility' },
			{ href: '/imprint', label: 'Imprint' },
		],
		resourceLinks: [
			{
				external: true,
				href: 'https://github.com/absolutholz-org/de.absolutholz.arcade',
				label: 'GitHub',
			},
			{
				external: true,
				href: '/storybook',
				label: 'Storybook',
			},
		],
		resourcesAriaLabel: 'Project resources',
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
						minHeight: '16rem',
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
				story: 'Default site footer rendering all three clusters: legal navigation on the left, centered copyright and version, and external resource links on the right.',
			},
		},
	},
};
