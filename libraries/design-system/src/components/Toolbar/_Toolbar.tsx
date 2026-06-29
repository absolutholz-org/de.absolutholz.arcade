import { useCallback, useEffect, useId, useState } from 'react';

import { EMOJI_ICONS } from './_Toolbar.constants';
import {
	ToolbarContext,
	useToolbar,
	useToolbarNavigation,
} from './_Toolbar.hooks';
import * as S from './_Toolbar.styles';
import type {
	ToolbarGroupProps,
	ToolbarItemProps,
	ToolbarProps,
} from './_Toolbar.types';

/**
 * Toolbar Root component that provides focus management via roving tabindex.
 * Implements role="toolbar" for standard accessibility.
 */
export function Toolbar({
	'aria-label': ariaLabel,
	children,
	className,
	id,
}: ToolbarProps) {
	const { handleKeyDown } = useToolbarNavigation();
	const [tabStopId, setTabStopId] = useState<string | null>(null);

	const registerItem = useCallback((itemId: string) => {
		setTabStopId((current) => (current === null ? itemId : current));
	}, []);

	const unregisterItem = useCallback((itemId: string) => {
		setTabStopId((current) => (current === itemId ? null : current));
	}, []);

	return (
		<ToolbarContext.Provider
			value={{ registerItem, setTabStopId, tabStopId, unregisterItem }}
		>
			<S.ToolbarRoot
				id={id}
				className={className}
				role="toolbar"
				aria-label={ariaLabel}
				onKeyDown={handleKeyDown}
			>
				{children}
			</S.ToolbarRoot>
		</ToolbarContext.Provider>
	);
}

/**
 * ToolbarGroup provides flex-based layout grouping for related toolbar items.
 * Uses system spacing tokens for consistent gaps.
 */
export function ToolbarGroup({ children, className, id }: ToolbarGroupProps) {
	return (
		<S.Group id={id} className={className}>
			{children}
		</S.Group>
	);
}

/**
 * Adaptive Toolbar Item that collapses to icon-only on mobile (< 768px).
 * Uses roving tabindex to ensure focus is managed correctly within the toolbar.
 */
export function ToolbarItem({
	ariaControls,
	ariaExpanded,
	ariaHasPopup,
	className,
	disabled,
	icon,
	id: providedId,
	label,
	onClick,
	variant = 'ghost',
}: ToolbarItemProps) {
	const generatedId = useId();
	const id = providedId || generatedId;

	const { registerItem, setTabStopId, tabStopId, unregisterItem } =
		useToolbar();

	useEffect(() => {
		if (!disabled) {
			registerItem(id);
		}
		return () => unregisterItem(id);
	}, [id, disabled, registerItem, unregisterItem]);

	const isActive = tabStopId === id;
	const emojiIcon = EMOJI_ICONS[icon] || '❓';

	return (
		<S.ItemButton
			data-toolbar-item="true"
			tabIndex={isActive ? 0 : -1}
			onClick={() => {
				setTabStopId(id);
				onClick?.();
			}}
			onFocus={() => setTabStopId(id)}
			disabled={disabled}
			$variant={variant}
			title={label}
			aria-label={label}
			aria-haspopup={ariaHasPopup}
			aria-controls={ariaControls}
			aria-expanded={ariaExpanded}
			className={className}
		>
			<span aria-hidden="true">{emojiIcon}</span>
			<S.ItemLabel>{label}</S.ItemLabel>
		</S.ItemButton>
	);
}
