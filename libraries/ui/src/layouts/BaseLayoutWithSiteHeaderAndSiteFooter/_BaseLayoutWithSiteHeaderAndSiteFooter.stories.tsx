import type { Meta, StoryObj } from '@storybook/react-vite';
import { Badge } from '../../components/Badge';
import { BaseLayoutWithSiteHeaderAndSiteFooter } from './_BaseLayoutWithSiteHeaderAndSiteFooter';

const meta = {
	component: BaseLayoutWithSiteHeaderAndSiteFooter,
	parameters: {
		layout: 'fullscreen',
		docs: {
			description: {
				component:
					'Foundational Tier 1 layout extending BaseLayoutWithSiteFooter with SiteHeader, an unconstrained main content slot, and SiteFooter anchored to the bottom.',
			},
		},
	},
	tags: ['autodocs'],
	title: 'Layouts/Base Layout/BaseLayoutWithSiteHeaderAndSiteFooter',
} satisfies Meta<typeof BaseLayoutWithSiteHeaderAndSiteFooter>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		children: (
			<div
				style={{
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					minHeight: '60vh',
					padding: '2rem',
					margin: '1.5rem',
					backgroundColor: 'var(--color-container-1)',
					border: '1px dashed var(--color-container-2)',
					borderRadius: '0.5rem',
				}}
			>
				<Badge variant="neutral" size="md">
					Main Content Area (Unconstrained Slot)
				</Badge>
			</div>
		),
	},
};
