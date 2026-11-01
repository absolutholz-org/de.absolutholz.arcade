export const MIN_TRAY_DICE = 1;
export const MAX_TRAY_DICE = 6;
export const DEFAULT_TRAY_DICE = 5;

export const DICE_COUNT_OPTIONS = [1, 2, 3, 4, 5, 6] as const;

export type TrayDiceCount = (typeof DICE_COUNT_OPTIONS)[number];

export const COUNT_SELECTOR_SEGMENTS = DICE_COUNT_OPTIONS.map((count) => ({
	id: count.toString(),
	label: `${count}d`,
	ariaLabel: `${count} ${count === 1 ? 'die' : 'dice'}`,
}));
