import type { ReactNode } from 'react';
import type { BaseLayoutProps } from '../BaseLayout/_BaseLayout.types';

export interface BaseLayoutWithSiteFooterProps extends BaseLayoutProps {
	/**
	 * Unconstrained main content slot.
	 */
	children?: ReactNode;
}
