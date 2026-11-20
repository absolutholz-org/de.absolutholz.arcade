import { type ComponentPropsWithRef, type ElementType, type ForwardedRef, type MouseEvent, forwardRef } from 'react';
import { VisuallyHidden } from '../VisuallyHidden';
import * as S from './_Badge.styles';
import type { BadgeProps, ButtonBadgeProps, LinkBadgeProps, StaticBadgeProps } from './_Badge.types';

const StyledBadgeButton = S.Badge as unknown as ElementType<ComponentPropsWithRef<'button'> & Record<string, unknown>>;
const StyledBadgeLink = S.Badge as unknown as ElementType<ComponentPropsWithRef<'a'> & Record<string, unknown>>;

function renderBadgeSlots(
	leadingIcon: BadgeProps['leadingIcon'],
	trailingIcon: BadgeProps['trailingIcon'],
	children: BadgeProps['children'],
	screenReaderLabel?: string,
) {
	return (
		<>
			{leadingIcon ? (
				<span data-slot="icon" aria-hidden="true">
					{leadingIcon}
				</span>
			) : null}
			{children !== undefined && children !== null && children !== false ? (
				screenReaderLabel ? (
					<span data-slot="label" aria-hidden="true">
						{children}
					</span>
				) : (
					<span data-slot="label">{children}</span>
				)
			) : null}
			{screenReaderLabel ? <VisuallyHidden>{screenReaderLabel}</VisuallyHidden> : null}
			{trailingIcon ? (
				<span data-slot="icon" aria-hidden="true">
					{trailingIcon}
				</span>
			) : null}
		</>
	);
}

function BadgeInner(props: BadgeProps, ref: ForwardedRef<HTMLElement>) {
	const variant = props.variant ?? 'subtle';
	const tone = props.tone ?? 'neutral';
	const size = props.size ?? 'md';
	const tabular = props.tabular ?? false;

	if (props.as === 'button') {
		const {
			type = 'button',
			pressed,
			disabled,
			ariaDisabled,
			onClick,
			'aria-label': ariaLabel,
			'aria-labelledby': ariaLabelledBy,
			'aria-describedby': ariaDescribedBy,
			'aria-controls': ariaControls,
			'aria-expanded': ariaExpanded,
			title,
			leadingIcon,
			trailingIcon,
			className,
			id,
			children,
		} = props as ButtonBadgeProps;

		const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
			if (ariaDisabled || disabled) {
				event.preventDefault();
				return;
			}
			onClick?.(event);
		};

		return (
			<StyledBadgeButton
				as="button"
				ref={ref as ForwardedRef<HTMLButtonElement>}
				id={id}
				className={className}
				type={type}
				disabled={disabled}
				aria-disabled={ariaDisabled ? 'true' : undefined}
				aria-pressed={pressed}
				aria-label={ariaLabel}
				aria-labelledby={ariaLabelledBy}
				aria-describedby={ariaDescribedBy}
				aria-controls={ariaControls}
				aria-expanded={ariaExpanded}
				title={title}
				onClick={handleClick}
				data-variant={variant}
				data-tone={tone}
				data-size={size}
				data-interactive="true"
				data-tabular={tabular ? 'true' : undefined}
			>
				{renderBadgeSlots(leadingIcon, trailingIcon, children)}
			</StyledBadgeButton>
		);
	}

	if (props.as === 'a') {
		const {
			href,
			current,
			target,
			rel,
			onClick,
			'aria-label': ariaLabel,
			'aria-labelledby': ariaLabelledBy,
			'aria-describedby': ariaDescribedBy,
			title,
			leadingIcon,
			trailingIcon,
			className,
			id,
			children,
		} = props as LinkBadgeProps;

		const ariaCurrent = current === true ? 'page' : current || undefined;

		return (
			<StyledBadgeLink
				as="a"
				ref={ref as ForwardedRef<HTMLAnchorElement>}
				id={id}
				className={className}
				href={href}
				target={target}
				rel={rel}
				aria-current={ariaCurrent}
				aria-label={ariaLabel}
				aria-labelledby={ariaLabelledBy}
				aria-describedby={ariaDescribedBy}
				title={title}
				onClick={onClick}
				data-variant={variant}
				data-tone={tone}
				data-size={size}
				data-interactive="true"
				data-tabular={tabular ? 'true' : undefined}
			>
				{renderBadgeSlots(leadingIcon, trailingIcon, children)}
			</StyledBadgeLink>
		);
	}

	const {
		screenReaderLabel,
		'aria-hidden': ariaHidden,
		leadingIcon,
		trailingIcon,
		className,
		id,
		children,
	} = props as StaticBadgeProps;

	return (
		<S.Badge
			as="span"
			ref={ref as ForwardedRef<HTMLSpanElement>}
			id={id}
			className={className}
			aria-hidden={ariaHidden}
			data-variant={variant}
			data-tone={tone}
			data-size={size}
			data-tabular={tabular ? 'true' : undefined}
		>
			{renderBadgeSlots(leadingIcon, trailingIcon, children, screenReaderLabel)}
		</S.Badge>
	);
}

/**
 * Canonical capsule primitive for static metadata/status tags and interactive toggle/link badges.
 */
export const Badge = forwardRef(BadgeInner);
