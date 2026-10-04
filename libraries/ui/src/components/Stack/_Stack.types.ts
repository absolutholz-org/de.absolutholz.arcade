import type { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react';
import type { SpacingKey } from '../../styles/spacing';
import type { STACK_ALIGNS, STACK_DIRECTIONS, STACK_JUSTIFIES } from './_Stack.constants';

export type StackDirection = (typeof STACK_DIRECTIONS)[number];
export type StackAlign = (typeof STACK_ALIGNS)[number];
export type StackJustify = (typeof STACK_JUSTIFIES)[number];

export interface BaseStackProps<C extends ElementType = 'div'> {
	/**
	 * Cross-axis alignment.
	 * @default 'stretch'
	 */
	align?: StackAlign;
	/**
	 * Children elements.
	 */
	children?: ReactNode;
	/**
	 * HTML element type or React component (legacy alias of 'as').
	 */
	component?: C;
	/**
	 * HTML element type or React component.
	 * @default 'div'
	 */
	as?: C;
	/**
	 * Optional custom cross-axis spacing when items wrap.
	 */
	crossSpacing?: SpacingKey;
	/**
	 * Flex direction.
	 * @default 'column'
	 */
	direction?: StackDirection;
	/**
	 * Main-axis alignment.
	 * @default 'start'
	 */
	justify?: StackJustify;
	/**
	 * Spacing between items.
	 * @default 'md'
	 */
	spacing?: SpacingKey;
	/**
	 * Whether the flex items should wrap onto multiple lines.
	 * @default false
	 */
	wrap?: boolean;
	/**
	 * Whether the stack spans the full width of its parent container.
	 * @default true
	 */
	fullWidth?: boolean;
	/**
	 * Whether to render as inline-flex instead of flex.
	 * @default false
	 */
	inline?: boolean;
}

export type StackProps<C extends ElementType = 'div'> = BaseStackProps<C> &
	Omit<ComponentPropsWithoutRef<C>, keyof BaseStackProps<ElementType> | 'style'>;

// Compatibility type alias to match user's expected interface name
export type IStack = StackProps<'div'>;
