import { type ReactNode, useId } from 'react';

export interface UseTextFieldOptions {
	id?: string;
	error?: ReactNode;
	helperText?: ReactNode;
	'aria-describedby'?: string;
	'aria-errormessage'?: string;
}

export function useTextField({
	id: propId,
	error,
	helperText,
	'aria-describedby': propAriaDescribedBy,
	'aria-errormessage': propAriaErrorMessage,
}: UseTextFieldOptions = {}) {
	const generatedId = useId();
	const id = propId || generatedId;
	const labelId = `${id}-label`;
	const helperId = `${id}-helper`;
	const errorId = `${id}-error`;

	const hasError = Boolean(error);
	const hasHelperText = Boolean(helperText);

	const describedByTokens: string[] = [];
	if (propAriaDescribedBy) {
		describedByTokens.push(propAriaDescribedBy);
	}
	if (hasError) {
		describedByTokens.push(errorId);
	}
	if (hasHelperText) {
		describedByTokens.push(helperId);
	}

	const ariaDescribedBy = describedByTokens.length > 0 ? describedByTokens.join(' ') : undefined;
	const ariaErrorMessage = hasError ? propAriaErrorMessage || errorId : undefined;

	return {
		id,
		labelId,
		helperId,
		errorId,
		isInvalid: hasError,
		ariaDescribedBy,
		ariaErrorMessage,
	};
}
