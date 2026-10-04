import { styled } from '@linaria/react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { PageContainer } from '.';
import { Text } from '../Text';
import { Theme } from '../Theme';
import { PAGE_CONTAINER_VARIANTS } from './_PageContainer.constants';

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
			options: Object.keys(PAGE_CONTAINER_VARIANTS),
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

const OuterFrame = styled.div`
	background-color: var(--color-surface);
	color: var(--color-text-1);
	padding: 2.5rem 0;
	width: 100%;
`;

const DecorativeWrapper = styled.div`
	background-color: var(--color-container-1);
	border: 2px dashed var(--color-accent);
	border-radius: 0.75rem;
	display: flex;
	flex-direction: column;
	gap: 1.5rem;
	padding: 1.5rem;
`;

const Header = styled.header`
	align-items: center;
	border-bottom: 1px solid var(--color-container-2);
	display: flex;
	justify-content: space-between;
	padding-bottom: 1rem;
`;

const AdaptiveGrid = styled.div`
	display: grid;
	gap: 1.25rem;
	grid-template-columns: 1fr;

	@container (min-width: 48rem) {
		grid-template-columns: repeat(3, 1fr);
	}
`;

const Card = styled.div`
	background-color: var(--color-surface);
	border: 1px solid var(--color-container-2);
	border-radius: 0.5rem;
	display: flex;
	flex-direction: column;
	gap: 0.5rem;
	padding: 1.25rem;
`;

export const Default: Story = {
	parameters: {
		docs: {
			description: {
				story: 'The default standard layout variant restricts maximum content width to 80rem (1280px) and establishes an inline-size container context.',
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
								Arcade Hub
							</Text>
							<Text variant="small">Container Area (Bounded by Accent Border)</Text>
						</Header>
						<div>
							<Text variant="h2" as="h2">
								Responsive Layout Container
							</Text>
							<Text variant="base">
								Resize the screen to witness the responsive padding transitions. The padding uses the
								locked spacing scale token 'xl', which automatically expands from compact mobile padding
								(1.5rem) to desktop padding (2rem).
							</Text>
						</div>
						<AdaptiveGrid>
							<Card>
								<Text variant="h3">Sudoku</Text>
								<Text variant="small">Play classic number placement puzzles.</Text>
							</Card>
							<Card>
								<Text variant="h3">Minesweeper</Text>
								<Text variant="small">Navigate the minefield with strategic deduction.</Text>
							</Card>
							<Card>
								<Text variant="h3">Connect Four</Text>
								<Text variant="small">Align four tokens vertically, horizontally, or diagonally.</Text>
							</Card>
						</AdaptiveGrid>
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
				story: 'The wide variant extends the maximum width limit to 96rem (1536px), suitable for media-rich or dashboard-style pages.',
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
								Arcade Hub (Wide View)
							</Text>
							<Text variant="small">Container Area (96rem Max-Width)</Text>
						</Header>
						<div>
							<Text variant="h2" as="h2">
								Wider Layout Container
							</Text>
							<Text variant="base">
								Provides a spacious layout with a 96rem max-width constraint, offering extra room for
								complex grid layouts or dense game dashboards.
							</Text>
						</div>
						<AdaptiveGrid>
							<Card>
								<Text variant="h3">Sudoku</Text>
								<Text variant="small">Play classic number placement puzzles.</Text>
							</Card>
							<Card>
								<Text variant="h3">Minesweeper</Text>
								<Text variant="small">Navigate the minefield with strategic deduction.</Text>
							</Card>
							<Card>
								<Text variant="h3">Connect Four</Text>
								<Text variant="small">Align four tokens vertically, horizontally, or diagonally.</Text>
							</Card>
						</AdaptiveGrid>
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
				story: 'The full width variant expands the container to 100% of the viewport width while preserving lateral padding.',
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
								Arcade Hub (Full Width)
							</Text>
							<Text variant="small">Container Area (100% Width)</Text>
						</Header>
						<div>
							<Text variant="h2" as="h2">
								Full Width Layout Container
							</Text>
							<Text variant="base">
								Removes max-width limits entirely to stretch across the full viewport, ideal for
								panoramic hero banners or full-bleed layouts.
							</Text>
						</div>
						<AdaptiveGrid>
							<Card>
								<Text variant="h3">Sudoku</Text>
								<Text variant="small">Play classic number placement puzzles.</Text>
							</Card>
							<Card>
								<Text variant="h3">Minesweeper</Text>
								<Text variant="small">Navigate the minefield with strategic deduction.</Text>
							</Card>
							<Card>
								<Text variant="h3">Connect Four</Text>
								<Text variant="small">Align four tokens vertically, horizontally, or diagonally.</Text>
							</Card>
						</AdaptiveGrid>
					</DecorativeWrapper>
				</PageContainer>
			</OuterFrame>
		</Theme>
	),
};
