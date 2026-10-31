import { I18nProvider } from '@arcade/lib-i18n/provider/I18nProvider';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { SiteHeader } from '.';
import { Logo } from '../Logo';
import { Stack } from '../Stack';
import { Text } from '../Text';
import { Theme } from '../Theme';

const meta = {
	component: SiteHeader,
	parameters: {
		layout: 'fullscreen',
		docs: {
			description: {
				component:
					'The SiteHeader component provides a top-level banner landmark container with standard bordered or minimal variants, brand links, and action switchers.',
			},
		},
	},
	tags: ['autodocs'],
	title: 'Layouts/Base Layout/SiteHeader',
	argTypes: {
		variant: {
			control: 'select',
			options: ['standard', 'minimal'],
			description: 'Layout variant of the site header.',
		},
		children: {
			control: false,
			description: 'Child elements rendered inside the header container.',
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
							minHeight: '12rem',
							width: '100%',
						}}
					>
						<Story />
					</div>
				</Theme>
			</I18nProvider>
		),
	],
} satisfies Meta<typeof SiteHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	parameters: {
		docs: {
			description: {
				story: 'Default site header self-resolving the portal brand logo, title, and link.',
			},
		},
	},
};

export const WithoutBorder: Story = {
	args: {
		variant: 'standard',
		hasBorder: false,
	},
	parameters: {
		docs: {
			description: {
				story: 'Standard site header without a dividing bottom border, blending into hero sections.',
			},
		},
	},
};

export const Minimal: Story = {
	args: {
		variant: 'minimal',
	},
	parameters: {
		docs: {
			description: {
				story: 'Minimal site header variant without a bottom border or logo, aligning default actions to the upper right.',
			},
		},
	},
};

export const WithCustomChildren: Story = {
	args: {
		hideBrand: true,
		children: (
			<Stack direction="row" align="center" spacing="sm" inline fullWidth={false}>
				<Logo size="sm" />
				<Text variant="h3" as="span">
					Arcade Custom
				</Text>
			</Stack>
		),
	},
	parameters: {
		docs: {
			description: {
				story: 'Site header rendered with custom child elements placed directly into the container alongside default actions.',
			},
		},
	},
};
