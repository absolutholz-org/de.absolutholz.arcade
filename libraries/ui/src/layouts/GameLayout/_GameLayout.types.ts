import type { ReactNode } from 'react';
import type { PageContainerVariant } from '../../components/PageContainer/_PageContainer.types';
import type { BaseLayoutProps } from '../BaseLayout/_BaseLayout.types';

export interface GameLayoutProps extends BaseLayoutProps {
	/**
	 * Top navigation header zone. Typically receives <GameHeader />.
	 */
	header?: ReactNode;
	/**
	 * Optional sub-bar for board-level counters, hearts, or status meters.
	 */
	status?: ReactNode;
	/**
	 * Main interactive board/canvas content area.
	 */
	children: ReactNode;
	/**
	 * Bottom dock for high-frequency game controls (e.g. numeric keypad, action buttons).
	 */
	toolbar?: ReactNode;
	/**
	 * Optional subtle footer row.
	 */
	footer?: ReactNode;
	/**
	 * Layout width variant constraining container width on wide screens.
	 * @default 'standard'
	 */
	containerWidth?: PageContainerVariant;
}
