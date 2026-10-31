import type { Meta, StoryObj } from '@storybook/react-vite';
import { GameLandingTemplate } from '.';
import { Icon } from '../../components/Icon';
import { GAME_LANDING_CONTENT_WIDTHS } from './_GameLandingTemplate.constants';

const meta = {
	component: GameLandingTemplate,
	parameters: {
		layout: 'fullscreen',
		docs: {
			description: {
				component:
					'The GameLandingTemplate standardizes landing and lobby screens across games. It orchestrates Zone 1 (Header/Intro with Hero and optional Resume banner), Zone 2 (Main Area for selection/grid controls), and Zone 3 (Game Page Footer with game-specific subpage links).',
			},
		},
	},
	tags: ['autodocs'],
	title: 'Templates/Game Landing Template/GameLandingTemplate',
	argTypes: {
		contentWidth: {
			control: 'inline-radio',
			options: GAME_LANDING_CONTENT_WIDTHS,
			description: 'Width variant constraint applied to the Zone 2 main content area.',
		},
		title: {
			control: 'text',
			description: 'Primary title text displayed in the Hero.',
		},
		description: {
			control: 'text',
			description: 'Description tagline displayed in the Hero.',
		},
	},
	args: {
		title: 'Sudoku',
		description: 'Exercise your mind with classic number placement logic puzzles.',
		contentWidth: 'default',
		children: (
			<div
				style={{
					background: 'rgba(255, 255, 255, 0.05)',
					border: '1px dashed rgba(128, 128, 128, 0.4)',
					borderRadius: '0.5rem',
					padding: '2rem',
					textAlign: 'center',
				}}
			>
				Main Selection / Grid Zone (Zone 2)
			</div>
		),
		pageFooterLinks: [
			{ label: 'Rules & Guide', href: '#rules' },
			{ label: 'Statistics', href: '#stats' },
		],
	},
} satisfies Meta<typeof GameLandingTemplate>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	parameters: {
		docs: {
			description: {
				story: 'Default landing layout with left-aligned Hero, standard width content, and footer links.',
			},
		},
	},
};

export const WithResumeState: Story = {
	parameters: {
		docs: {
			description: {
				story: 'Landing layout rendering an active game resume banner in the header zone.',
			},
		},
	},
	args: {
		resumeState: {
			message: 'Medium • Elapsed: 04:32',
			buttonLabel: 'Resume Puzzle',
			onResume: () => alert('Resume clicked'),
		},
	},
};

export const WithHeroIcon: Story = {
	parameters: {
		docs: {
			description: {
				story: 'Landing layout rendering an icon graphic in the Hero.',
			},
		},
	},
	args: {
		heroIcon: <Icon name="grid" size="lg" />,
	},
};

export const WideContent: Story = {
	parameters: {
		docs: {
			description: {
				story: 'Landing layout with wide content container for games requiring broader selection matrices.',
			},
		},
	},
	args: {
		contentWidth: 'wide',
	},
};
