import { useEffect, useRef } from 'react';
import { Button } from '../Button';
import { Icon } from '../Icon';
import type { IconName } from '../Icon/_Icon.types';
import { toast } from './_Toast.functions';
import { useToastQueue, useToastTimer } from './_Toast.hooks';
import * as S from './_Toast.styles';
import type { ToastContainerProps, ToastItemProps, ToastVariant } from './_Toast.types';

const DEFAULT_VARIANT_ICONS: Record<ToastVariant, IconName> = {
	info: 'info',
	success: 'check',
	warning: 'alert-circle',
	achievement: 'trophy',
};

/**
 * Individual dismissible toast notification card adhering to accessibility and timer contracts.
 */
export function ToastItem({
	action,
	children,
	dismissAriaLabel = 'Dismiss notification',
	duration = 7000,
	emoji,
	icon,
	id,
	message,
	onDismiss,
	title,
	variant = 'info',
	...restProps
}: ToastItemProps) {
	const iconName = icon || DEFAULT_VARIANT_ICONS[variant];

	const { itemRef } = useToastTimer({
		duration,
		onDismiss: () => onDismiss(id),
	});

	return (
		<S.Toast_Item ref={itemRef} data-variant={variant} {...restProps}>
			<S.Toast_Icon aria-hidden="true">
				{emoji ? <Icon emoji={emoji} size="sm" /> : <Icon name={iconName} size="sm" />}
			</S.Toast_Icon>
			<S.Toast_Content>
				{title && <S.Toast_Title>{title}</S.Toast_Title>}
				<S.Toast_Message>{message}</S.Toast_Message>
				{action && (
					<S.Toast_Action>
						<Button variant="ghost" size="sm" onClick={action.onClick} aria-label={action.ariaLabel}>
							{action.label}
						</Button>
					</S.Toast_Action>
				)}
				{children}
			</S.Toast_Content>
			<S.Toast_DismissButton type="button" onClick={() => onDismiss(id)} aria-label={dismissAriaLabel}>
				<Icon name="close" size="xs" />
			</S.Toast_DismissButton>
		</S.Toast_Item>
	);
}

/**
 * Persistent live region host and presentation container for toast notifications.
 * Renders an empty persistent polite live region in the DOM to guarantee screen reader announcements.
 */
export function ToastContainer({
	dismissAriaLabel,
	maxVisibleToasts = 3,
	onDismiss: onDismissProp,
	position = 'top-right',
	toasts: controlledToasts,
	...restProps
}: ToastContainerProps) {
	const { activeToasts, dismiss } = useToastQueue(maxVisibleToasts);
	const hostRef = useRef<HTMLElement | null>(null);

	const items = controlledToasts ?? activeToasts;
	const handleDismiss = onDismissProp ?? dismiss;

	useEffect(() => {
		const host = hostRef.current;
		if (!host) return;

		if (!host.hasAttribute('popover')) {
			host.setAttribute('popover', 'manual');
		}

		if (items.length > 0) {
			if (typeof host.showPopover === 'function' && !host.matches(':popover-open')) {
				try {
					host.showPopover();
				} catch {
					// Fallback if browser throws on popover state
				}
			}
		} else if (typeof host.hidePopover === 'function' && host.matches(':popover-open')) {
			try {
				host.hidePopover();
			} catch {
				// Fallback if browser throws on popover state
			}
		}
	}, [items.length]);

	return (
		<S.Toast_Host
			ref={hostRef}
			// biome-ignore lint/a11y/useSemanticElements: ARIA role="status" is mandated by the architectural specification for persistent toast live regions
			role="status"
			aria-live="polite"
			aria-atomic="false"
			data-position={position}
			{...restProps}
		>
			<S.Toast_List>
				{items.map((item) => (
					<ToastItem
						key={item.id}
						{...item}
						dismissAriaLabel={item.dismissAriaLabel || dismissAriaLabel}
						onDismiss={handleDismiss}
					/>
				))}
			</S.Toast_List>
		</S.Toast_Host>
	);
}

export { ToastContainer as Toast, toast };
