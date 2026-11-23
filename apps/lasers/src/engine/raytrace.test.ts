import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { findHintCell, mixBeamColors, reflectDirection, rotateCellAt, traceBeams } from './raytrace.ts';
import type { LaserCell, LaserGrid } from './types.ts';

function makeGrid(rows: number, cols: number, overrides: readonly LaserCell[]): LaserGrid {
	const grid: LaserCell[][] = [];
	for (let r = 0; r < rows; r += 1) {
		const row: LaserCell[] = [];
		for (let c = 0; c < cols; c += 1) {
			row.push({ row: r, col: c, kind: 'empty' });
		}
		grid.push(row);
	}
	for (const cell of overrides) {
		grid[cell.row][cell.col] = cell;
	}
	return grid;
}

describe('Laser & Mirrors Ray-Tracing Engine', () => {
	it('reflects all 4 cardinal directions accurately off / and \\ mirrors', () => {
		assert.equal(reflectDirection('N', '/'), 'E');
		assert.equal(reflectDirection('E', '/'), 'N');
		assert.equal(reflectDirection('S', '/'), 'W');
		assert.equal(reflectDirection('W', '/'), 'S');

		assert.equal(reflectDirection('N', '\\'), 'W');
		assert.equal(reflectDirection('W', '\\'), 'N');
		assert.equal(reflectDirection('S', '\\'), 'E');
		assert.equal(reflectDirection('E', '\\'), 'S');
	});

	it('evaluates additive RGB color mixing accurately', () => {
		assert.equal(mixBeamColors('red', 'blue'), 'magenta');
		assert.equal(mixBeamColors('blue', 'red'), 'magenta');
		assert.equal(mixBeamColors('red', 'green'), 'yellow');
		assert.equal(mixBeamColors('green', 'blue'), 'cyan');
		assert.equal(mixBeamColors('magenta', 'green'), 'white');
		assert.equal(mixBeamColors('red', 'red'), 'red');
	});

	it('traces a beam through mirrors and blocks on walls', () => {
		const grid = makeGrid(4, 4, [
			{ row: 0, col: 0, kind: 'emitter', direction: 'E', color: 'cyan' },
			{ row: 0, col: 2, kind: 'mirror', orientation: '\\', solutionOrientation: '\\' },
			{ row: 2, col: 2, kind: 'target', color: 'cyan' },
		]);

		const solved = traceBeams(grid);
		assert.equal(solved.isSolved, true);
		assert.equal(solved.litTargetCount, 1);
		assert.equal(solved.totalTargetCount, 1);

		const blocked = makeGrid(4, 4, [
			{ row: 0, col: 0, kind: 'emitter', direction: 'E', color: 'cyan' },
			{ row: 0, col: 1, kind: 'wall' },
			{ row: 0, col: 2, kind: 'mirror', orientation: '\\', solutionOrientation: '\\' },
			{ row: 2, col: 2, kind: 'target', color: 'cyan' },
		]);

		const blockedResult = traceBeams(blocked);
		assert.equal(blockedResult.isSolved, false);
		assert.equal(blockedResult.litTargetCount, 0);
	});

	it('splits beams 50% straight and 50% reflected through a beam splitter', () => {
		const grid = makeGrid(4, 4, [
			{ row: 1, col: 0, kind: 'emitter', direction: 'E', color: 'cyan' },
			{ row: 1, col: 2, kind: 'splitter', orientation: '\\', solutionOrientation: '\\' },
			{ row: 1, col: 3, kind: 'target', color: 'cyan' },
			{ row: 3, col: 2, kind: 'target', color: 'cyan' },
		]);

		const result = traceBeams(grid);
		assert.equal(result.isSolved, true);
		assert.equal(result.litTargetCount, 2);
	});

	it('mixes Red and Blue beams into Magenta at a shared receiver', () => {
		const grid = makeGrid(5, 5, [
			{ row: 2, col: 0, kind: 'emitter', direction: 'E', color: 'red' },
			{ row: 0, col: 2, kind: 'emitter', direction: 'S', color: 'blue' },
			{ row: 2, col: 2, kind: 'target', color: 'magenta' },
		]);

		const result = traceBeams(grid);
		assert.equal(result.isSolved, true);
		assert.equal(result.targets[0].receivedColor, 'magenta');
		assert.equal(result.targets[0].isLit, true);
	});

	it('does not light a red target if hit by mixed magenta (exact color match required)', () => {
		const grid = makeGrid(5, 5, [
			{ row: 2, col: 0, kind: 'emitter', direction: 'E', color: 'red' },
			{ row: 0, col: 2, kind: 'emitter', direction: 'S', color: 'blue' },
			{ row: 2, col: 2, kind: 'target', color: 'red' },
		]);

		const result = traceBeams(grid);
		assert.equal(result.isSolved, false);
		assert.equal(result.targets[0].receivedColor, 'magenta');
		assert.equal(result.targets[0].isLit, false);
	});

	it('terminates cleanly on an infinite 4-mirror reflection loop', () => {
		// Emitter shoots East into a splitter that feeds a closed 4-mirror box:
		// (1,1) splitter '\' -> passes East to (1,3) '\', South to (3,3) '/', West to (3,1) '\', North to (1,1)
		const grid = makeGrid(5, 5, [
			{ row: 1, col: 0, kind: 'emitter', direction: 'E', color: 'red' },
			{ row: 1, col: 1, kind: 'splitter', orientation: '/', solutionOrientation: '/' },
			{ row: 1, col: 3, kind: 'fixed-mirror', orientation: '\\' },
			{ row: 3, col: 3, kind: 'fixed-mirror', orientation: '/' },
			{ row: 3, col: 1, kind: 'fixed-mirror', orientation: '\\' },
			{ row: 4, col: 4, kind: 'target', color: 'red' },
		]);

		const result = traceBeams(grid);
		assert.equal(result.terminatedByLoopGuard, true);
		assert.equal(result.isSolved, false);
		assert.ok(result.segments.length > 0);
	});

	it('rotates rotatable cells and refuses to rotate fixed mirrors or walls', () => {
		const grid = makeGrid(3, 3, [
			{ row: 0, col: 0, kind: 'mirror', orientation: '/', solutionOrientation: '\\' },
			{ row: 0, col: 1, kind: 'fixed-mirror', orientation: '/' },
			{ row: 0, col: 2, kind: 'wall' },
		]);

		const rotated = rotateCellAt(grid, 0, 0);
		assert.ok(rotated !== null);
		assert.equal(rotated[0][0].orientation, '\\');

		assert.equal(rotateCellAt(grid, 0, 1), null);
		assert.equal(rotateCellAt(grid, 0, 2), null);

		const hint = findHintCell(grid);
		assert.deepEqual(hint, { row: 0, col: 0 });
	});
});
