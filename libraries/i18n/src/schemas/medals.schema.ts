export interface MedalsSchema {
	readonly showcase: {
		readonly title: string;
		readonly description: string;
		readonly trophiesSummary: string;
		readonly allGames: string;
		readonly games: {
			readonly sudoku: string;
			readonly nonogram: string;
			readonly minesweeper: string;
			readonly queens: string;
			readonly tracks: string;
		};
		readonly status: {
			readonly unlocked: string;
			readonly locked: string;
			readonly unlockedOn: string;
			readonly progress: string;
		};
		readonly tiers: {
			readonly gold: string;
			readonly silver: string;
			readonly bronze: string;
		};
		readonly empty: string;
	};
	readonly sudoku: {
		readonly first_win: { readonly title: string; readonly desc: string };
		readonly win_streak_3: { readonly title: string; readonly desc: string };
		readonly expert_master: { readonly title: string; readonly desc: string };
		readonly speed_demon: { readonly title: string; readonly desc: string };
		readonly flawless: { readonly title: string; readonly desc: string };
	};
	readonly nonogram: {
		readonly first_solve: { readonly title: string; readonly desc: string };
		readonly gallery_curator: { readonly title: string; readonly desc: string };
		readonly perfectionist: { readonly title: string; readonly desc: string };
		readonly swift_mind: { readonly title: string; readonly desc: string };
	};
	readonly minesweeper: {
		readonly first_clear: { readonly title: string; readonly desc: string };
		readonly veteran: { readonly title: string; readonly desc: string };
		readonly demolition_expert: { readonly title: string; readonly desc: string };
	};
	readonly queens: {
		readonly first_win: { readonly title: string; readonly desc: string };
		readonly reign: { readonly title: string; readonly desc: string };
	};
	readonly tracks: {
		readonly first_departure: { readonly title: string; readonly desc: string };
		readonly transcontinental: { readonly title: string; readonly desc: string };
	};
}

export type MedalsTranslationContract = MedalsSchema;
