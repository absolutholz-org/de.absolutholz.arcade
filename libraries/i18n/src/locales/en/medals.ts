import type { MedalsTranslationContract } from '../../schemas/medals.schema.js';

export const enMedals = {
	showcase: {
		title: 'My Medals',
		description: 'Track your trophies, personal achievements, and puzzle progression.',
		trophiesSummary: 'Trophy Collection',
		allGames: 'All Games',
		games: {
			sudoku: 'Sudoku',
			nonogram: 'Nonogram',
			minesweeper: 'Minesweeper',
			queens: 'Queens',
			tracks: 'Tracks',
		},
		status: {
			unlocked: 'Unlocked',
			locked: 'Locked',
			unlockedOn: 'Unlocked on {{date}}',
			progress: 'Progress: {{current}} / {{target}} ({{percent}}%)',
		},
		tiers: {
			gold: 'Gold',
			silver: 'Silver',
			bronze: 'Bronze',
		},
		empty: 'No medals found for this filter.',
	},
	sudoku: {
		first_win: {
			title: 'First Victory',
			desc: 'Win your first game of Sudoku.',
		},
		win_streak_3: {
			title: "Puzzler's Streak",
			desc: 'Win 3 games of Sudoku in a row.',
		},
		expert_master: {
			title: 'Grandmaster',
			desc: 'Win 10 games of Sudoku on Expert difficulty.',
		},
		speed_demon: {
			title: 'Speed Demon',
			desc: 'Solve any Sudoku puzzle in under 3 minutes.',
		},
		flawless: {
			title: 'Flawless Logic',
			desc: 'Complete a Sudoku puzzle without making a single error.',
		},
	},
	nonogram: {
		first_solve: {
			title: 'First Reveal',
			desc: 'Solve your first picture logic puzzle.',
		},
		gallery_curator: {
			title: 'Gallery Curator',
			desc: 'Solve 5 distinct Nonogram puzzles.',
		},
		perfectionist: {
			title: 'Perfectionist',
			desc: 'Solve 10 Nonogram puzzles without making mistakes.',
		},
		swift_mind: {
			title: 'Rapid Mind',
			desc: 'Solve any Nonogram puzzle in under 60 seconds.',
		},
	},
	minesweeper: {
		first_clear: {
			title: 'Clearance Initiated',
			desc: 'Win your first game of Minesweeper.',
		},
		veteran: {
			title: 'Minefield Veteran',
			desc: 'Win 10 games of Minesweeper.',
		},
		demolition_expert: {
			title: 'Demolition Expert',
			desc: 'Clear an Expert difficulty minefield.',
		},
	},
	queens: {
		first_win: {
			title: 'Royal Placement',
			desc: 'Solve your first Queens board.',
		},
		reign: {
			title: 'Reign Supreme',
			desc: 'Solve 15 Queens boards.',
		},
	},
	tracks: {
		first_departure: {
			title: 'First Departure',
			desc: 'Complete your first Train Tracks grid.',
		},
		transcontinental: {
			title: 'Transcontinental',
			desc: 'Complete 15 Train Tracks grids.',
		},
	},
} as const satisfies MedalsTranslationContract;
