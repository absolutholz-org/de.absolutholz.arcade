import { themeColor } from '@arcade/lib-ui/styles/theme/theme.utils';

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
		color: themeColor('rainbow-1'),
		bgLight: `oklch(from ${themeColor('rainbow-1')} l c h / 0.18)`,
		shape: 'circle',
		icon: '●',
		shapeKey: 'tools.table-compass.shapes.circle',
	},
	{
		id: 2,
		defaultNameKey: 'Player 2',
		color: themeColor('rainbow-7'),
		bgLight: `oklch(from ${themeColor('rainbow-7')} l c h / 0.18)`,
		shape: 'square',
		icon: '■',
		shapeKey: 'tools.table-compass.shapes.square',
	},
	{
		id: 3,
		defaultNameKey: 'Player 3',
		color: themeColor('rainbow-4'),
		bgLight: `oklch(from ${themeColor('rainbow-4')} l c h / 0.18)`,
		shape: 'triangle',
		icon: '▲',
		shapeKey: 'tools.table-compass.shapes.triangle',
	},
	{
		id: 4,
		defaultNameKey: 'Player 4',
		color: themeColor('rainbow-3'),
		bgLight: `oklch(from ${themeColor('rainbow-3')} l c h / 0.18)`,
		shape: 'diamond',
		icon: '◆',
		shapeKey: 'tools.table-compass.shapes.diamond',
	},
	{
		id: 5,
		defaultNameKey: 'Player 5',
		color: themeColor('rainbow-6'),
		bgLight: `oklch(from ${themeColor('rainbow-6')} l c h / 0.18)`,
		shape: 'star',
		icon: '★',
		shapeKey: 'tools.table-compass.shapes.star',
	},
	{
		id: 6,
		defaultNameKey: 'Player 6',
		color: themeColor('rainbow-2'),
		bgLight: `oklch(from ${themeColor('rainbow-2')} l c h / 0.18)`,
		shape: 'pentagon',
		icon: '⬟',
		shapeKey: 'tools.table-compass.shapes.pentagon',
	},
	{
		id: 7,
		defaultNameKey: 'Player 7',
		color: themeColor('rainbow-5'),
		bgLight: `oklch(from ${themeColor('rainbow-5')} l c h / 0.18)`,
		shape: 'hexagon',
		icon: '⬢',
		shapeKey: 'tools.table-compass.shapes.hexagon',
	},
	{
		id: 8,
		defaultNameKey: 'Player 8',
		color: themeColor('rainbow-8'),
		bgLight: `oklch(from ${themeColor('rainbow-8')} l c h / 0.18)`,
		shape: 'cross',
		icon: '✚',
		shapeKey: 'tools.table-compass.shapes.cross',
	},
] as const;

export const COUNTDOWN_DURATION_MS = 2000;
export const STORAGE_KEY = 'arcade::table-compass::v1';
export const MIN_PLAYERS = 2;
export const MAX_PLAYERS = 8;
