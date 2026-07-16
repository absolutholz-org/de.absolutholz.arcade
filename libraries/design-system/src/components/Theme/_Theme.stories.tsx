import styled from '@emotion/styled';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Theme } from '.';
import { Button } from '../Button';
import { themeColor } from '../../styles/theme/theme.utils';
import { THEME_NAMES } from './_Theme.constants';

const meta = {
	component: Theme,
	parameters: {
		layout: 'centered',
		docs: {
			description: {
				component:
					"The Theme component is a layout context wrapper that maps generic CSS Custom Properties (e.g., `--color-surface`, `--color-text-1`) to concrete, brand-specific themeset variables (e.g., `var(--theme-secondary-surface)`).\n\nFor details on the system's two-tier branding strategy, see the [Theme Architecture documentation](?path=/docs/foundations-theme-logic-architecture--docs).",
			},
		},
	},
	tags: ['autodocs'],
	title: 'Components/Theme',
	argTypes: {
		name: {
			control: 'select',
			options: THEME_NAMES,
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
	background-color: ${themeColor('surface')};
	color: ${themeColor('text-1')};
	border: 1px solid ${themeColor('container-2')};
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
		border-color: ${themeColor('accent')};
	}
`;

const CardTitle = styled.h3`
	margin: 0;
	color: ${themeColor('text-1')};
	font-family: 'Outfit', 'Inter', sans-serif;
	font-size: 1.25rem;
	font-weight: 600;
`;

const CardDescription = styled.p`
	margin: 0;
	color: ${themeColor('text-2')};
	font-family: 'Inter', sans-serif;
	font-size: 0.9rem;
	line-height: 1.5;
`;

const CardMeta = styled.span`
	color: ${themeColor('text-3')};
	font-family: 'Inter', sans-serif;
	font-size: 0.75rem;
	text-transform: uppercase;
	letter-spacing: 0.05em;
`;

const ExploreButton = styled(Button)`
	margin-top: auto;
`;

const DemoCard = ({ themeName }: { themeName: string }) => (
	<StyledCard>
		<CardMeta>{themeName} theme</CardMeta>
		<CardTitle>Premium Woodcrafts</CardTitle>
		<CardDescription>
			Handcrafted with precision using sustainable local oak and walnut. Every
			piece tells a unique story.
		</CardDescription>
		<ExploreButton>Explore Collection</ExploreButton>
	</StyledCard>
);

export const Default: Story = {
	render: (args) => (
		<Theme {...args}>
			<DemoCard themeName={args.name} />
		</Theme>
	),
};
