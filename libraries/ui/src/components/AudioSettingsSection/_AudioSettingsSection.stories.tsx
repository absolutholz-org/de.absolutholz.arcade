import type { Meta, StoryObj } from '@storybook/react-vite';
import { AudioSettingsSection } from '.';

const meta = {
	component: AudioSettingsSection,
	parameters: {
		layout: 'centered',
		docs: {
			description: {
				component:
					'The AudioSettingsSection component provides accessible toggle controls for Sound Effects and Haptic Feedback. Built on native switch controls adhering to WCAG 2.2 AA and BITV 2.0 specifications, it immediately synchronizes user preferences with @arcade/lib-storage and @arcade/lib-audio.',
			},
		},
	},
	tags: ['autodocs'],
	title: 'Components/AudioSettingsSection',
} satisfies Meta<typeof AudioSettingsSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: (args) => (
		<div
			style={{
				width: '100%',
				maxWidth: '32rem',
				padding: '1.5rem',
				background: 'var(--color-container-1)',
				borderRadius: 'var(--radius-md)',
			}}
		>
			<AudioSettingsSection {...args} />
		</div>
	),
};
