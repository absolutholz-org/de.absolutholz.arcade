export type ShapeKey =
	| 'tools.table-compass.shapes.circle'
	| 'tools.table-compass.shapes.square'
	| 'tools.table-compass.shapes.triangle'
	| 'tools.table-compass.shapes.diamond'
	| 'tools.table-compass.shapes.star'
	| 'tools.table-compass.shapes.pentagon'
	| 'tools.table-compass.shapes.hexagon'
	| 'tools.table-compass.shapes.cross';

export interface PlayerConfig {
	readonly id: number;
	readonly defaultNameKey: string;
	readonly color: string;
	readonly bgLight: string;
	readonly shape: 'circle' | 'square' | 'triangle' | 'diamond' | 'star' | 'pentagon' | 'hexagon' | 'cross';
	readonly icon: string;
	readonly shapeKey: ShapeKey;
}

export const PLAYER_CONFIGS: readonly PlayerConfig[] = [
	{
		id: 1,
		defaultNameKey: 'Player 1',
		color: 'oklch(0.65 0.22 25)',
		bgLight: 'oklch(0.65 0.22 25 / 0.18)',
		shape: 'circle',
		icon: '●',
		shapeKey: 'tools.table-compass.shapes.circle',
	},
	{
		id: 2,
		defaultNameKey: 'Player 2',
		color: 'oklch(0.72 0.18 65)',
		bgLight: 'oklch(0.72 0.18 65 / 0.18)',
		shape: 'square',
		icon: '■',
		shapeKey: 'tools.table-compass.shapes.square',
	},
	{
		id: 3,
		defaultNameKey: 'Player 3',
		color: 'oklch(0.80 0.18 95)',
		bgLight: 'oklch(0.80 0.18 95 / 0.18)',
		shape: 'triangle',
		icon: '▲',
		shapeKey: 'tools.table-compass.shapes.triangle',
	},
	{
		id: 4,
		defaultNameKey: 'Player 4',
		color: 'oklch(0.70 0.20 145)',
		bgLight: 'oklch(0.70 0.20 145 / 0.18)',
		shape: 'diamond',
		icon: '◆',
		shapeKey: 'tools.table-compass.shapes.diamond',
	},
	{
		id: 5,
		defaultNameKey: 'Player 5',
		color: 'oklch(0.72 0.16 200)',
		bgLight: 'oklch(0.72 0.16 200 / 0.18)',
		shape: 'star',
		icon: '★',
		shapeKey: 'tools.table-compass.shapes.star',
	},
	{
		id: 6,
		defaultNameKey: 'Player 6',
		color: 'oklch(0.65 0.18 250)',
		bgLight: 'oklch(0.65 0.18 250 / 0.18)',
		shape: 'pentagon',
		icon: '⬟',
		shapeKey: 'tools.table-compass.shapes.pentagon',
	},
	{
		id: 7,
		defaultNameKey: 'Player 7',
		color: 'oklch(0.65 0.22 300)',
		bgLight: 'oklch(0.65 0.22 300 / 0.18)',
		shape: 'hexagon',
		icon: '⬢',
		shapeKey: 'tools.table-compass.shapes.hexagon',
	},
	{
		id: 8,
		defaultNameKey: 'Player 8',
		color: 'oklch(0.68 0.22 350)',
		bgLight: 'oklch(0.68 0.22 350 / 0.18)',
		shape: 'cross',
		icon: '✚',
		shapeKey: 'tools.table-compass.shapes.cross',
	},
] as const;

export const COUNTDOWN_DURATION_MS = 2000;
export const STORAGE_KEY = 'arcade::table-compass::v1';
export const MIN_PLAYERS = 2;
export const MAX_PLAYERS = 8;
