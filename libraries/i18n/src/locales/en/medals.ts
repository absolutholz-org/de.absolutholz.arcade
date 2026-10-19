import type { MedalsTranslationContract } from '../../schemas/medals.schema.js';

export const enMedals = {
	showcase: {
		title: 'Medal Showcase',
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
		widget: {
			bannerTitle: 'Your Trophy Collection',
			guestTitle: 'Medal Showcase',
			guestDescription: 'Complete puzzle milestones, track your progress, and earn trophies across all games.',
			viewShowcase: 'View Showcase',
		},
	},
	sudoku: {
		first_victory: {
			title: 'First Victory',
			desc: 'Win your first game of Sudoku on any difficulty.',
		},
		streak: {
			title: 'Winning Streak',
			desc: 'Achieve consecutive victories: Bronze at 3, Silver at 5, and Gold at 10 games.',
		},
		campaign_foundations: {
			title: 'Foundations Campaign',
			desc: 'Master curated puzzles: Bronze for all 6 Easy, Silver for all 6 Medium, Gold for all 12 with zero hints used.',
		},
		campaign_gauntlet: {
			title: 'The Gauntlet Campaign',
			desc: 'Conquer advanced curated puzzles: Bronze for any 3 Hard, Silver for all 6 Hard, Gold for all 6 Very Hard.',
		},
		speed_demon: {
			title: 'Speed Demon',
			desc: 'Solve a Sudoku puzzle in under 3 minutes on Medium difficulty or higher.',
		},
		flawless_logic: {
			title: 'Flawless Logic',
			desc: 'Complete a Sudoku on Hard difficulty or higher with 0 mistakes and 0 hints used.',
		},
		beyond_mortal: {
			title: 'Beyond Mortal',
			desc: 'Solve a puzzle on Insane or Inhuman difficulty.',
		},
		living_on_edge: {
			title: 'Living on the Edge',
			desc: 'Win a game with exactly 2 mistakes, one slip away from defeat.',
		},
		participation: {
			title: 'Participation Medal',
			desc: 'Solve any puzzle at any difficulty. You did it!',
		},
		old_college_try: {
			title: 'The Old College Try',
			desc: 'Suffer your first defeat. You tried, and that counts for something.',
		},
		speedrun_failure: {
			title: 'Speedrun to Failure',
			desc: 'Strike out and lose a match in under 20 seconds.',
		},
		analysis_paralysis: {
			title: 'Analysis Paralysis',
			desc: 'Spend over 20 minutes solving an Easy puzzle. Measure twice, cut once.',
		},
		are_you_sure: {
			title: 'Are You Sure About That?',
			desc: 'Undo your moves 10 times consecutively in one game.',
		},
		living_on_prayer: {
			title: 'Living on a Prayer',
			desc: 'Make two mistakes in the first minute and still emerge victorious.',
		},
		pencil_pusher: {
			title: 'Pencil Pusher',
			desc: 'Plot out 60 notes before committing to your first confirmed number.',
		},
		surgical_precision: {
			title: 'Surgical Precision',
			desc: 'Solve a Hard or higher board with zero notes, zero hints, and zero mistakes.',
		},
		insomnia: {
			title: 'Insomnia Special',
			desc: 'Complete a puzzle between 2:00 AM and 4:00 AM.',
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
