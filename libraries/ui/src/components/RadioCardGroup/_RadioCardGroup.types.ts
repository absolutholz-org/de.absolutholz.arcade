import type { SupportedLanguageCode } from '@arcade/lib-i18n/types/i18n.types';
import type { ReactNode } from 'react';

export interface RadioCardGroupProps {
	/** Accessible group name rendered as the fieldset legend. */
	legend: string;
	/** Optional helper text linked to the group via aria-describedby. */
	description?: string;
	/** Visually hides the legend and description (group name stays available to assistive tech). */
	hideHeader?: boolean;
	/**
	 * `row` renders compact wrapping tiles for discrete choices; `swatch` renders a grid of preview cards.
	 * @default 'row'
	 */
	layout?: 'row' | 'swatch';
	/** Content language, enabling correct `hyphens: auto` behavior. */
	lang?: SupportedLanguageCode;
	className?: string;
	children: ReactNode;
}

export interface RadioCardOptionProps {
	/** Shared `name` for every option in the group. */
	name: string;
	value: string;
	checked: boolean;
	onChange: () => void;
	/** Label content (icon + text). */
	children: ReactNode;
	/** Decorative preview (e.g. swatches) rendered below the label; hidden from assistive tech. */
	preview?: ReactNode;
}
