import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { generatePuzzle } from './generator.ts';
import type { ColorIndex } from './types.ts';
import { countUncoloredRegions, isBoardComplete, validateBoard } from './validator.ts';

describe('color-map validator', () => {
	it('detects adjacent conflicts and incomplete boards accurately', () => {
		const puzzle = generatePuzzle('easy', 555);
		const colors: (ColorIndex | null)[] = [...puzzle.solution];

		assert.equal(countUncoloredRegions(colors), 0);
		assert.equal(isBoardComplete(puzzle.regions, colors), true);
		assert.equal(validateBoard(puzzle.regions, colors).hasConflicts, false);

		// Introduce a conflict between region 0 and its first neighbor
		const neighbor = puzzle.regions[0].neighbors[0];
		colors[neighbor] = colors[0];
		const summary = validateBoard(puzzle.regions, colors);
		assert.equal(summary.hasConflicts, true);
		assert.equal(summary.conflictingRegions.has(0), true);
		assert.equal(summary.conflictingRegions.has(neighbor), true);
		assert.equal(isBoardComplete(puzzle.regions, colors), false);

		// Clear one region => incomplete even without conflicts
		colors[neighbor] = null;
		assert.equal(countUncoloredRegions(colors), 1);
		assert.equal(isBoardComplete(puzzle.regions, colors), false);
	});
});
