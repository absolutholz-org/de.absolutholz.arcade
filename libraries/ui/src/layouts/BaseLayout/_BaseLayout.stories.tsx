import type { Meta, StoryObj } from '@storybook/react-vite';
import { Badge } from '../../components/Badge';
import { BaseLayout } from './_BaseLayout';

const meta = {
	component: BaseLayout,
	parameters: {
		layout: 'fullscreen',
		docs: {
			description: {
				component:
					'Foundational Tier 1 document shell layout. Provides skip navigation link, theme surface, toast container, and consent banner with an open, unconstrained content slot.',
			},
		},
	},
	title: 'Layouts/Base Layout/BaseLayout',
} satisfies Meta<typeof BaseLayout>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		children: (
			<main
				id="main-content"
				style={{
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					minHeight: '80vh',
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
			</main>
		),
	},
};
