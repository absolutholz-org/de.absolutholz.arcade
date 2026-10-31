import { I18nProvider } from '@arcade/lib-i18n/provider/I18nProvider';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Breadcrumb } from '.';
import { Theme } from '../Theme';

const meta = {
	component: Breadcrumb,
	parameters: {
		layout: 'padded',
		docs: {
			description: {
				component:
					'The Breadcrumb component provides secondary hierarchical navigation adhering strictly to W3C WAI-ARIA Authoring Practices Guide (APG) specifications. It features the authentic Arcade controller logo mark as the root home link, standard forward-slash separators, and accessible screen reader labeling.',
			},
		},
	},
	tags: ['autodocs'],
	title: 'Components/Breadcrumb',
	argTypes: {
		homeHref: {
			control: 'text',
			description: 'URL target for the automatically prepended Arcade home link.',
		},
		homeLabel: {
			control: 'text',
			description: 'Accessible name override for the Arcade home link.',
		},
		items: {
			control: 'object',
			description: 'Ordered sequence of breadcrumb trail items.',
		},
	},
	decorators: [
		(Story) => (
			<I18nProvider>
				<Theme name="primary">
					<div
						style={{
							backgroundColor: 'var(--color-surface)',
							color: 'var(--color-text-1)',
							padding: '1.5rem',
							width: '100%',
						}}
					>
						<Story />
					</div>
				</Theme>
			</I18nProvider>
		),
	],
} satisfies Meta<typeof Breadcrumb>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		homeHref: '/',
		items: [{ href: '/games', label: 'Games' }, { label: 'Sudoku' }],
	},
	parameters: {
		docs: {
			description: {
				story: 'Standard breadcrumb trail with the Arcade logo home link, intermediary parent link, and terminal non-clickable current page indicator.',
			},
		},
	},
};

export const DeepTrail: Story = {
	args: {
		homeHref: '/',
		items: [
			{ href: '/games', label: 'Games' },
			{ href: '/games/sudoku', label: 'Sudoku' },
			{ href: '/games/sudoku/medium', label: 'Medium' },
			{ label: 'Puzzle #42' },
		],
	},
	parameters: {
		docs: {
			description: {
				story: 'Deep four-level hierarchical navigation trail demonstrating multi-step nesting and responsive wrapping.',
			},
		},
	},
};
