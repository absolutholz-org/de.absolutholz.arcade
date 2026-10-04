export const STACK_DIRECTIONS = ['row', 'column', 'row-reverse', 'column-reverse'] as const;

export const STACK_ALIGNS = ['stretch', 'start', 'end', 'center', 'baseline'] as const;

export const STACK_JUSTIFIES = ['start', 'end', 'center', 'between', 'around', 'evenly'] as const;

export const STACK_ALIGN_MAP = {
	stretch: 'stretch',
	start: 'flex-start',
	end: 'flex-end',
	center: 'center',
	baseline: 'baseline',
} as const;

export const STACK_JUSTIFY_MAP = {
	start: 'flex-start',
	end: 'flex-end',
	center: 'center',
	between: 'space-between',
	around: 'space-around',
	evenly: 'space-evenly',
} as const;
