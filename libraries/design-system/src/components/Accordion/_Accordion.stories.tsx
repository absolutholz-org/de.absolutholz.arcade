import styled from '@emotion/styled';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { themeColor } from '../../styles/theme/theme.utils';
import { Accordion, AccordionItem } from './_Accordion';
import { spacingKeys } from '../../styles/spacing';
import { PageContainer } from '../PageContainer';
import { Text } from '../Text';
import { Theme } from '../Theme';
import { ACCORDION_VARIANTS } from './_Accordion.constants';

const meta = {
	component: Accordion,
	parameters: {
		layout: 'fullscreen',
	},
	tags: ['autodocs'],
	title: 'Components/Accordion',
	argTypes: {
		variant: {
			control: 'select',
			options: ACCORDION_VARIANTS,
			description: 'The visual style variant of the accordion container',
		},
		gap: {
			control: 'select',
			options: spacingKeys,
			description: 'The space gap between each accordion item',
		},
		exclusive: {
			control: 'boolean',
			description: 'Whether opening one item closes the others',
		},
	},
	args: {
		variant: 'ghost',
		gap: 'none',
		exclusive: true,
		children: null,
	},
} satisfies Meta<typeof Accordion>;

export default meta;
type Story = StoryObj<typeof meta>;

// Styled components for a premium Storybook showcase
const ShowcaseFrame = styled.div`
	background-color: ${themeColor('surface')};
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

export const StandaloneItem: Story = {
	parameters: {
		docs: {
			description: {
				story:
					'A single standalone AccordionItem using the native HTML5 details/summary elements. It can be opened and closed independently.',
			},
		},
	},
	render: (args) => (
		<Theme name="primary">
			<ShowcaseFrame>
				<PageContainer variant="standard">
					<SectionHeader>
						<Text variant="h2" as="h1">
							Standalone Accordion Item
						</Text>
						<Text variant="base">
							This story demonstrates a single disclosure component. It works
							natively without any complex React state syncing.
						</Text>
					</SectionHeader>
					<ContentDivider />
					<Accordion {...args}>
						<AccordionItem title="Sustainable Timber Harvesting">
							<Text variant="base">
								We source all wood exclusively from FSC-certified forestry
								reserves located within a 100-kilometer radius of our
								manufacturing facility in the Black Forest. This ensures optimal
								carbon footprint reduction and guarantees responsible
								replenishment of regional woodlands.
							</Text>
						</AccordionItem>
					</Accordion>
				</PageContainer>
			</ShowcaseFrame>
		</Theme>
	),
};

export const Grouped: Story = {
	args: {
		variant: 'bordered',
		gap: 'md',
	},
	parameters: {
		docs: {
			description: {
				story:
					'A grouped accordion block. Toggle the "exclusive" control inside the Storybook panel to switch between allowing multiple open panels or enforcing a single-item-only native exclusion list.',
			},
		},
	},
	render: (args) => (
		<Theme name="primary">
			<ShowcaseFrame>
				<PageContainer variant="standard">
					<SectionHeader>
						<Text variant="h2" as="h1">
							Grouped Accordion Block
						</Text>
						<Text variant="base">
							Toggle the <strong>exclusive</strong> control below to toggle
							group behavior live. When exclusive is active, opening any item
							will automatically close all other items in the group using native
							details name properties.
						</Text>
					</SectionHeader>
					<ContentDivider />
					<Accordion {...args}>
						<AccordionItem title="Premium Oak Dining Tables">
							<Text variant="base">
								Crafted from 150-year-old local German Oak. Each slab is
								carefully dried and finished using all-natural oils that
								accentuate the raw wood grains and protect it against spills.
							</Text>
						</AccordionItem>
						<AccordionItem title="Regional Black Forest Walnut Lounges">
							<Text variant="base">
								Designed for ultimate comfort with an ergonomic organic form.
								The solid walnut structure re-defines minimalist modern
								aesthetics using local, sustainable materials.
							</Text>
						</AccordionItem>
						<AccordionItem title="Traditional Shou Sugi Ban Finishes">
							<Text variant="base">
								A preservation process consisting of burning the surface of the
								wood, cooling it, cleaning it, and finishing it with a natural
								oil. It creates an extremely durable, insect-resistant and
								weather-proof charred layer.
							</Text>
						</AccordionItem>
					</Accordion>
				</PageContainer>
			</ShowcaseFrame>
		</Theme>
	),
};
