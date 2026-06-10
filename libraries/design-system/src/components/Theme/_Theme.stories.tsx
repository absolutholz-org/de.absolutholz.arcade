import styled from '@emotion/styled';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Theme } from '.';

const meta = {
	component: Theme,
	parameters: {
		layout: 'centered',
	},
	tags: ['autodocs'],
	title: 'Components/Theme',
	argTypes: {
		name: {
			control: 'select',
			options: ['primary', 'secondary', 'contrast', 'accent'],
			description:
				'The name of the theme to apply (e.g., primary, secondary, contrast, accent)',
		},
		as: {
			control: 'text',
			description:
				'The HTML element or custom component to render as the wrapping element',
		},
	},
	args: {
		name: 'secondary',
		as: 'div',
	},
} satisfies Meta<typeof Theme>;

export default meta;
type Story = StoryObj<typeof meta>;

// Styled elements using the Generic Theme Custom Properties
const StyledCard = styled.div`
	background-color: var(--color-surface);
	color: var(--color-text-1);
	border: 1px solid var(--color-container-2);
	border-radius: 16px;
	padding: 24px;
	box-shadow: 0 8px 24px rgba(0, 0, 0, 0.04);
	transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
	width: 320px;
	display: flex;
	flex-direction: column;
	gap: 12px;

	&:hover {
		transform: translateY(-6px);
		box-shadow: 0 12px 32px rgba(0, 0, 0, 0.08);
		border-color: var(--color-accent);
	}
`;

const CardTitle = styled.h3`
	margin: 0;
	color: var(--color-text-1);
	font-family: 'Outfit', 'Inter', sans-serif;
	font-size: 1.25rem;
	font-weight: 600;
`;

const CardDescription = styled.p`
	margin: 0;
	color: var(--color-text-2);
	font-family: 'Inter', sans-serif;
	font-size: 0.9rem;
	line-height: 1.5;
`;

const CardMeta = styled.span`
	color: var(--color-text-3);
	font-family: 'Inter', sans-serif;
	font-size: 0.75rem;
	text-transform: uppercase;
	letter-spacing: 0.05em;
`;

const AccentButton = styled.button`
	background-color: var(--color-accent);
	color: var(--color-surface);
	border: none;
	border-radius: 8px;
	padding: 10px 18px;
	font-family: 'Inter', sans-serif;
	font-size: 0.85rem;
	font-weight: 600;
	cursor: pointer;
	transition:
		opacity 0.2s ease,
		transform 0.1s ease;
	margin-top: auto;

	&:hover {
		opacity: 0.9;
	}
	&:active {
		transform: scale(0.97);
	}
`;

const DemoCard = ({ themeName }: { themeName: string }) => (
	<StyledCard>
		<CardMeta>{themeName} theme</CardMeta>
		<CardTitle>Premium Woodcrafts</CardTitle>
		<CardDescription>
			Handcrafted with precision using sustainable local oak and walnut. Every
			piece tells a unique story.
		</CardDescription>
		<AccentButton>Explore Collection</AccentButton>
	</StyledCard>
);

export const Default: Story = {
	render: (args) => (
		<Theme {...args}>
			<DemoCard themeName={args.name} />
		</Theme>
	),
};
