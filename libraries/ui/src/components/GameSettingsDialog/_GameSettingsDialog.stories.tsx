import type { Meta, StoryObj } from '@storybook/react-vite';
import { Switch } from '../Switch';
import { GameSettingsDialog } from './_GameSettingsDialog';

const meta: Meta<typeof GameSettingsDialog> = {
	title: 'Layouts/Game Layout/GameSettingsDialog',
	component: GameSettingsDialog,
	parameters: {
		layout: 'centered',
	},
	argTypes: {
		onClose: { action: 'closed' },
		onLanguageChange: { action: 'languageChanged' },
	},
};

export default meta;
type Story = StoryObj<typeof GameSettingsDialog>;

export const Default: Story = {
	args: {
		isOpen: true,
		gameTitle: 'Sudoku',
		children: (
			<div
				style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0' }}
			>
				<span>Highlight Peer Cells</span>
				<Switch defaultChecked aria-label="Highlight Peer Cells" />
			</div>
		),
	},
	parameters: {
		docs: {
			description: {
				story: 'Standard game settings dialog rendering both gameplay options and arcade settings.',
			},
		},
	},
};

export const WithoutGameSettings: Story = {
	args: {
		isOpen: true,
		gameTitle: 'Anagram Scramble',
	},
	parameters: {
		docs: {
			description: {
				story: 'Game settings dialog for games with zero in-game toggles, rendering only the arcade settings.',
			},
		},
	},
};

export const WithoutGameTitle: Story = {
	args: {
		isOpen: true,
	},
	parameters: {
		docs: {
			description: {
				story: 'Generic settings dialog without game subtitle.',
			},
		},
	},
};
