import type { Meta, StoryObj } from '@storybook/react';
import { LanguageRedirectFallback } from './_LanguageRedirectFallback';

const meta: Meta<typeof LanguageRedirectFallback> = {
	title: 'System Pages/Language Redirect',
	component: LanguageRedirectFallback,
	parameters: {
		docs: {
			description: {
				component:
					'Full-page template rendered during language detection and redirection. Serves as an accessible fallback when JavaScript is disabled or delayed.',
			},
		},
		layout: 'fullscreen',
	},
	args: {
		title: 'Arcade',
		message: 'Redirecting to your preferred language...',
		languagesAriaLabel: 'Select language',
		languages: [
			{ code: 'en', flag: '🇺🇸', label: 'English', href: '/en/' },
			{ code: 'de', flag: '🇩🇪', label: 'Deutsch', href: '/de/' },
			{ code: 'fr', flag: '🇫🇷', label: 'Français', href: '/fr/' },
			{ code: 'pt', flag: '🇧🇷', label: 'Português', href: '/pt/' },
		],
	},
};

export default meta;
type Story = StoryObj<typeof LanguageRedirectFallback>;

export const Default: Story = {
	parameters: {
		docs: {
			description: {
				story: 'Default redirect fallback screen for the Arcade.',
			},
		},
	},
};
