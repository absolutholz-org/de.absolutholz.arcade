import type { ReactNode } from 'react';
import type { GAME_LANDING_CONTENT_WIDTHS } from './_GameLandingTemplate.constants';

export type GameLandingContentWidth = (typeof GAME_LANDING_CONTENT_WIDTHS)[number];

export interface ResumeStateConfig {
	message: ReactNode;
	onResume: () => void;
	buttonLabel?: string;
}

export interface PageFooterLink {
	label: string;
	href?: string;
	onClick?: () => void;
}

export interface GameLandingTemplateProps {
	title: string;
	description: string;
	heroIcon?: ReactNode;
	resumeState?: ResumeStateConfig;
	contentWidth?: GameLandingContentWidth;
	pageFooterLinks?: PageFooterLink[];
	children: ReactNode;
}
