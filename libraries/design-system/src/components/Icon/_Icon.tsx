import { ICON_CATALOG } from './_Icon.constants';
import * as S from './_Icon.styles';
import type { IconProps } from './_Icon.types';

/**
 * A highly accessible Icon component that renders inline SVGs from a local catalog or emojis.
 *
 * - When a `label` is provided, it behaves as an informative icon (role="img" with aria-label).
 * - When `label` is omitted, it behaves as a decorative icon (aria-hidden="true").
 */
export function Icon({
	size = 'md',
	label,
	name,
	emoji,
	className,
}: IconProps) {
	// Retrieve inline SVG component from catalog if name is defined
	const SvgComponent = name ? ICON_CATALOG[name] : null;
	const iconContent = SvgComponent ? <SvgComponent /> : emoji;

	// Calculate accessibility attributes based on label presence
	const accessibilityProps = label
		? {
				role: 'img',
				'aria-label': label,
			}
		: {
				'aria-hidden': true as const,
			};

	return (
		<S.Icon $size={size} className={className} {...accessibilityProps}>
			{iconContent}
		</S.Icon>
	);
}
