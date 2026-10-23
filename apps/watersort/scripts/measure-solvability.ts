import { generatePuzzle } from '../src/engine/generator.ts';
import { solve } from '../src/engine/solver.ts';
import { DIFFICULTY_LEVELS } from '../src/engine/types.ts';
import { getLegalMoves, isDeadlocked } from '../src/engine/validator.ts';

const SEED_COUNT = 100;

for (const difficulty of DIFFICULTY_LEVELS) {
	let deadlockedStarts = 0;
	let optimalWithinBudget = 0;
	let totalOptimalLength = 0;
	let totalLegalMoves = 0;
	let totalRecordedLength = 0;
	let minRecordedLength = Number.POSITIVE_INFINITY;
	let totalGenerateMillis = 0;
	let totalSolveMillis = 0;

	for (let seed = 1; seed <= SEED_COUNT; seed++) {
		const generateStartedAt = performance.now();
		const { board, solution } = generatePuzzle(difficulty, seed);
		totalGenerateMillis += performance.now() - generateStartedAt;

		totalRecordedLength += solution.length;
		minRecordedLength = Math.min(minRecordedLength, solution.length);
		totalLegalMoves += getLegalMoves(board).length;
		if (isDeadlocked(board)) {
			deadlockedStarts++;
		}

		const solveStartedAt = performance.now();
		const { status, moves } = solve(board);
		totalSolveMillis += performance.now() - solveStartedAt;
		if (status === 'solved') {
			optimalWithinBudget++;
			totalOptimalLength += moves.length;
		}
	}

	const average = (total: number, count: number) => (count === 0 ? 'n/a' : (total / count).toFixed(1));
	console.log(
		`${difficulty.padEnd(7)} deadlocked=${deadlockedStarts}/${SEED_COUNT} ` +
			`optimalInBudget=${optimalWithinBudget}/${SEED_COUNT} ` +
			`avgOptimal=${average(totalOptimalLength, optimalWithinBudget)} ` +
			`recorded(min/avg)=${minRecordedLength}/${average(totalRecordedLength, SEED_COUNT)} ` +
			`avgLegalMoves=${average(totalLegalMoves, SEED_COUNT)} ` +
			`genMs=${average(totalGenerateMillis, SEED_COUNT)} solveMs=${average(totalSolveMillis, SEED_COUNT)}`,
	);
}
