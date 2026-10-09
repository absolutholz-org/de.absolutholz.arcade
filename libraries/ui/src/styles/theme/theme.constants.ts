export const THEMESET_IDS = [
	'base',
	'christmas',
	'easter',
	'fast-food-fun',
	'july4th',
	'stpatricks',
	'cleveland-gridiron',
	'buckeye-pride',
	'germany',
	'halloween',
] as const;

export type ThemesetId = (typeof THEMESET_IDS)[number];

export const DEFAULT_THEMESET_ID: ThemesetId = 'base';
