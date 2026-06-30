import type { ElementType, MouseEvent } from 'react';
import * as S from './_Button.styles';
import type {
	ButtonProps,
	ResolvedAnchorButtonProps,
	ResolvedNativeButtonProps,
} from './_Button.types';

/**
 * A highly accessible Button component that dynamically renders as either a `<button>`
 * or an `<a>` anchor based on the presence of the `href` prop.
 */
export function Button(props: ButtonProps) {
	const {
		variant = 'solid',
		accent = 'primary',
		display = 'inline',
		leadingIcon,
		trailingIcon,
		children,
		className,
		id,
		title,
		onClick,
		'aria-label': ariaLabel,
		'aria-expanded': ariaExpanded,
		'aria-haspopup': ariaHasPopup,
		'aria-controls': ariaControls,
	} = props;

	const hasHref = props.href !== undefined;

	if (hasHref) {
		const { href, target, rel } = props as ResolvedAnchorButtonProps;
		const StyledLink = S.StyledButton as unknown as ElementType;
		return (
			<StyledLink
				as="a"
				href={href}
				target={target}
				rel={rel}
				className={className}
				id={id}
				title={title}
				onClick={onClick as (e: MouseEvent<HTMLAnchorElement>) => void}
				aria-label={ariaLabel}
				aria-expanded={ariaExpanded}
				aria-haspopup={ariaHasPopup}
				aria-controls={ariaControls}
				$variant={variant}
				$accent={accent}
				$display={display}
			>
				{leadingIcon}
				<span>{children}</span>
				{trailingIcon}
			</StyledLink>
		);
	}

	const { disabled, type = 'button' } = props as ResolvedNativeButtonProps;

	return (
		<S.StyledButton
			type={type}
			disabled={disabled}
			className={className}
			id={id}
			title={title}
			onClick={onClick as (e: MouseEvent<HTMLButtonElement>) => void}
			aria-label={ariaLabel}
			aria-expanded={ariaExpanded}
			aria-haspopup={ariaHasPopup}
			aria-controls={ariaControls}
			$variant={variant}
			$accent={accent}
			$display={display}
		>
			{leadingIcon}
			<span>{children}</span>
			{trailingIcon}
		</S.StyledButton>
	);
}
