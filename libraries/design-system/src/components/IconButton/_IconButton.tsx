import type { ElementType, MouseEvent } from 'react';
import * as S from './_IconButton.styles';
import type {
	IconButtonProps,
	ResolvedAnchorIconButtonProps,
	ResolvedNativeIconButtonProps,
} from './_IconButton.types';

function GradientDefs() {
	return (
		<svg
			style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }}
			aria-hidden="true"
		>
			<defs>
				<linearGradient
					id="btn-grad-primary"
					x1="0%"
					y1="0%"
					x2="100%"
					y2="100%"
				>
					<stop offset="0%" stopColor="var(--color-accent)" />
					<stop
						offset="100%"
						stopColor="color-mix(in oklab, var(--color-accent-secondary), var(--color-accent) 60%)"
					/>
				</linearGradient>
				<linearGradient
					id="btn-grad-secondary"
					x1="0%"
					y1="0%"
					x2="100%"
					y2="100%"
				>
					<stop offset="0%" stopColor="var(--color-accent-secondary)" />
					<stop
						offset="100%"
						stopColor="color-mix(in oklab, var(--color-accent), var(--color-accent-secondary) 60%)"
					/>
				</linearGradient>
			</defs>
		</svg>
	);
}

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
			<>
				<GradientDefs />
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
			</>
		);
	}

	const { disabled, type = 'button' } = props as ResolvedNativeIconButtonProps;

	return (
		<>
			<GradientDefs />
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
		</>
	);
}
