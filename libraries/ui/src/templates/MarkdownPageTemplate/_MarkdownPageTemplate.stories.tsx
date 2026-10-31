import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '../../components/Button';
import { MarkdownPageTemplate } from './_MarkdownPageTemplate';

const meta: Meta<typeof MarkdownPageTemplate> = {
	title: 'Templates/Markdown Page Template/MarkdownPageTemplate',
	component: MarkdownPageTemplate,
	parameters: {
		layout: 'fullscreen',
	},
};

export default meta;
type Story = StoryObj<typeof MarkdownPageTemplate>;

export const Default: Story = {
	args: {
		title: 'Example Documentation Page',
		containerWidth: 'slim',
		breadcrumbItems: [
			{ href: '/en/', isHome: true, label: 'Home' },
			{ isCurrent: true, label: 'Documentation' },
		],
		primaryAction: (
			<Button as="button" variant="primary" size="md">
				Primary Action
			</Button>
		),
		children: (
			<>
				<h1>Example Documentation</h1>
				<p>This is a demonstration of the MarkdownPageTemplate layout container.</p>

				<h2>Section Heading</h2>
				<p>
					The template provides responsive margins, readable maximum line lengths, and semantic structure for
					editorial prose, rules, and markdown-backed content.
				</p>
			</>
		),
	},
};
