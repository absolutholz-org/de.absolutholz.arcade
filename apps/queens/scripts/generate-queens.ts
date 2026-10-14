import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createSeededRandom, generateUniqueLayout } from '../src/engine/generator.ts';
import { type EncodedPuzzle, encodePuzzle } from '../src/engine/puzzleCodec.ts';
import { countSolutions } from '../src/engine/solver.ts';
import { DIFFICULTY_LEVELS, type Difficulty, GRID_SIZES, type QueensPuzzle } from '../src/engine/types.ts';

const PUZZLES_PER_DIFFICULTY = 25;
const BASE_SEED = 20261014;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const OUTPUT_FILE = join(__dirname, '../src/engine/puzzles.data.json');

console.log('Generating Queens puzzles...');

const generatedPuzzles: EncodedPuzzle[] = [];

for (const difficulty of DIFFICULTY_LEVELS) {
	const size = GRID_SIZES[difficulty];
	console.log(`\n--- Generating ${PUZZLES_PER_DIFFICULTY} puzzles for ${difficulty} (${size}x${size}) ---`);
	const startTime = performance.now();

	for (let index = 1; index <= PUZZLES_PER_DIFFICULTY; index++) {
		const puzzleId = `${difficulty}-${index}`;
		// Use deterministic seed per difficulty and index
		const seed = BASE_SEED + size * 1000 + index * 37;
		const random = createSeededRandom(seed);

		const layout = generateUniqueLayout(size, random, {
			maxAttempts: 300,
			maxRepairsPerAttempt: 400,
		});

		if (!layout) {
			throw new Error(`Failed to generate unique puzzle for ${puzzleId}`);
		}

		// Double-check verification with solver
		const solutionCount = countSolutions(layout.regions, size, 2);
		if (solutionCount !== 1) {
			throw new Error(`Verification failed for ${puzzleId}: found ${solutionCount} solutions`);
		}

		const fullPuzzle: QueensPuzzle = {
			id: puzzleId,
			difficulty,
			size,
			regions: layout.regions,
			solution: layout.solution,
		};

		const encoded = encodePuzzle(fullPuzzle);
		generatedPuzzles.push(encoded);
		process.stdout.write(
			`  [${index}/${PUZZLES_PER_DIFFICULTY}] ${puzzleId} generated (attempts: ${layout.attempts})\n`,
		);
	}

	const elapsed = ((performance.now() - startTime) / 1000).toFixed(2);
	console.log(`Completed ${difficulty} in ${elapsed}s`);
}

writeFileSync(OUTPUT_FILE, `${JSON.stringify(generatedPuzzles, null, '\t')}\n`, 'utf-8');
console.log(`\nSuccessfully generated and saved ${generatedPuzzles.length} puzzles to: ${OUTPUT_FILE}`);
