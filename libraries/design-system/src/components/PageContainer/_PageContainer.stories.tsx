import type { Meta, StoryObj } from '@storybook/react-vite';
import React from 'react';
import styled from '@emotion/styled';
import { PageContainer } from '.';
import { Theme } from '../Theme';
import { Text } from '../Text';

const meta = {
	component: PageContainer,
	parameters: {
		layout: 'fullscreen',
	},
	tags: ['autodocs'],
	title: 'Components/PageContainer',
	argTypes: {
		variant: {
			control: 'select',
			options: ['standard', 'wide', 'full'],
			description: 'The layout width variant constraint',
		},
		as: {
			control: 'text',
			description: 'The HTML tag or component to render',
		},
	},
	args: {
		variant: 'standard',
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
	parameters: {
		docs: {
			description: {
				story:
					'The default standard layout variant restricts the maximum content width to 80rem (1280px), preserving readability for standard articles and shop pages.',
			},
		},
	},
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

export const Wide: Story = {
	args: {
		variant: 'wide',
	},
	parameters: {
		docs: {
			description: {
				story:
					'The wide variant extends the maximum width limit to 96rem (1536px), suitable for media-rich or dashboard-style pages.',
			},
		},
	},
	render: (args) => (
		<Theme name="primary">
			<OuterFrame>
				<PageContainer {...args}>
					<DecorativeWrapper>
						<Header>
							<Text variant="h3" as="h1">
								Absolutholz Shop (Wide View)
							</Text>
							<Text variant="small">
								Container Area (Bounded by Accent Border)
							</Text>
						</Header>
						<div>
							<Text variant="h2" as="h2">
								Wider Layout Container
							</Text>
							<div style={{ marginTop: '8px' }}>
								<Text variant="base">
									This variant provides a spacious layout with a 96rem max-width
									constraint, offering extra room for complex grid layouts or
									dense content.
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

export const FullWidth: Story = {
	args: {
		variant: 'full',
	},
	parameters: {
		docs: {
			description: {
				story:
					'The full width variant expands the container to 100% of the screen width (retaining standard inline padding), ideal for hero sections or immersive layouts.',
			},
		},
	},
	render: (args) => (
		<Theme name="primary">
			<OuterFrame>
				<PageContainer {...args}>
					<DecorativeWrapper>
						<Header>
							<Text variant="h3" as="h1">
								Absolutholz Shop (Full Screen)
							</Text>
							<Text variant="small">
								Container Area (Bounded by Accent Border)
							</Text>
						</Header>
						<div>
							<Text variant="h2" as="h2">
								Full Width Layout Container
							</Text>
							<div style={{ marginTop: '8px' }}>
								<Text variant="base">
									This variant removes max-width limits entirely to stretch
									across the entire viewport width, while keeping the responsive
									lateral padding.
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
