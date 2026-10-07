import type { ReactNode } from 'react';
import { ICON_CATALOG } from './_Icon.constants';
import * as S from './_Icon.styles';
import type { IconProps } from './_Icon.types';

/**
 * Icon component rendering inline SVGs, emojis, and short text glyphs
 * with dedicated sizing scales, icon accent support, and WCAG-compliant accessibility.
 */
export function Icon({ name, emoji, text, svg, size = 'md', label }: IconProps) {
	const isDecorative = !label;

	let content: ReactNode = null;
	if (name && name in ICON_CATALOG) {
		const SvgRenderer = ICON_CATALOG[name];
		content = <SvgRenderer />;
	} else if (svg) {
		content = svg;
	} else if (emoji) {
		content = emoji;
	} else if (text) {
		content = text.slice(0, 2);
	}

	return (
		<S.Icon
			$size={size}
			role={isDecorative ? undefined : 'img'}
			aria-label={label}
			aria-hidden={isDecorative ? true : undefined}
		>
			{content}
		</S.Icon>
	);
}
