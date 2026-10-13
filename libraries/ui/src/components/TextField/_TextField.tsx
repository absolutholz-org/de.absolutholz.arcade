import { type ForwardedRef, forwardRef } from 'react';
import { useTextField } from './_TextField.hooks';
import * as S from './_TextField.styles';
import type { TextFieldProps } from './_TextField.types';

function TextFieldInner(
	{
		id: propId,
		label,
		error,
		helperText,
		size = 'md',
		fullWidth = false,
		leadingIcon,
		trailingIcon,
		disabled = false,
		required = false,
		className,
		'aria-describedby': propAriaDescribedBy,
		'aria-errormessage': propAriaErrorMessage,
		...restProps
	}: TextFieldProps,
	ref: ForwardedRef<HTMLInputElement>,
) {
	const { id, labelId, errorId, helperId, isInvalid, ariaDescribedBy, ariaErrorMessage } = useTextField({
		id: propId,
		error,
		helperText,
		'aria-describedby': propAriaDescribedBy,
		'aria-errormessage': propAriaErrorMessage,
	});

	return (
		<S.TextField
			className={className}
			data-size={size}
			data-invalid={isInvalid ? 'true' : undefined}
			data-disabled={disabled ? 'true' : undefined}
			data-full-width={fullWidth ? 'true' : undefined}
		>
			{label && (
				<label htmlFor={id} id={labelId} data-slot="label">
					{label}
					{required && (
						<span data-slot="required" aria-hidden="true">
							*
						</span>
					)}
				</label>
			)}

			<div data-slot="input-wrapper">
				{leadingIcon && (
					<span data-slot="leading-icon" aria-hidden="true">
						{leadingIcon}
					</span>
				)}
				<input
					ref={ref}
					id={id}
					disabled={disabled}
					required={required}
					aria-invalid={isInvalid ? 'true' : undefined}
					aria-errormessage={ariaErrorMessage}
					aria-describedby={ariaDescribedBy}
					{...restProps}
				/>
				{trailingIcon && <span data-slot="trailing-icon">{trailingIcon}</span>}
			</div>

			{error && (
				<span id={errorId} data-slot="error" role="alert">
					{error}
				</span>
			)}

			{!error && helperText && (
				<span id={helperId} data-slot="helper">
					{helperText}
				</span>
			)}
		</S.TextField>
	);
}

/**
 * Accessible text input field with labels, helper texts, validation errors, and sizing options.
 * Complies strictly with WCAG 2.2 AA / BITV 2.0 standards.
 */
export const TextField = forwardRef(TextFieldInner);
