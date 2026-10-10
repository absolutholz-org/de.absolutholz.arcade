import {
	PAGE_MAX_WIDTH,
	PAGE_MAX_WIDTH_EXTRA_WIDE,
	PAGE_MAX_WIDTH_SLIM,
	PAGE_MAX_WIDTH_WIDE,
} from '../../styles/constants';

export const PAGE_CONTAINER_VARIANTS = {
	extraWide: PAGE_MAX_WIDTH_EXTRA_WIDE,
	standard: PAGE_MAX_WIDTH_WIDE,
	wide: PAGE_MAX_WIDTH,
	slim: PAGE_MAX_WIDTH_SLIM,
	full: '100%',
} as const;
