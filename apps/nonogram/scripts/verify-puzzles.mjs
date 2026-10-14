import { PUZZLES_BY_DIFFICULTY, PUZZLE_CATALOG } from '../src/engine/puzzles.ts';
import { isUniquelySolvable } from '../src/engine/solver.ts';

console.log('Verifying Nonogram puzzle catalog...');

let allPassed = true;
const counts = { easy: 0, medium: 0, hard: 0 };

for (const puzzle of PUZZLE_CATALOG) {
	counts[puzzle.difficulty]++;
	const isSolvable = isUniquelySolvable(puzzle.grid, puzzle.width, puzzle.height);
	if (!isSolvable) {
		console.error(
			`FAILED: ${puzzle.id} (${puzzle.difficulty} ${puzzle.width}x${puzzle.height}) is not uniquely solvable!`,
		);
		allPassed = false;
	}
}

console.log(`Verified ${PUZZLE_CATALOG.length} puzzles:`);
console.log(`  Easy (5x5):    ${counts.easy}`);
console.log(`  Medium (10x10): ${counts.medium}`);
console.log(`  Hard (15x15):   ${counts.hard}`);

if (!allPassed) {
	process.exit(1);
}

console.log('✓ All catalog puzzles verified uniquely solvable via deterministic line deduction!');
