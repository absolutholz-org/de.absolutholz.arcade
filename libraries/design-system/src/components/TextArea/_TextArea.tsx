import * as S from './_TextArea.styles';
import type { TextAreaProps } from './_TextArea.types';

/**
 * TextArea component that provides auto-expanding height via CSS field-sizing
 * with a minimum block size of 5lh and configurable resize controls.
 */
export function TextArea({
	'aria-describedby': ariaDescribedby,
	'aria-invalid': ariaInvalid,
	'aria-label': ariaLabel,
	'aria-labelledby': ariaLabelledby,
	'aria-required': ariaRequired,
	autoComplete,
	autoFocus,
	className,
	defaultValue,
	disabled,
	id,
	maxLength,
	minLength,
	name,
	onBlur,
	onChange,
	onFocus,
	onKeyDown,
	placeholder,
	readOnly,
	required,
	resize = 'none',
	rows,
	tabIndex,
	value,
}: TextAreaProps) {
	return (
		<S.TextArea
			aria-describedby={ariaDescribedby}
			aria-invalid={ariaInvalid}
			aria-label={ariaLabel}
			aria-labelledby={ariaLabelledby}
			aria-required={ariaRequired}
			autoComplete={autoComplete}
			autoFocus={autoFocus}
			className={className}
			defaultValue={defaultValue}
			disabled={disabled}
			id={id}
			maxLength={maxLength}
			minLength={minLength}
			name={name}
			onBlur={onBlur}
			onChange={onChange}
			onFocus={onFocus}
			onKeyDown={onKeyDown}
			placeholder={placeholder}
			readOnly={readOnly}
			required={required}
			$resize={resize}
			rows={rows}
			tabIndex={tabIndex}
			value={value}
		/>
	);
}
