import type { ComponentPropsWithRef, ReactNode } from 'react';
import type { TEXT_FIELD_SIZES } from './_TextField.constants';

export type TextFieldSize = (typeof TEXT_FIELD_SIZES)[number];

export interface BaseTextFieldProps {
	/**
	 * Accessible label text for the input field.
	 */
	label?: ReactNode;

	/**
	 * Validation error message. When present, marks the field as invalid (aria-invalid="true")
	 * and links the error text via aria-errormessage and aria-describedby.
	 */
	error?: ReactNode;

	/**
	 * Informative helper text rendered beneath the input field.
	 */
	helperText?: ReactNode;

	/**
	 * Sizing preset dictating input height, padding, and font size.
	 */
	size?: TextFieldSize;

	/**
	 * Whether the field container should expand to fill 100% of its parent width.
	 */
	fullWidth?: boolean;

	/**
	 * Optional decorative or informative leading icon/element.
	 */
	leadingIcon?: ReactNode;

	/**
	 * Optional interactive or decorative trailing icon/element (e.g. password toggle).
	 */
	trailingIcon?: ReactNode;
}

export type TextFieldProps = BaseTextFieldProps &
	Omit<ComponentPropsWithRef<'input'>, keyof BaseTextFieldProps | 'style' | 'size'>;
