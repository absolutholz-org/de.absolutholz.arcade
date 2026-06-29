import type { ComponentPropsWithoutRef, ReactNode } from 'react';

import type { TOOLBAR_ITEM_VARIANTS } from './_Toolbar.constants';

export type ToolbarItemVariant = (typeof TOOLBAR_ITEM_VARIANTS)[number];

export interface ToolbarContextValue {
	registerItem: (id: string) => void;
	setTabStopId: (id: string) => void;
	tabStopId: string | null;
	unregisterItem: (id: string) => void;
}

export interface ToolbarProps extends Omit<
	ComponentPropsWithoutRef<'div'>,
	'style'
> {
	'aria-label': string;
	children: ReactNode;
}

export interface ToolbarGroupProps extends Omit<
	ComponentPropsWithoutRef<'div'>,
	'style'
> {
	children: ReactNode;
}

export interface ToolbarItemProps extends Omit<
	ComponentPropsWithoutRef<'button'>,
	'style'
> {
	ariaControls?: string;
	ariaExpanded?: boolean;
	ariaHasPopup?: 'dialog' | 'menu';
	disabled?: boolean;
	icon: string;
	id?: string;
	label: string;
	onClick?: () => void;
	variant?: ToolbarItemVariant;
}

// Compatibility type aliases matching user's expected interface names
export type IToolbar = ToolbarProps;
export type IToolbarGroup = ToolbarGroupProps;
export type IToolbarItem = ToolbarItemProps;
export type IToolbarContext = ToolbarContextValue;
export type { ToolbarItemVariant as IToolbarItemVariant };
