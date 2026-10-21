export interface SoloNobleSchema {
	title: string;
	description: string;
	layouts: {
		label: string;
		english: string;
		european: string;
		triangular: string;
		diamond: string;
		wiegleb: string;
	};
	variants: {
		label: string;
		classicCentral: string;
		classicCentralDesc: string;
		clearOut: string;
		clearOutDesc: string;
		customStart: string;
		customStartDesc: string;
	};
	status: {
		ready: string;
		readyInstruction: string;
		playing: string;
		won: string;
		wonDesc: string;
		stuck: string;
		stuckDesc: string;
	};
	stats: {
		pegsRemaining: string;
		movesCount: string;
		bestPegs: string;
		bestMoves: string;
	};
	controls: {
		undo: string;
		redo: string;
		reset: string;
		newGame: string;
	};
}

export type SoloNobleTranslationContract = SoloNobleSchema;
