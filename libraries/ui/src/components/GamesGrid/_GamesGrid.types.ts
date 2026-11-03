import type { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react';

export interface GamesGridBaseProps {
	/** Grid items, typically GameCard components */
	children?: ReactNode;
	/** Optional class name */
	className?: string;
}

export type GamesGridProps<C extends ElementType = 'div'> = GamesGridBaseProps &
	Omit<ComponentPropsWithoutRef<C>, keyof GamesGridBaseProps | 'style'> & {
		as?: C;
	};
