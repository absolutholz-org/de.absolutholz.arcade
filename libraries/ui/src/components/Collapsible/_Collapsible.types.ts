import type { ComponentPropsWithoutRef, ReactNode, SyntheticEvent } from 'react';
import type { COLLAPSIBLE_VARIANTS } from './_Collapsible.constants';

export type CollapsibleVariant = (typeof COLLAPSIBLE_VARIANTS)[number];

export interface CollapsibleProps extends Omit<ComponentPropsWithoutRef<'details'>, 'style' | 'title'> {
	readonly title: ReactNode;
	readonly count?: number;
	readonly badge?: ReactNode;
	readonly variant?: CollapsibleVariant;
	readonly defaultOpen?: boolean;
	readonly open?: boolean;
	readonly onToggle?: (event: SyntheticEvent<HTMLDetailsElement>) => void;
	readonly children: ReactNode;
}
