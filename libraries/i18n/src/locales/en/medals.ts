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
			bridges: 'Bridges',
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
		first_brushstroke: {
			title: 'First Brushstroke',
			desc: 'Solve your very first picture puzzle.',
		},
		gallery: {
			title: 'The Gallery',
			desc: 'Clear curated puzzles across Easy, Medium, and Hard collections.',
		},
		artist: {
			title: 'Pixel Artist',
			desc: 'Solve puzzles and fill your lifetime gallery.',
		},
		streak: {
			title: 'Unbroken Line',
			desc: 'Build consecutive win streaks without striking out.',
		},
		speed_easy: {
			title: 'Speed Sketcher',
			desc: 'Solve a 5x5 board in under 20 seconds.',
		},
		speed_hard: {
			title: 'Grand Muralist',
			desc: 'Solve a 15x15 board in under 3 minutes.',
		},
		direct_painter: {
			title: 'Direct Painter',
			desc: 'Complete a 10x10 or 15x15 picture without placing a single cross marker.',
		},
		flawless_canvas: {
			title: 'Flawless Canvas',
			desc: 'Complete a 15x15 board with zero mistakes and zero hints.',
		},
		college_try: {
			title: 'The Old College Try',
			desc: 'Suffer your first strikeout. Every artist has rough sketches.',
		},
		speedrun_ruin: {
			title: 'Speedrun to Ruin',
			desc: 'Strike out in under 15 seconds.',
		},
		abstract: {
			title: 'Abstract Expressionism',
			desc: 'Fill over three quarters of the board before losing.',
		},
		playing_safe: {
			title: 'Playing It Safe',
			desc: 'Mark 15 crosses before committing to a single filled pixel.',
		},
		indecisive: {
			title: 'Indecisive Painter',
			desc: 'Change your mind on the same tile five times in one round.',
		},
	},
	minesweeper: {
		clearance_initiated: {
			title: 'Clearance Initiated',
			desc: 'Win your first game of Minesweeper.',
		},
		veteran: {
			title: 'Minefield Veteran',
			desc: 'Achieve total victories: Bronze at 5, Silver at 25, and Gold at 100 games.',
		},
		tour: {
			title: 'Minefield Tour',
			desc: 'Conquer larger and harder minefields: Bronze on Small+, Silver on Large (Hard+), Gold on Extra Large (Expert).',
		},
		streak: {
			title: 'Defusal Streak',
			desc: 'Achieve consecutive victories: Bronze at 3, Silver at 5 (Medium+), and Gold at 10 (Medium+).',
		},
		flagless: {
			title: 'Look, Ma, No Flags!',
			desc: 'Win a match on Medium, Large, or Extra Large without placing a single flag.',
		},
		speed_small: {
			title: 'Swift Sweeper',
			desc: 'Win a match on Small (Medium) in 15 seconds or less.',
		},
		expert_gold: {
			title: 'Apex Demolitionist',
			desc: 'Win a match on Extra Large on Expert difficulty in 90 seconds or less.',
		},
		college_try: {
			title: 'The Old College Try',
			desc: 'Trigger a mine and suffer your first defeat. You tried!',
		},
		speedrun_failure: {
			title: 'First Step is a Doozy',
			desc: 'Trigger a mine within 3 seconds of starting.',
		},
		chord_master: {
			title: 'Chord Master',
			desc: 'Win a match using at least 15 chord actions.',
		},
		the_ocho: {
			title: 'The Mythical Eight',
			desc: 'Uncover a tile with the number 8 and defuse the board.',
		},
		mine_magnet: {
			title: 'Mine Magnet',
			desc: 'Hit a mine 5 games in a row. Maybe take a five-minute break?',
		},
		great_cascade: {
			title: 'The Great Cascade',
			desc: 'Trigger a chain reaction that clears 20 or more tiles in one click.',
		},
		flag_hoarder: {
			title: 'Flag Hoarder',
			desc: 'Place flags on 150% of the actual mines. Better safe than sorry!',
		},
		marathon: {
			title: 'Safe Hands',
			desc: 'Lifetime safe ground cleared across all minefields.',
		},
		corner_to_corner: {
			title: 'Corner to Corner',
			desc: 'Open all four corners in your first four moves on a large board and win.',
		},
		bomb_technician: {
			title: 'Bomb Technician',
			desc: 'Clear an Extra Large Expert minefield with zero misplaced flags.',
		},
		first_clear: {
			title: 'Clearance Initiated',
			desc: 'Win your first game of Minesweeper.',
		},
		demolition_expert: {
			title: 'Demolition Expert',
			desc: 'Clear an Expert difficulty minefield.',
		},
	},
	queens: {
		royal_placement: {
			title: 'Royal Placement',
			desc: 'Crown your very first kingdom.',
		},
		reign_supreme: {
			title: 'Reign Supreme',
			desc: 'Build a dynasty across your lifetime solving career.',
		},
		coronation_tour: {
			title: 'Coronation Tour',
			desc: 'Solve curated campaigns across all realm sizes.',
		},
		succession_streak: {
			title: 'Royal Succession',
			desc: 'Maintain unbroken win streaks across tricky realms.',
		},
		speed_easy: {
			title: 'Lightning Coronation',
			desc: 'Solve a 6x6 realm in under 20 seconds.',
		},
		speed_expert: {
			title: 'Grand Sovereign',
			desc: 'Solve a 12x12 Expert kingdom in under 2 minutes.',
		},
		blind_faith: {
			title: 'Blind Faith',
			desc: 'Complete an 8x8 or larger board without placing a single X marker.',
		},
		coup_detat: {
			title: "Coup D'État",
			desc: 'Place every crown with absolute precision without a single conflict or removal.',
		},
		college_try: {
			title: 'The Old College Try',
			desc: 'Suffer your first defeat in the royal court.',
		},
		civil_war: {
			title: 'Civil War',
			desc: 'Place two queens that threaten one another.',
		},
		abdication: {
			title: 'Abdication',
			desc: 'Surrender a realm after placing over half of the royal crowns.',
		},
		paranoid_monarch: {
			title: 'Paranoid Monarch',
			desc: 'Fill over 80% of the kingdom with X marks before placing your first crown.',
		},
		royal_indecision: {
			title: 'Royal Indecision',
			desc: 'Place and remove a crown from the exact same square four times.',
		},
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
	bridges: {
		first_span: {
			title: 'First Span',
			desc: 'Connect your very first network of islands.',
		},
		archipelago: {
			title: 'Archipelago Architect',
			desc: 'Complete curated bridge networks across all sizes.',
		},
		builder: {
			title: 'Master Builder',
			desc: 'Build bridges and connect islands in your lifetime career.',
		},
		streak: {
			title: 'Unbroken Transit',
			desc: 'Solve consecutive boards without disconnecting a route.',
		},
		speed_beginner: {
			title: 'Rapid Transit',
			desc: 'Connect a 6x6 Beginner board in under 20 seconds.',
		},
		speed_expert: {
			title: 'Civil Engineering Master',
			desc: 'Solve an 18x18 Expert grid in under 4 minutes.',
		},
		flawless_network: {
			title: 'Flawless Network',
			desc: 'Complete a Hard or Expert board without demolishing a single bridge.',
		},
		double_trouble: {
			title: 'Double Trouble',
			desc: 'Lay down every double bridge before drawing any single span.',
		},
		college_try: {
			title: 'The Old College Try',
			desc: 'Suffer your first failed transit line.',
		},
		bridge_to_nowhere: {
			title: 'Bridge to Nowhere',
			desc: 'Build an isolated loop that leaves the mainland stranded.',
		},
		traffic_jam: {
			title: 'Traffic Jam',
			desc: 'Attempt to draw intersecting bridges five times in one game.',
		},
		indecisive_engineer: {
			title: 'Indecisive Engineer',
			desc: 'Toggle the connection between two islands back and forth six times.',
		},
		speedrun_collapse: {
			title: 'Speedrun Collapse',
			desc: 'Abandon or collapse a bridge project within 10 seconds.',
		},
	},
} as const satisfies MedalsTranslationContract;
