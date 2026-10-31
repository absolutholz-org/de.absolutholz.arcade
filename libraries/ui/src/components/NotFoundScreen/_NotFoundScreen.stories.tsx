import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '../Button';
import { NotFoundScreen } from './_NotFoundScreen';

const meta: Meta<typeof NotFoundScreen> = {
	title: 'System Pages/404 Not Found',
	component: NotFoundScreen,
	parameters: {
		layout: 'fullscreen',
	},
	args: {
		title: 'Page Not Found',
		message: "The page or puzzle you're looking for doesn't exist or has moved.",
		homeHref: '/',
		homeLabel: 'Back to Arcade',
	},
};

export default meta;
type Story = StoryObj<typeof NotFoundScreen>;

export const Default: Story = {};

export const WithSecondaryAction: Story = {
	args: {
		action: (
			<Button as="a" href="/sudoku/en/" variant="outline" size="md">
				Play Sudoku
			</Button>
		),
	},
};
