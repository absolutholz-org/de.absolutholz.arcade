import type { ElementType, MouseEvent } from 'react';
import * as S from './_IconButton.styles';
import type {
	IconButtonProps,
	ResolvedAnchorIconButtonProps,
	ResolvedNativeIconButtonProps,
} from './_IconButton.types';

/**
 * A highly accessible Icon Button component that renders a single icon child.
 * Behaves either as a `<button>` or an `<a>` anchor based on the presence of the `href` prop.
 * Enforces `aria-label` to guarantee screen-reader accessibility.
 */
export function IconButton(props: IconButtonProps) {
	const {
		variant = 'solid',
		accent = 'primary',
		display = 'inline',
		icon,
		'aria-label': ariaLabel,
		className,
		id,
		title,
		onClick,
		'aria-expanded': ariaExpanded,
		'aria-haspopup': ariaHasPopup,
		'aria-controls': ariaControls,
	} = props;

	const hasHref = props.href !== undefined;

	if (hasHref) {
		const { href, target, rel } = props as ResolvedAnchorIconButtonProps;
		const StyledLink = S.StyledIconButton as unknown as ElementType;
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
				{icon}
			</StyledLink>
		);
	}

	const { disabled, type = 'button' } = props as ResolvedNativeIconButtonProps;

	return (
		<S.StyledIconButton
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
			{icon}
		</S.StyledIconButton>
	);
}
