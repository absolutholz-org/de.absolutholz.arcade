import type { ComponentPropsWithRef, ReactNode } from 'react';
import type { BADGE_SIZES, BADGE_VARIANTS } from './_Badge.constants';

export type BadgeVariant = (typeof BADGE_VARIANTS)[number];
export type BadgeSize = (typeof BADGE_SIZES)[number];

export interface BaseBadgeProps {
	/**
	 * Visual variant styling indicating category or state.
	 */
	variant?: BadgeVariant;
	/**
	 * Sizing scale option.
	 */
	size?: BadgeSize;
	/**
	 * Element rendered immediately before the main label content.
	 */
	leadingIcon?: ReactNode;
	/**
	 * Element rendered immediately after the main label content.
	 */
	trailingIcon?: ReactNode;
	/**
	 * Badge label text or child nodes.
	 */
	children?: ReactNode;
}

export type BadgeProps = BaseBadgeProps & Omit<ComponentPropsWithRef<'span'>, keyof BaseBadgeProps | 'style'>;
