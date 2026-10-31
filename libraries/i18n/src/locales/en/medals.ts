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
			watersort: 'Water Sort',
			bridges: 'Bridges',
			anagram: 'Anagram Scramble',
			tents: 'Tents',
			untangle: 'Untangle',
			net: 'Net',
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
	watersort: {
		chemist_ladder: {
			title: 'Lab Technician',
			desc: 'Solve test tube racks across your career (5 / 25 / 100).',
		},
		perfect_ladder: {
			title: 'Precision Chemist',
			desc: 'Win puzzles without using any undos (3 / 10 / 25).',
		},
		first_sort: {
			title: 'First Reaction',
			desc: 'Solve your first puzzle.',
		},
		medium_clear: {
			title: 'Intermediate Chemistry',
			desc: 'Complete 5 Medium puzzles.',
		},
		hard_clear: {
			title: 'Chromatography',
			desc: 'Complete 5 Hard puzzles.',
		},
		expert_clear: {
			title: 'Grand Alchemist',
			desc: 'Complete your first Expert puzzle.',
		},
		master_suite: {
			title: 'Master of Elements',
			desc: 'Clear at least one puzzle across all 4 difficulty tiers.',
		},
		speed_pourer: {
			title: 'Flash Pour',
			desc: 'Solve any puzzle in under 45 seconds.',
		},
		blitz_chemist: {
			title: 'Rapid Titration',
			desc: 'Solve a Medium puzzle in under 30 seconds.',
		},
		expert_speed: {
			title: 'Calculated Velocity',
			desc: 'Solve a Hard puzzle in under 60 seconds.',
		},
		par_perfection: {
			title: 'Zero Waste',
			desc: 'Complete a Medium or Hard puzzle at or under Par moves.',
		},
		theoretical_limit: {
			title: 'Theoretical Limit',
			desc: 'Complete an Expert puzzle in 34 moves or fewer.',
		},
		flawless: {
			title: 'Clean Hands',
			desc: 'Solve any puzzle without using Undo or Hints.',
		},
		comeback_kid: {
			title: 'Chemical Recovery',
			desc: 'Win a puzzle after using 6+ undos without restarting.',
		},
		color_cascade: {
			title: 'Rainbow Synthesis',
			desc: 'Complete 4 single-color tubes in consecutive moves.',
		},
		single_buffer: {
			title: 'Narrow Margins',
			desc: 'Win a puzzle where only 1 empty tube was ever utilized as a buffer.',
		},
	},
	tracks: {
		first_departure: {
			title: 'First Departure',
			desc: 'Lay down your first functioning railway.',
		},
		transcontinental: {
			title: 'Transcontinental',
			desc: 'Lay railway lines across your career.',
		},
		grand_line: {
			title: 'Grand Line',
			desc: 'Clear curated railway networks across all difficulties.',
		},
		express_service: {
			title: 'Express Service',
			desc: 'Maintain unbroken on-time delivery streaks.',
		},
		bullet_train: {
			title: 'Bullet Train',
			desc: 'Lay a 6x6 railway line in under 30 seconds.',
		},
		trans_siberian: {
			title: 'Trans-Siberian Express',
			desc: 'Connect a 10x10 Expert route in under 3 minutes.',
		},
		direct_line: {
			title: 'Direct Line',
			desc: 'Complete an 8x8 or larger board without placing a single marker tile.',
		},
		smooth_rail: {
			title: 'Smooth Rail',
			desc: 'Complete a Hard or Expert board without erasing a single track piece.',
		},
		college_try: {
			title: 'The Old College Try',
			desc: 'Suffer your first railway concession.',
		},
		derailment: {
			title: 'Derailment',
			desc: 'Run a track directly into a stone wall.',
		},
		infinite_loop: {
			title: 'Infinite Loop',
			desc: 'Build a train track that just goes round in circles.',
		},
		wrong_way: {
			title: 'Wrong Way Round',
			desc: 'Lay your track starting backwards from the exit gate.',
		},
		signal_failure: {
			title: 'Signal Failure',
			desc: 'Exceed the allowed track piece count on three rows or columns at the same time.',
		},
		indecisive_conductor: {
			title: 'Indecisive Conductor',
			desc: 'Reorient the track on the same square five times.',
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
	anagram: {
		first_word: {
			title: 'First Word',
			desc: 'Find your very first word.',
		},
		full_rack: {
			title: 'Full Rack',
			desc: 'Use every tile in the rack to form a single word.',
		},
		speed_demon: {
			title: 'Speed Demon',
			desc: 'Win a timed round with at least 60 seconds left on the clock.',
		},
		perfectionist: {
			title: 'Perfectionist',
			desc: 'Find every single word in a round.',
		},
		round_champion: {
			title: 'Round Champion',
			desc: 'Win rounds across your anagram career.',
		},
		wordsmith: {
			title: 'Wordsmith',
			desc: 'Find words across all of your rounds.',
		},
		expert_scholar: {
			title: 'Expert Scholar',
			desc: 'Win rounds on Expert difficulty.',
		},
		hold_my_tiles: {
			title: 'Hold My Tiles',
			desc: 'Shuffle the rack 20 times in a single round.',
		},
		scrambled_egg: {
			title: 'Scrambled Egg',
			desc: 'Shuffle the rack three times within two seconds.',
		},
		cat_person: {
			title: 'Cat Person',
			desc: 'Find a word and its anagram partner in the same round, like "act" and "cat".',
		},
		silent_treatment: {
			title: 'Silent Treatment',
			desc: 'Win a Zen round without using Backspace or Escape.',
		},
		surrender_monkey: {
			title: 'Surrender Monkey',
			desc: 'Reveal the answers within 5 seconds of starting a round.',
		},
		last_second_hero: {
			title: 'Last-Second Hero',
			desc: 'Find the full-length word with one second or less on the clock.',
		},
		typo_tornado: {
			title: 'Typo Tornado',
			desc: 'Submit 10 invalid guesses in a single round.',
		},
		deja_vu: {
			title: 'Déjà Vu',
			desc: 'Submit an already-found word three times in one round.',
		},
		tiny_dictionary: {
			title: 'Tiny Dictionary',
			desc: 'Win an Easy round using only three-letter words plus the full-length word.',
		},
		sleeping_beauty: {
			title: 'Sleeping Beauty',
			desc: 'Pause a round for over 10 minutes, then still win it.',
		},
		polyglot_apprentice: {
			title: 'Polyglot Apprentice',
			desc: 'Solve at least one puzzle in two different languages.',
		},
		polyglot_trio: {
			title: 'Linguistic Trio',
			desc: 'Solve at least one puzzle in English, German, and Portuguese.',
		},
		tower_of_babel: {
			title: 'Tower of Babel',
			desc: 'Solve puzzles across secondary vocabularies.',
		},
		polyglot_expert: {
			title: 'Cross-Linguistic Master',
			desc: 'Clear an Expert puzzle in two different languages.',
		},
	},
	tents: {
		first_pitch: {
			title: 'First Pitch',
			desc: 'Pitch your very first tent in the woods.',
		},
		pristine_pitch: {
			title: 'Pristine Pitch',
			desc: 'Complete a Medium, Hard, or Expert puzzle with zero mistakes.',
		},
		speed_camper: {
			title: 'Speed Camper',
			desc: 'Complete a Hard or Expert campsite in 2 minutes or less.',
		},
		minimalist: {
			title: 'Nature Minimalist',
			desc: 'Complete a puzzle without placing any grass tiles.',
		},
		master_camper: {
			title: 'Master Camper',
			desc: 'Accumulate campsite victories across your career.',
		},
		expedition_tour: {
			title: 'Expedition Tour',
			desc: 'Master curated campsites across all trail difficulties.',
		},
		survivalist_streak: {
			title: 'Survivalist Streak',
			desc: 'Maintain unbroken winning streaks in the wild.',
		},
		grand_outfitter: {
			title: 'Grand Outfitter',
			desc: 'Pitch tents beside trees across your lifetime camping career.',
		},
		glamping: {
			title: 'Glamping',
			desc: 'Fill every satisfied row and column line with grass via auto-grass.',
		},
		bear_encounter: {
			title: 'Bear Encounter',
			desc: 'Survive and win after having three or more touching tent errors at the same time.',
		},
		iron_will: {
			title: 'Iron Will',
			desc: 'Conquer an Expert campsite with all clue and violation helpers disabled.',
		},
		quick_pitch: {
			title: 'Quick Pitch',
			desc: 'Pitch three tents within the first six seconds of arriving at camp.',
		},
	},
	untangle: {
		first_win: {
			title: 'First Knot Untied',
			desc: 'Untangle your very first graph on any difficulty.',
		},
		wins: {
			title: 'Master Untangler',
			desc: 'Solve tangled graphs across your career (5 / 25 / 100).',
		},
		hard_wins: {
			title: 'Gordian Solver',
			desc: 'Untangle complex webs on Hard difficulty (3 / 15 / 50).',
		},
		streak: {
			title: 'Tangle-Free Streak',
			desc: 'Maintain consecutive victories without giving up (3 / 7 / 15).',
		},
		speed_demon: {
			title: 'Speed Demon',
			desc: 'Untangle a Medium or Hard puzzle in 45 seconds or less.',
		},
		no_undo: {
			title: 'Zero Second-Guesses',
			desc: 'Complete a Hard puzzle without using Undo.',
		},
	},
	net: {
		first_online: {
			title: 'First Packet Routed',
			desc: 'Connect every terminal to the root server on any difficulty.',
		},
		network_architect: {
			title: 'Network Architect',
			desc: 'Energize complete networks throughout your career (5 / 25 / 100).',
		},
		backbone_engineer: {
			title: 'Backbone Engineer',
			desc: 'Wire up complex grids on Hard or Expert difficulty (3 / 15 / 50).',
		},
		speedy_packet: {
			title: 'Sub-Millisecond Ping',
			desc: 'Bring an Easy network completely online in under 30 seconds.',
		},
		hyperscale: {
			title: 'Hyperscale Infrastructure',
			desc: 'Route an entire Hard or Expert grid in under 3 minutes.',
		},
		packet_perfection: {
			title: 'Flawless Transmission',
			desc: 'Energize a Medium, Hard, or Expert network without using Undo.',
		},
		hotline_streak: {
			title: 'Uptime Champion',
			desc: 'Maintain a win streak of 3 consecutive network puzzles.',
		},
	},
} as const satisfies MedalsTranslationContract;
