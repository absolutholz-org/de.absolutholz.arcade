import { type ElementType, type ForwardedRef, forwardRef } from 'react';
import * as S from './_Button.styles';
import type { ButtonProps } from './_Button.types';

function ButtonInner<C extends ElementType = 'button'>(
	{
		variant = 'primary',
		size = 'md',
		leadingIcon,
		trailingIcon,
		isIconOnly = false,
		as,
		children,
		...restProps
	}: ButtonProps<C>,
	ref: ForwardedRef<HTMLButtonElement>,
) {
	const Component = as || 'button';
	const isButtonElement = Component === 'button';

	return (
		<S.Button
			ref={ref}
			as={Component}
			{...(isButtonElement
				? { type: (restProps as { type?: 'button' | 'submit' | 'reset' }).type || 'button' }
				: {})}
			data-variant={variant}
			data-size={size}
			data-icon-only={isIconOnly ? 'true' : undefined}
			{...restProps}
		>
			{leadingIcon && (
				<span data-slot="icon" aria-hidden="true">
					{leadingIcon}
				</span>
			)}
			{children && <span data-slot="content">{children}</span>}
			{trailingIcon && (
				<span data-slot="icon" aria-hidden="true">
					{trailingIcon}
				</span>
			)}
		</S.Button>
	);
}

/**
 * Interactive button component supporting primary, secondary, outline, and ghost variants,
 * flexible sizing, leading/trailing icon slots, and icon-only layouts.
 */
export const Button = forwardRef(ButtonInner) as <C extends ElementType = 'button'>(
	props: ButtonProps<C> & { ref?: ForwardedRef<HTMLElement> },
) => ReturnType<typeof ButtonInner>;
