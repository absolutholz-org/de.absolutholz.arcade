import styled from '@emotion/styled';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { themeColor } from '../../styles/theme/theme.utils';
import { Carousel } from '.';
import { PageContainer } from '../PageContainer';
import { Text } from '../Text';
import { Theme } from '../Theme';
import { CAROUSEL_VARIANTS } from './_Carousel.constants';
import { spacingKeys } from '../../styles/spacing';

const meta = {
	component: Carousel,
	parameters: {
		layout: 'fullscreen',
	},
	tags: ['autodocs'],
	title: 'Components/Carousel',
	argTypes: {
		variant: {
			control: 'select',
			options: CAROUSEL_VARIANTS,
			description: 'The layout variant of the carousel',
		},
		gap: {
			control: 'select',
			options: spacingKeys,
			description: 'The space gap between each slide',
		},
		as: {
			control: 'text',
			description:
				'The HTML element or custom component to render as the container',
		},
	},
	args: {
		variant: 'standard',
		gap: 'md',
		as: 'div',
	},
} satisfies Meta<typeof Carousel>;

export default meta;
type Story = StoryObj<typeof meta>;

// Styled components for a premium Storybook showcase
const ShowcaseFrame = styled.div`
	background-color: ${themeColor('surface')};
	min-height: 100vh;
	width: 100%;
	padding: 60px 0;
	box-sizing: border-box;
	font-family: 'Inter', system-ui, sans-serif;
	display: flex;
	flex-direction: column;
	gap: 40px;
`;

const SectionHeader = styled.div`
	display: flex;
	flex-direction: column;
	gap: 8px;
`;

const ContentDivider = styled.hr`
	border: 0;
	height: 1px;
	background-color: ${themeColor('container-2')};
	margin: 20px 0;
`;

// Slide Card with premium glassmorphism/gradient aesthetic & micro-animations
const Slide = styled.div<{ $gradient: string }>`
	width: 300px;
	height: 380px;
	background: ${({ $gradient }) => $gradient};
	border-radius: 20px;
	padding: 28px;
	box-sizing: border-box;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	color: oklch(0.98 0.005 250);
	position: relative;
	overflow: hidden;
	box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.25);
	transition:
		transform 0.4s cubic-bezier(0.16, 1, 0.3, 1),
		box-shadow 0.4s cubic-bezier(0.16, 1, 0.3, 1);
	cursor: pointer;

	&::before {
		content: '';
		position: absolute;
		inset: 0;
		background: linear-gradient(
			to bottom,
			rgba(0, 0, 0, 0) 50%,
			rgba(0, 0, 0, 0.6) 100%
		);
		z-index: 1;
	}

	&:hover {
		transform: translateY(-8px) scale(1.02);
		box-shadow:
			0 20px 40px -15px rgba(0, 0, 0, 0.4),
			0 0 0 2px rgba(255, 255, 255, 0.15);

		.arrow-icon {
			transform: translateX(6px);
		}
	}

	> * {
		z-index: 2;
	}
`;

const Badge = styled.span`
	background: rgba(255, 255, 255, 0.15);
	backdrop-filter: blur(8px);
	padding: 6px 14px;
	border-radius: 100px;
	font-size: 0.75rem;
	font-weight: 600;
	letter-spacing: 0.05em;
	text-transform: uppercase;
	width: max-content;
	border: 1px solid rgba(255, 255, 255, 0.2);
`;

const SlideFooter = styled.div`
	display: flex;
	flex-direction: column;
	gap: 6px;
`;

const ArrowIcon = styled.span`
	font-size: 1.25rem;
	transition: transform 0.3s ease;
`;

const FooterRow = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-top: 12px;
`;

const SlideTitle = styled.h3`
	margin: 0;
	font-size: 1.5rem;
	font-weight: 700;
	color: inherit;
`;

const SlideDesc = styled.p`
	margin: 4px 0 0;
	font-size: 0.875rem;
	color: rgba(255, 255, 255, 0.8);
	line-height: 1.4;
`;

const SlidePrice = styled.span`
	font-size: 1rem;
	font-weight: 600;
	color: inherit;
