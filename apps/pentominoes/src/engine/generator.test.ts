import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { CURATED_LEVELS, generateProceduralPuzzle } from './generator.ts';
import { getPieceDefinition } from './pieces.ts';
import { findHintPlacement, solveExactCover } from './solver.ts';
import { countPlayableCells, isPuzzleComplete } from './validator.ts';

describe('DLX Exact Cover Solver & Curated Levels', () => {
	it('verifies all 16 curated levels have matching cell counts and are solvable via DLX', () => {
		assert.equal(CURATED_LEVELS.length, 16);

		for (const level of CURATED_LEVELS) {
			const playableCells = countPlayableCells(level.mask);
			const totalPieceCells = level.pieceIds.reduce((sum, id) => sum + getPieceDefinition(id).size, 0);
			assert.equal(
				playableCells,
				totalPieceCells,
				`Level ${level.id} playable cell count (${playableCells}) must match total piece cells (${totalPieceCells})`,
			);

			const solveRes = solveExactCover(level.mask, level.pieceIds, {
				maxSolutions: 1,
			});
			assert.equal(solveRes.solvable, true, `Level ${level.id} must be solvable`);
			assert.ok(solveRes.firstSolution);
			assert.equal(isPuzzleComplete(level.mask, level.pieceIds, solveRes.firstSolution), true);
		}
	});

	it('generates deterministic solvable procedural puzzles and hints', () => {
		const genA = generateProceduralPuzzle('easy', 42);
		const genB = generateProceduralPuzzle('easy', 42);
		assert.deepEqual(genA.level.pieceIds, genB.level.pieceIds);
		assert.equal(isPuzzleComplete(genA.level.mask, genA.level.pieceIds, genA.solution), true);

		const hint = findHintPlacement(genA.level.mask, genA.level.pieceIds, []);
		assert.ok(hint);
		assert.ok(genA.level.pieceIds.includes(hint.pieceId));
	});
});
