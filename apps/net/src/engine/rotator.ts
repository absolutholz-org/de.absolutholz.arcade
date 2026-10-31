import { DIR_EAST, DIR_NORTH, DIR_SOUTH, DIR_WEST, type Direction, type PortMask, type TileShape } from './types.ts';

/**
 * Pure bitwise 90-degree clockwise rotation of a 4-bit direction mask.
 * Bit mapping: N (1) -> E (2) -> S (4) -> W (8) -> N (1)
 */
export function rotateCW(mask: PortMask): PortMask {
	return ((mask << 1) | (mask >> 3)) & 0b1111;
}

/**
 * Pure bitwise 90-degree counter-clockwise rotation of a 4-bit direction mask.
 * Bit mapping: N (1) -> W (8) -> S (4) -> E (2) -> N (1)
 */
export function rotateCCW(mask: PortMask): PortMask {
	return ((mask >> 1) | ((mask & 1) << 3)) & 0b1111;
}

/**
 * Rotates a port mask in the specified direction.
 */
export function rotateMask(mask: PortMask, direction: 'cw' | 'ccw'): PortMask {
	return direction === 'cw' ? rotateCW(mask) : rotateCCW(mask);
}

/**
 * Checks whether a given direction bit is active in a port mask.
 */
export function hasDirection(mask: PortMask, dir: Direction): boolean {
	return (mask & dir) === dir;
}

/**
 * Calculates the number of active ports in a mask.
 */
export function countPorts(mask: PortMask): number {
	let count = 0;
	if (mask & DIR_NORTH) count++;
	if (mask & DIR_EAST) count++;
	if (mask & DIR_SOUTH) count++;
	if (mask & DIR_WEST) count++;
	return count;
}

/**
 * Classifies the wire geometry of a tile based on its active ports.
 */
export function getTileShape(mask: PortMask): TileShape {
	const count = countPorts(mask);
	switch (count) {
		case 0:
			return 'empty';
		case 1:
			return 'endpoint';
		case 2:
			// Opposite ports: N|S (5) or E|W (10)
			if (mask === (DIR_NORTH | DIR_SOUTH) || mask === (DIR_EAST | DIR_WEST)) {
				return 'straight';
			}
			return 'corner';
		case 3:
			return 'tee';
		case 4:
			return 'cross';
		default:
			return 'empty';
	}
}
