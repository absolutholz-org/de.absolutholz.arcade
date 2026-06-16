import type { SpacingKey } from '../../styles/spacing/spacing.utils';

export const CAROUSEL_VARIANTS = ['standard', 'full-bleed'] as const;
export const DEFAULT_CAROUSEL_VARIANT: (typeof CAROUSEL_VARIANTS)[number] =
	'standard';
export const DEFAULT_CAROUSEL_GAP: SpacingKey = 'md';