`;

const SLIDE_ITEMS = [
	{
		id: 1,
		badge: 'New Release',
		title: 'Wild Oak Dining Table',
		desc: 'Crafted from 150-year-old local oak trees with natural organic edges.',
		gradient:
			'linear-gradient(135deg, oklch(0.45 0.1 45), oklch(0.25 0.08 35))',
		price: '€1,899',
	},
	{
		id: 2,
		badge: 'Classic',
		title: 'Walnut Lounge Chair',
		desc: 'Mid-century modern aesthetic reimagined with sustainable regional walnut.',
		gradient:
			'linear-gradient(135deg, oklch(0.35 0.06 60), oklch(0.2 0.04 50))',
		price: '€749',
	},
	{
		id: 3,
		badge: 'Limited Edition',
		title: 'Black Forest Spruce Bench',
		desc: 'Carbonized finish using traditional Shou Sugi Ban preservation methods.',
		gradient:
			'linear-gradient(135deg, oklch(0.28 0.02 240), oklch(0.15 0.01 240))',
		price: '€620',
	},
	{
		id: 4,
		badge: 'Artisan',
		title: 'Cherry Wood Shelving',
		desc: 'Floating modular units that display the rich red hues of cherry heartwood.',
		gradient:
			'linear-gradient(135deg, oklch(0.42 0.11 30), oklch(0.23 0.09 20))',
		price: '€310',
	},
	{
		id: 5,
		badge: 'Minimalist',
		title: 'Ash Wood Desk',
		desc: 'Ultra-durable, shock-resistant desk designed for ergonomic home offices.',
		gradient:
			'linear-gradient(135deg, oklch(0.52 0.07 85), oklch(0.35 0.05 75))',
		price: '€1,150',
	},
	{
		id: 6,
		badge: 'Outdoor',
		title: 'Larch Terrace Lounger',
		desc: 'Naturally weatherproof larch wood that ages into a gorgeous silver-grey.',
		gradient:
			'linear-gradient(135deg, oklch(0.4 0.09 55), oklch(0.22 0.07 45))',
		price: '€480',
	},
];

const renderSlides = () =>
	SLIDE_ITEMS.map((item) => (
		<Slide key={item.id} $gradient={item.gradient}>
			<Badge>{item.badge}</Badge>
			<SlideFooter>
				<SlideTitle>{item.title}</SlideTitle>
				<SlideDesc>{item.desc}</SlideDesc>
				<FooterRow>
					<SlidePrice>{item.price}</SlidePrice>
					<ArrowIcon className="arrow-icon">→</ArrowIcon>
				</FooterRow>
			</SlideFooter>
		</Slide>
	));

export const Standard: Story = {
	parameters: {
		docs: {
			description: {
				story:
					'The standard carousel fits within the parent page container boundaries. Slides begin and snap exactly at the left edge of the page container width.',
			},
		},
	},
	render: (args) => (
		<Theme name="primary">
			<ShowcaseFrame>
				<PageContainer variant="standard">
					<SectionHeader>
						<Text variant="h2" as="h1">
							Standard Carousel Layout
						</Text>
						<Text variant="base">
							This carousel layout respects the PageContainer margins. The
							scroll container is bounded on both sides, keeping all content
							inside the central readable grid.
						</Text>
					</SectionHeader>
					<ContentDivider />
					<Carousel {...args}>{renderSlides()}</Carousel>
					<ContentDivider />
					<Text variant="small">
						Swipe or scroll horizontally. Snapping is set to `x mandatory`.
					</Text>
				</PageContainer>
			</ShowcaseFrame>
		</Theme>
	),
};

export const FullBleed: Story = {
	args: {
		variant: 'full-bleed',
	},
	parameters: {
		docs: {
			description: {
				story:
					'The full-bleed carousel breaks out of the page content margins to stretch edge-to-edge across the screen. Initial and final slides, as well as snapping limits, align perfectly with the standard content container lines.',
			},
		},
	},
	render: (args) => (
		<Theme name="primary">
			<ShowcaseFrame>
				<PageContainer variant="standard">
					<SectionHeader>
						<Text variant="h2" as="h1">
							Full-Bleed Carousel Layout
						</Text>
						<Text variant="base">
							Observe how this carousel breaks out of the standard container
							grid to span the entire screen width. The first slide starts
							aligned with the page header above, and cards scroll across the
							full viewport.
						</Text>
					</SectionHeader>
					<ContentDivider />
					<Carousel {...args}>{renderSlides()}</Carousel>
					<ContentDivider />
					<Text variant="base">
						Notice that on resize, the margins on the first and last slides
						dynamically adjust to match the centered page padding boundaries
						(`--page-content-padding` and `--page-content-max-width` inherited
						from `PageContainer`).
					</Text>
				</PageContainer>
			</ShowcaseFrame>
		</Theme>
	),
};
