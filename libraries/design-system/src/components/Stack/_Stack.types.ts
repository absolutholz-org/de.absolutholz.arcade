import type { ElementType, ComponentPropsWithoutRef, ReactNode } from 'react';
import type { SpacingKey } from '../../styles/spacing/spacing.utils';
import type {
	STACK_DIRECTIONS,
	STACK_ALIGNS,
	STACK_JUSTIFIES,
} from './_Stack.constants';

export type StackDirection = (typeof STACK_DIRECTIONS)[number];
export type StackAlign = (typeof STACK_ALIGNS)[number];
export type StackJustify = (typeof STACK_JUSTIFIES)[number];

export interface BaseStackProps<C extends ElementType = 'div'> {
	/**
	 * Cross-axis alignment.
	 */
	align?: StackAlign;
	/**
	 * Children elements.
	 */
	children?: ReactNode;
	/**
	 * HTML element type or React component (alias of 'as').
	 */
	component?: C;
	/**
	 * HTML element type or React component.
	 */
	as?: C;
	/**
	 * Optional custom cross-axis spacing.
	 */
	crossSpacing?: SpacingKey;
	/**
	 * Flex direction.
	 */
	direction?: StackDirection;
	/**
	 * Main-axis alignment.
	 */
	justify?: StackJustify;
	/**
	 * Spacing between items.
	 */
	spacing?: SpacingKey;
	/**
	 * Whether the flex items should wrap.
	 */
	wrap?: boolean;
}

export type StackProps<C extends ElementType = 'div'> = BaseStackProps<C> &
	Omit<
		ComponentPropsWithoutRef<C>,
		keyof BaseStackProps<ElementType> | 'style'
	>;

// Compatibility type alias to match user's expected interface name
export type IStack = StackProps<'div'>;
