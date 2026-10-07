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
					'The SiteHeader component provides a top-level banner landmark container with consistent bottom border and responsive layout padding.',
			},
		},
	},
	tags: ['autodocs'],
	title: 'Components/SiteHeader',
	argTypes: {
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

export const WithContent: Story = {
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
				story: 'Site header rendered with branding and interactive navigation controls including language and color scheme switchers.',
			},
		},
	},
};

export const WithBranding: Story = {
	args: {
		children: (
			<Stack direction="row" align="center" spacing="sm" inline fullWidth={false}>
				<Logo size="sm" />
				<Text variant="h3" as="span">
					Arcade
				</Text>
			</Stack>
		),
	},
	parameters: {
		docs: {
			description: {
				story: 'Site header rendered with branding logo and text title only.',
			},
		},
	},
};

export const WithSwitchers: Story = {
	args: {
		children: (
			<>
				<div />
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
				story: 'Site header rendered with language and color scheme switchers aligned to the end.',
			},
		},
	},
};
