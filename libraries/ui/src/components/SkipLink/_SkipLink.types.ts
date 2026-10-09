import type { ComponentPropsWithoutRef, ReactNode } from 'react';

export interface SkipLinkProps extends Omit<ComponentPropsWithoutRef<'a'>, 'style'> {
	/**
	 * Target anchor ID of the primary content landmark to skip to.
	 * @default '#main-content'
	 */
	href?: string;
	/**
	 * Visual label text or React element for the skip link.
	 */
	children: ReactNode;
}
