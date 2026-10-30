import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import type { CellState, MoveAction } from './types.ts';

/**
 * Pure coordinate resolution and stroke generation matching NonogramBoard pointer logic.
 */
function resolveGridCoordinate(
	clientX: number,
	clientY: number,
	gridRect: { left: number; top: number; width: number; height: number },
	cols: number,
	rows: number,
): { col: number; row: number } {
	const clampedX = Math.max(0, Math.min(gridRect.width - 1, clientX - gridRect.left));
	const clampedY = Math.max(0, Math.min(gridRect.height - 1, clientY - gridRect.top));
	const col = Math.min(cols - 1, Math.max(0, Math.floor((clampedX / gridRect.width) * cols)));
	const row = Math.min(rows - 1, Math.max(0, Math.floor((clampedY / gridRect.height) * rows)));
	return { col, row };
}

function calculateDragPreview(
	startCol: number,
	startRow: number,
	curCol: number,
	curRow: number,
	targetState: CellState,
	cols: number,
	rows: number,
): Record<number, CellState> {
	let lockedAxis: 'horizontal' | 'vertical' = 'horizontal';
	if (curCol !== startCol && curRow === startRow) {
		lockedAxis = 'horizontal';
	} else if (curRow !== startRow && curCol === startCol) {
		lockedAxis = 'vertical';
	} else if (Math.abs(curRow - startRow) > Math.abs(curCol - startCol)) {
		lockedAxis = 'vertical';
	}

	const preview: Record<number, CellState> = {};
	if (lockedAxis === 'horizontal') {
		const minC = Math.max(0, Math.min(startCol, curCol));
		const maxC = Math.min(cols - 1, Math.max(startCol, curCol));
		for (let c = minC; c <= maxC; c++) {
			preview[startRow * cols + c] = targetState;
		}
	} else {
		const minR = Math.max(0, Math.min(startRow, curRow));
		const maxR = Math.min(rows - 1, Math.max(startRow, curRow));
		for (let r = minR; r <= maxR; r++) {
			preview[r * cols + startCol] = targetState;
		}
	}
	return preview;
}

function buildStrokeActions(previewMap: Record<number, CellState>, cells: CellState[], cols: number): MoveAction[] {
	const actions: MoveAction[] = [];
	for (const [idxStr, nextState] of Object.entries(previewMap)) {
		const idx = Number(idxStr);
		if (idx < 0 || idx >= cells.length) continue;
		const col = idx % cols;
		const row = Math.floor(idx / cols);
		const previousState = cells[idx];
		if (previousState !== nextState) {
			actions.push({ col, row, previousState, nextState });
		}
	}
	return actions;
}

describe('Nonogram Drag Selection & Boundary Handling', () => {
	const cols = 15;
	const rows = 15;
	const gridRect = { left: 100, top: 100, width: 300, height: 300 }; // 20px per cell

	it('resolves coordinates accurately across all rows and columns', () => {
		// Top-left cell (0, 0)
		const origin = resolveGridCoordinate(105, 105, gridRect, cols, rows);
		assert.deepEqual(origin, { col: 0, row: 0 });

		// Bottom-right cell (14, 14)
		const bottomRight = resolveGridCoordinate(395, 395, gridRect, cols, rows);
		assert.deepEqual(bottomRight, { col: 14, row: 14 });

		// Row 10, Col 12
		const inner = resolveGridCoordinate(100 + 12 * 20 + 5, 100 + 10 * 20 + 5, gridRect, cols, rows);
		assert.deepEqual(inner, { col: 12, row: 10 });
	});

	it('safely clamps dragging beyond bottom and right boundaries onto cell (14, 14)', () => {
		// Dragging 50px below the bottom edge into toolbar/controls area
		const overBottom = resolveGridCoordinate(390, 450, gridRect, cols, rows);
		assert.equal(overBottom.col, 14);
		assert.equal(overBottom.row, 14);

		// Dragging far past the right edge
		const overRight = resolveGridCoordinate(550, 390, gridRect, cols, rows);
		assert.equal(overRight.col, 14);
		assert.equal(overRight.row, 14);

		// Dragging negative (past top-left)
		const overTopLeft = resolveGridCoordinate(20, 20, gridRect, cols, rows);
		assert.equal(overTopLeft.col, 0);
		assert.equal(overTopLeft.row, 0);
	});

	it('calculates vertical drag stroke to the very last row (row 14) of 15x15 board', () => {
		const preview = calculateDragPreview(5, 10, 5, 14, 'filled', cols, rows);
		const cellIndices = Object.keys(preview)
			.map(Number)
			.sort((a, b) => a - b);

		assert.equal(cellIndices.length, 5); // rows 10, 11, 12, 13, 14
		assert.deepEqual(cellIndices, [10 * cols + 5, 11 * cols + 5, 12 * cols + 5, 13 * cols + 5, 14 * cols + 5]);

		const cells: CellState[] = new Array(cols * rows).fill('empty');
		const actions = buildStrokeActions(preview, cells, cols);
		assert.equal(actions.length, 5);
		assert.equal(actions[actions.length - 1].row, 14);
		assert.equal(actions[actions.length - 1].col, 5);
		assert.equal(actions[actions.length - 1].nextState, 'filled');
	});

	it('calculates horizontal drag stroke along bottom row 14 to column 14', () => {
		const preview = calculateDragPreview(8, 14, 14, 14, 'crossed', cols, rows);
		const cellIndices = Object.keys(preview)
			.map(Number)
			.sort((a, b) => a - b);

		assert.equal(cellIndices.length, 7); // cols 8 through 14 on row 14
		assert.equal(cellIndices[cellIndices.length - 1], 14 * cols + 14);

		const cells: CellState[] = new Array(cols * rows).fill('empty');
		const actions = buildStrokeActions(preview, cells, cols);
		assert.equal(actions.length, 7);
		assert.equal(actions[actions.length - 1].row, 14);
		assert.equal(actions[actions.length - 1].col, 14);
		assert.equal(actions[actions.length - 1].nextState, 'crossed');
	});

	it('builds stroke actions safely when tapping a single cell without dragging', () => {
		const preview = calculateDragPreview(14, 14, 14, 14, 'filled', cols, rows);
		assert.deepEqual(preview, { [14 * cols + 14]: 'filled' });

		const cells: CellState[] = new Array(cols * rows).fill('empty');
		const actions = buildStrokeActions(preview, cells, cols);
		assert.equal(actions.length, 1);
		assert.equal(actions[0].col, 14);
		assert.equal(actions[0].row, 14);
		assert.equal(actions[0].previousState, 'empty');
		assert.equal(actions[0].nextState, 'filled');
	});
});
