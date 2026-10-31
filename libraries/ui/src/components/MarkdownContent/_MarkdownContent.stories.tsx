import type { Meta, StoryObj } from '@storybook/react-vite';
import { MarkdownContent } from '.';
import { Theme } from '../Theme';
import { MARKDOWN_CONTENT_VARIANTS } from './_MarkdownContent.constants';

const meta = {
	component: MarkdownContent,
	parameters: {
		layout: 'padded',
	},
	tags: ['autodocs'],
	title: 'Components/MarkdownContent',
	argTypes: {
		variant: {
			control: 'select',
			options: Object.keys(MARKDOWN_CONTENT_VARIANTS),
			description: 'Width constraint variant for the prose layout',
		},
		as: {
			control: 'text',
			description: 'The root HTML element or component to render',
		},
	},
	args: {
		variant: 'standard',
		as: 'article',
	},
} satisfies Meta<typeof MarkdownContent>;

export default meta;
type Story = StoryObj<typeof meta>;

const SampleMarkdown = () => (
	<>
		<h1>Game Rules & Overview</h1>
		<p>
			Welcome to the official rules guide. This document explains the core mechanics, winning conditions, and
			tactical guidelines for classic arcade puzzle gameplay.
		</p>

		<h2>Core Objective</h2>
		<p>
			Your primary goal is to solve the puzzle or clear the grid within optimal time without making conflicting
			moves or detonating hidden hazards.
		</p>

		<h3>1. Grid Mechanics</h3>
		<p>
			Each cell is uniquely identified by its coordinate pair. You can navigate across rows and columns using
			standard keyboard arrow keys or direct mouse clicks.
		</p>
		<ul>
			<li>Every row must conform to unique numeric or state constraints.</li>
			<li>Adjacent items provide spatial hints for neighboring deductions.</li>
			<li>Undo and redo actions allow tactical experimentation.</li>
		</ul>

		<h3>2. Tactical Progression</h3>
		<ol>
			<li>Survey the starting clues and identify obvious candidate moves.</li>
			<li>Eliminate impossible states row-by-row and block-by-block.</li>
			<li>Lock in verified values until the victory threshold is reached.</li>
		</ol>

		<blockquote>
			<p>
				<strong>Pro Tip:</strong> When faced with ambiguous branches, look for intersecting constraints rather
				than guessing blindly.
			</p>
		</blockquote>

		<h2>Quick Reference Table</h2>
		<table>
			<thead>
				<tr>
					<th>Mode</th>
					<th>Grid Size</th>
					<th>Estimated Time</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td>Easy</td>
					<td>5×5</td>
					<td>2–3 min</td>
				</tr>
				<tr>
					<td>Medium</td>
					<td>9×9</td>
					<td>5–10 min</td>
				</tr>
				<tr>
					<td>Expert</td>
					<td>12×12</td>
					<td>15–25 min</td>
				</tr>
			</tbody>
		</table>
	</>
);

export const Default: Story = {
	parameters: {
		docs: {
			description: {
				story: 'The standard MarkdownContent container limits width to 48rem and applies semantic styles to headings, paragraphs, lists, blockquotes, and tables.',
			},
		},
	},
	render: (args) => (
		<Theme name="primary">
			<MarkdownContent {...args}>
				<SampleMarkdown />
			</MarkdownContent>
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
				story: 'The wide variant extends max-width to 64rem for dense tables or expanded documentation.',
			},
		},
	},
	render: (args) => (
		<Theme name="primary">
			<MarkdownContent {...args}>
				<SampleMarkdown />
			</MarkdownContent>
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
				story: 'The full width variant removes max-width constraints, filling the parent container completely.',
			},
		},
	},
	render: (args) => (
		<Theme name="primary">
			<MarkdownContent {...args}>
				<SampleMarkdown />
			</MarkdownContent>
		</Theme>
	),
};
