import type { Meta, StoryObj } from '@storybook/react-vite';
import React from 'react';
import styled from '@emotion/styled';
import { PageContainer } from '.';
import { Theme } from '../Theme';
import { Text } from '../Text';
import { PAGE_MAX_WIDTH } from '../../styles/constants';

const meta = {
	component: PageContainer,
	parameters: {
		layout: 'fullscreen',
	},
	tags: ['autodocs'],
	title: 'Components/PageContainer',
	argTypes: {
		maxWidth: {
			control: 'text',
			description: 'Custom maximum width constraint (e.g. 60rem, 1200px)',
		},
		as: {
			control: 'text',
			description: 'The HTML tag or component to render',
		},
	},
	args: {
		maxWidth: PAGE_MAX_WIDTH,
		as: 'div',
	},
} satisfies Meta<typeof PageContainer>;

export default meta;
type Story = StoryObj<typeof meta>;

// Styled components to render a premium design showcasing the container boundaries
const OuterFrame = styled.div`
	background-color: var(--color-surface);
	min-height: 100vh;
	width: 100%;
	padding: 40px 0;
	box-sizing: border-box;
	font-family: 'Inter', system-ui, sans-serif;
`;

const DecorativeWrapper = styled.div`
	border: 2px dashed var(--color-accent);
	background-color: var(--color-container-1);
	border-radius: 12px;
	padding: 24px;
	display: flex;
	flex-direction: column;
	gap: 24px;
`;

const Header = styled.header`
	display: flex;
	justify-content: space-between;
	align-items: center;
	border-bottom: 1px solid var(--color-container-2);
	padding-bottom: 16px;
`;

const Grid = styled.div`
	display: grid;
	grid-template-columns: 1fr;
	gap: 20px;

	@media (min-width: 768px) {
		grid-template-columns: repeat(3, 1fr);
	}
`;

const Card = styled.div`
	background-color: var(--color-surface);
	border: 1px solid var(--color-container-2);
	border-radius: 8px;
	padding: 20px;
	display: flex;
	flex-direction: column;
	gap: 8px;
`;

export const Default: Story = {
	render: (args) => (
		<Theme name="primary">
			<OuterFrame>
				<PageContainer {...args}>
					<DecorativeWrapper>
						<Header>
							<Text variant="h3" as="h1">
								Absolutholz Shop
							</Text>
							<Text variant="small">
								Container Area (Bounded by Accent Border)
							</Text>
						</Header>
						<div>
							<Text variant="h2" as="h2">
								Responsive Layout Container
							</Text>
							<div style={{ marginTop: '8px' }}>
								<Text variant="base">
									Resize the screen to witness the responsive padding
									transitions. The padding uses the default spacing token 'xl'
									from the design system, which scales from mobile to desktop
									sizes automatically.
								</Text>
							</div>
						</div>
						<Grid>
							<Card>
								<Text variant="h3">Oak Table</Text>
								<Text variant="small">Solid local oak dining table.</Text>
							</Card>
							<Card>
								<Text variant="h3">Walnut Chair</Text>
								<Text variant="small">Ergonomic walnut dining chair.</Text>
							</Card>
							<Card>
								<Text variant="h3">Beech Shelf</Text>
								<Text variant="small">
									Modular wall-mounted beech shelving.
								</Text>
							</Card>
						</Grid>
					</DecorativeWrapper>
				</PageContainer>
			</OuterFrame>
		</Theme>
	),
};
