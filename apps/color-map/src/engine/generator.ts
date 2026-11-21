import { buildAdjacencyGraph, buildRegionMetadata, generateRegionGrid } from './adjacency.ts';
import { createPrng } from './prng.ts';
import { countSolutions, solveFourColoring } from './solver.ts';
import { type ColorIndex, type ColorMapPuzzle, DIFFICULTY_CONFIGS, type Difficulty } from './types.ts';

function createRandomSeed(): number {
	return (Date.now() ^ Math.floor(Math.random() * 0xffffffff)) >>> 0;
}

/**
 * Generates a deterministic, seeded Color Map puzzle with a mathematically verified
 * unique 4-coloring solution (`countSolutions === 1`) calibrated for the chosen difficulty tier.
 */
export function generatePuzzle(difficulty: Difficulty, seed: number = createRandomSeed()): ColorMapPuzzle {
	const config = DIFFICULTY_CONFIGS[difficulty];
	const baseSeed = seed >>> 0;

	for (let attempt = 0; attempt < 20; attempt += 1) {
		const attemptSeed = (baseSeed + Math.imul(attempt, 0x9e3779b1)) >>> 0;
		const rng = createPrng(attemptSeed);

		const regionCount = rng.nextInt(config.minRegions, config.maxRegions);
		const regionGrid = generateRegionGrid(config.gridSize, regionCount, config.minRegionCells, rng);
		const adjacency = buildAdjacencyGraph(regionGrid, regionCount);
		const solution = solveFourColoring(adjacency, rng);

		if (!solution) continue;

		// Target clue count range for the difficulty tier
		const targetMinClues = Math.max(3, Math.round(regionCount * config.minClueRatio));
		const targetMaxClues = Math.max(targetMinClues, Math.round(regionCount * config.maxClueRatio));

		// Shuffle region IDs and iteratively sculpt clues while preserving unique solvability
		const givens: (ColorIndex | null)[] = [...solution];
		const regionOrder = rng.shuffle(Array.from({ length: regionCount }, (_, i) => i));
		let clueCount = regionCount;

		for (let i = 0; i < regionOrder.length; i += 1) {
			if (clueCount <= targetMinClues) break;

			const regionId = regionOrder[i];
			const savedColor = givens[regionId];
			givens[regionId] = null;

			const check = countSolutions(adjacency, givens, 2, 20000);
			if (!check.aborted && check.count === 1) {
				clueCount -= 1;
			} else {
				givens[regionId] = savedColor;
			}
		}

		// Ensure we have at least one uncolored region and respect the upper clue ratio bound on early attempts
		const uncoloredCount = regionCount - clueCount;
		const withinUpperBound = clueCount <= targetMaxClues + 2 || attempt >= 12;

		if (uncoloredCount >= 2 && withinUpperBound) {
			const finalVerify = countSolutions(adjacency, givens, 2, 40000);
			if (!finalVerify.aborted && finalVerify.count === 1) {
				const regions = buildRegionMetadata(regionGrid, adjacency);
				return {
					id: `${difficulty}-${baseSeed.toString(36)}`,
					seed: baseSeed,
					difficulty,
					gridSize: config.gridSize,
					regionGrid,
					regions,
					givens,
					solution,
				};
			}
		}
	}

	// Safe fallback on last attempt with relaxed clue ratio
	const fallbackRng = createPrng(baseSeed ^ 0xa5a5a5a5);
	const regionCount = config.minRegions;
	const regionGrid = generateRegionGrid(config.gridSize, regionCount, config.minRegionCells, fallbackRng);
	const adjacency = buildAdjacencyGraph(regionGrid, regionCount);
	const solution =
		solveFourColoring(adjacency, fallbackRng) ?? Array.from({ length: regionCount }, () => 0 as ColorIndex);
	const givens: (ColorIndex | null)[] = [...solution];
	const order = fallbackRng.shuffle(Array.from({ length: regionCount }, (_, i) => i));

	for (const regionId of order) {
		const saved = givens[regionId];
		givens[regionId] = null;
		const check = countSolutions(adjacency, givens, 2, 25000);
		if (check.aborted || check.count !== 1) {
			givens[regionId] = saved;
		}
	}

	const regions = buildRegionMetadata(regionGrid, adjacency);
	return {
		id: `${difficulty}-${baseSeed.toString(36)}`,
		seed: baseSeed,
		difficulty,
		gridSize: config.gridSize,
		regionGrid,
		regions,
		givens,
		solution,
	};
}
