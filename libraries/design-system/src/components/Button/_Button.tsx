import React from 'react';
import type { ElementType, MouseEvent } from 'react';
import * as S from './_Button.styles';
import type {
	ButtonProps,
	ResolvedAnchorButtonProps,
	ResolvedNativeButtonProps,
} from './_Button.types';

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

	const renderIcon = (icon: React.ReactNode) => {
		if (!icon) return null;
		if (React.isValidElement(icon)) {
			return (
				<S.IconWrapper>
					{React.cloneElement(icon as React.ReactElement<{ size?: string }>, {
						size: 'inherit',
					})}
				</S.IconWrapper>
			);
		}
		return <S.IconWrapper>{icon}</S.IconWrapper>;
	};

	if (hasHref) {
		const { href, target, rel } = props as ResolvedAnchorButtonProps;
		const StyledLink = S.StyledButton as unknown as ElementType;
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
					{renderIcon(leadingIcon)}
					<span>{children}</span>
					{renderIcon(trailingIcon)}
				</StyledLink>
			</>
		);
	}

	const { disabled, type = 'button' } = props as ResolvedNativeButtonProps;

	return (
		<>
			<GradientDefs />
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
				{renderIcon(leadingIcon)}
				<span>{children}</span>
				{renderIcon(trailingIcon)}
			</S.StyledButton>
		</>
	);
}
