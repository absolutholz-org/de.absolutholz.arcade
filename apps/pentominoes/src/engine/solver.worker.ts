import { generateProceduralPuzzle } from './generator.ts';
import { findHintPlacement, solveExactCover } from './solver.ts';
import type { Difficulty, PieceId, Placement } from './types.ts';

export type SolverWorkerRequest =
	| {
			readonly id: string;
			readonly type: 'solve';
			readonly mask: ReadonlyArray<ReadonlyArray<number>>;
			readonly pieceIds: ReadonlyArray<PieceId>;
			readonly existingPlacements: ReadonlyArray<Placement>;
			readonly maxSolutions?: number;
	  }
	| {
			readonly id: string;
			readonly type: 'hint';
			readonly mask: ReadonlyArray<ReadonlyArray<number>>;
			readonly pieceIds: ReadonlyArray<PieceId>;
			readonly existingPlacements: ReadonlyArray<Placement>;
	  }
	| {
			readonly id: string;
			readonly type: 'generate';
			readonly difficulty: Difficulty;
			readonly seed: number;
	  };

export type SolverWorkerResponse =
	| {
			readonly id: string;
			readonly type: 'solveResult';
			readonly solvable: boolean;
			readonly solutionCount: number;
			readonly firstSolution: ReadonlyArray<Placement> | null;
	  }
	| {
			readonly id: string;
			readonly type: 'hintResult';
			readonly placement: Placement | null;
	  }
	| {
			readonly id: string;
			readonly type: 'generateResult';
			readonly level: ReturnType<typeof generateProceduralPuzzle>['level'];
			readonly solution: ReturnType<typeof generateProceduralPuzzle>['solution'];
	  };

self.addEventListener('message', (event: MessageEvent<SolverWorkerRequest>) => {
	const msg = event.data;
	if (msg.type === 'solve') {
		const res = solveExactCover(msg.mask, msg.pieceIds, {
			existingPlacements: msg.existingPlacements,
			maxSolutions: msg.maxSolutions ?? 1,
		});
		const response: SolverWorkerResponse = {
			id: msg.id,
			type: 'solveResult',
			solvable: res.solvable,
			solutionCount: res.solutionCount,
			firstSolution: res.firstSolution,
		};
		self.postMessage(response);
	} else if (msg.type === 'hint') {
		const placement = findHintPlacement(msg.mask, msg.pieceIds, msg.existingPlacements);
		const response: SolverWorkerResponse = {
			id: msg.id,
			type: 'hintResult',
			placement,
		};
		self.postMessage(response);
	} else if (msg.type === 'generate') {
		const generated = generateProceduralPuzzle(msg.difficulty, msg.seed);
		const response: SolverWorkerResponse = {
			id: msg.id,
			type: 'generateResult',
			level: generated.level,
			solution: generated.solution,
		};
		self.postMessage(response);
	}
});
