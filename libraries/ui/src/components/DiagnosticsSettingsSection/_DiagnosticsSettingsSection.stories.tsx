import type { Meta, StoryObj } from '@storybook/react-vite';
import { DiagnosticsSettingsSection } from '.';

const meta = {
	component: DiagnosticsSettingsSection,
	parameters: {
		layout: 'centered',
		docs: {
			description: {
				component:
					'Lets players download or clear the local-only diagnostic logs kept by @arcade/lib-logger. Logs never leave the device; they are only exported as a JSON file on request. Shown on the arcade settings page.',
			},
		},
	},
	tags: ['autodocs'],
	title: 'Components/Actions & Inputs/DiagnosticsSettingsSection',
} satisfies Meta<typeof DiagnosticsSettingsSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	parameters: {
		docs: {
			description: {
				story: 'Time range defaults to "All logs (up to 7 days)". Clearing asks for inline confirmation first.',
			},
		},
	},
};
