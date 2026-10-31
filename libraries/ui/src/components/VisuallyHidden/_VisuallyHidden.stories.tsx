import { styled } from '@linaria/react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { VisuallyHidden } from '.';
import { Icon } from '../Icon';
import { Text } from '../Text';
import { Theme } from '../Theme';

const meta = {
	component: VisuallyHidden,
	parameters: {
		layout: 'centered',
		docs: {
			description: {
				component:
					'The VisuallyHidden component clips and hides content from the visual screen while ensuring screen readers and assistive technologies announce it. Essential for WCAG 2.2 AA and BITV 2.0 compliance.',
			},
		},
	},
	tags: ['autodocs'],
	title: 'Components/VisuallyHidden',
	argTypes: {
		as: {
			control: 'text',
			description: 'The HTML element or custom component to render',
		},
		children: {
			control: 'text',
			description: 'Content accessible exclusively to screen readers',
		},
	},
	args: {
		as: 'span',
		children: 'Accessible screen reader text',
	},
} satisfies Meta<typeof VisuallyHidden>;

export default meta;
type Story = StoryObj<typeof meta>;

const DemoCard = styled.div`
	background-color: var(--color-surface);
	border: 1px solid var(--color-container-2);
	border-radius: 0.75rem;
	display: flex;
	flex-direction: column;
	gap: 1rem;
	max-width: 30rem;
	padding: 1.5rem;
`;

const DemoButton = styled.button`
	align-items: center;
	background-color: var(--color-accent);
	border: none;
	border-radius: 0.5rem;
	color: var(--color-accent-contrast);
	cursor: pointer;
	display: inline-flex;
	font-size: 1.25rem;
	height: 2.75rem;
	justify-content: center;
	width: 2.75rem;

	&:focus-visible {
		outline: 2px solid var(--color-accent);
		outline-offset: 2px;
	}
`;

const ScreenReaderSim = styled.div`
	background-color: var(--color-container-1);
	border-left: 4px solid var(--color-accent);
	border-radius: 0.375rem;
	display: flex;
	flex-direction: column;
	gap: 0.25rem;
	padding: 1rem;
`;

export const Default: Story = {
	parameters: {
		docs: {
			description: {
				story: 'The default span-based visually hidden element. Notice that while visually clipped, the text remains in the accessibility tree.',
			},
		},
	},
	render: (args) => (
		<Theme name="primary">
			<DemoCard>
				<Text variant="h3">Screen Reader Inspection</Text>
				<Text variant="base">
					Inspect the DOM below to view the 1x1 clipped element that screen readers announce:
				</Text>
				<VisuallyHidden {...args}>{args.children}</VisuallyHidden>
				<ScreenReaderSim>
					<Text variant="small">Simulated VoiceOver output:</Text>
					<Text variant="base">"{args.children}"</Text>
				</ScreenReaderSim>
			</DemoCard>
		</Theme>
	),
};

export const AccessibleIconButton: Story = {
	args: {
		children: 'Configure system settings',
	},
	parameters: {
		docs: {
			description: {
				story: 'Common pattern: pairing an icon-only button with VisuallyHidden so screen readers announce an unambiguous action name.',
			},
		},
	},
	render: (args) => (
		<Theme name="primary">
			<DemoCard>
				<Text variant="h3">Icon-Only Action Button</Text>
				<div>
					<DemoButton type="button">
						<Icon name="settings" />
						<VisuallyHidden {...args}>{args.children}</VisuallyHidden>
					</DemoButton>
				</div>
				<ScreenReaderSim>
					<Text variant="small">Simulated Screen Reader Announcement:</Text>
					<Text variant="base">Button, Focus: "{args.children}"</Text>
				</ScreenReaderSim>
			</DemoCard>
		</Theme>
	),
};

export const AsDiv: Story = {
	args: {
		as: 'div',
		children: 'Hidden block element container for complex structured accessibility content.',
	},
	parameters: {
		docs: {
			description: {
				story: 'Renders as a div block element when wrapping multi-paragraph or block-level announcements.',
			},
		},
	},
	render: (args) => (
		<Theme name="primary">
			<DemoCard>
				<Text variant="h3">Block Element (as="div")</Text>
				<VisuallyHidden {...args}>{args.children}</VisuallyHidden>
				<ScreenReaderSim>
					<Text variant="small">Rendered HTML tag: &lt;div&gt;</Text>
					<Text variant="base">"{args.children}"</Text>
				</ScreenReaderSim>
			</DemoCard>
		</Theme>
	),
};
