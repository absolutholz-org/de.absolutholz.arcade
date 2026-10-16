import { type ForwardedRef, forwardRef } from 'react';
import * as S from './_Badge.styles';
import type { BadgeProps } from './_Badge.types';

function BadgeInner(
	{ variant = 'neutral', size = 'md', leadingIcon, trailingIcon, children, ...restProps }: BadgeProps,
	ref: ForwardedRef<HTMLSpanElement>,
) {
	return (
		<S.Badge ref={ref} data-variant={variant} data-size={size} {...restProps}>
			{leadingIcon && (
				<span data-slot="icon" aria-hidden="true">
					{leadingIcon}
				</span>
			)}
			{children && <span data-slot="label">{children}</span>}
			{trailingIcon && (
				<span data-slot="icon" aria-hidden="true">
					{trailingIcon}
				</span>
			)}
		</S.Badge>
	);
}

/**
 * Generic inline badge primitive supporting semantic status variants,
 * sizing options, and leading/trailing icon slots.
 */
export const Badge = forwardRef(BadgeInner);
