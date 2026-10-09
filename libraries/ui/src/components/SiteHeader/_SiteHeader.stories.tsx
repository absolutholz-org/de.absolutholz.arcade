import { I18nProvider } from '@arcade/lib-i18n/provider/I18nProvider';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { SiteHeader } from '.';
import { LanguageSwitcher } from '../LanguageSwitcher';
import { Logo } from '../Logo';
import { SchemeSwitcher } from '../SchemeSwitcher';
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
	title: 'Components/SiteHeader',
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
				story: 'Default site header rendering an empty banner landmark container.',
			},
		},
	},
};

export const StandardWithBranding: Story = {
	args: {
		variant: 'standard',
		brandLogo: <Logo size="sm" />,
		brandTitle: 'Arcade',
		brandHref: '#',
		actions: (
			<Stack direction="row" align="center" spacing="xs" inline fullWidth={false}>
				<LanguageSwitcher />
				<SchemeSwitcher />
			</Stack>
		),
	},
	parameters: {
		docs: {
			description: {
				story: 'Standard site header configured with structured brand logo, title, and actions props.',
			},
		},
	},
};

export const Minimal: Story = {
	args: {
		variant: 'minimal',
		actions: (
			<Stack direction="row" align="center" spacing="xs" inline fullWidth={false}>
				<LanguageSwitcher />
				<SchemeSwitcher />
			</Stack>
		),
	},
	parameters: {
		docs: {
			description: {
				story: 'Minimal site header variant without a bottom border or logo, aligning actions to the upper right.',
			},
		},
	},
};

export const WithCustomChildren: Story = {
	args: {
		children: (
			<>
				<Stack direction="row" align="center" spacing="sm" inline fullWidth={false}>
					<Logo size="sm" />
					<Text variant="h3" as="span">
						Arcade
					</Text>
				</Stack>
				<Stack direction="row" align="center" spacing="xs" inline fullWidth={false}>
					<LanguageSwitcher />
					<SchemeSwitcher />
				</Stack>
			</>
		),
	},
	parameters: {
		docs: {
			description: {
				story: 'Site header rendered with custom child elements placed directly into the container.',
			},
		},
	},
};
