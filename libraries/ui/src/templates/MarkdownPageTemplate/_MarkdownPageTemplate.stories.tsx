import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '../../components/Button';
import { MarkdownPageTemplate } from './_MarkdownPageTemplate';

const meta: Meta<typeof MarkdownPageTemplate> = {
	title: 'Templates/MarkdownPageTemplate',
	component: MarkdownPageTemplate,
	parameters: {
		layout: 'fullscreen',
	},
};

export default meta;
type Story = StoryObj<typeof MarkdownPageTemplate>;

export const GameRules: Story = {
	args: {
		title: 'Sudoku Rules & Objectives',
		containerWidth: 'slim',
		breadcrumbItems: [
			{ href: '/en/', isHome: true, label: 'Arcade' },
			{ href: '/sudoku/en/', label: 'Sudoku' },
			{ isCurrent: true, label: 'Rules' },
		],
		primaryAction: (
			<Button as="a" href="/sudoku/en/game" variant="primary" size="lg">
				Play Sudoku
			</Button>
		),
		children: (
			<>
				<h1>Sudoku Rules & Objectives</h1>
				<p>Learn how to play classic 9x9 Sudoku and master deductive solving strategies.</p>

				<h2>The Objective</h2>
				<p>
					The puzzle begins with a 9&times;9 grid consisting of nine 3&times;3 regions. Some of the cells are
					pre-filled with numbers from 1 to 9 as starting clues.
				</p>
				<p>
					Your goal is to fill all remaining empty cells so that every row, every column, and each 3&times;3
					subgrid contains all digits from 1 through 9 exactly once.
				</p>

				<h2>Basic Rules</h2>
				<ul>
					<li>
						<strong>No Row Repetitions:</strong> Each horizontal row must contain all numbers from 1 to 9
						without repeating any number.
					</li>
					<li>
						<strong>No Column Repetitions:</strong> Each vertical column must contain all numbers from 1 to
						9 without duplicate digits.
					</li>
					<li>
						<strong>No Region Repetitions:</strong> Each 3&times;3 box must contain each digit from 1 to 9
						exactly once.
					</li>
				</ul>
			</>
		),
	},
};

export const PrivacyPolicy: Story = {
	args: {
		title: 'Privacy Policy',
		containerWidth: 'slim',
		breadcrumbItems: [
			{ href: '/en/', isHome: true, label: 'Arcade' },
			{ isCurrent: true, label: 'Privacy Policy' },
		],
		children: (
			<>
				<h1>Privacy Policy</h1>
				<p>How Absolutholz Arcade respects and protects your personal privacy and local data.</p>

				<h2>1. Overview</h2>
				<p>
					Absolutholz Arcade is designed with a strict privacy-first architecture. All puzzle generation,
					gameplay timers, move histories, and statistics occur entirely within your local browser storage.
				</p>

				<h2>2. Data Collection and Telemetry</h2>
				<p>
					We do not track individual users or sell analytics data. Local gameplay states and preferences are
					stored via standard browser <code>localStorage</code> or <code>IndexedDB</code> and never leave your
					device without your explicit consent.
				</p>
			</>
		),
	},
};
