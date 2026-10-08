import { TOOLBAR_FOCUSABLE_SELECTOR } from './_Toolbar.constants';

/**
 * Checks whether an element is disabled either natively or via ARIA attributes.
 */
function isItemDisabled(element: HTMLElement): boolean {
	return (
		(element as HTMLButtonElement).disabled === true ||
		element.getAttribute('aria-disabled') === 'true' ||
		element.hasAttribute('disabled') ||
		element.getAttribute('aria-hidden') === 'true' ||
		element.hasAttribute('hidden')
	);
}

/**
 * Checks whether an element is located inside a nested composite widget (popover, menu, listbox, or dialog)
 * contained within the toolbar.
 */
function isInsideCompositeWidget(element: HTMLElement, container: HTMLElement): boolean {
	const popupAncestor = element.parentElement?.closest('[role="listbox"], [role="menu"], [role="dialog"], [popover]');
	return Boolean(popupAncestor && container.contains(popupAncestor));
}

/**
 * Checks if the focused element is a text input, number input, textarea, or slider,
 * which requires its own native cursor/arrow key navigation without roving tabindex interception.
 */
function isNativeTextOrRangeInput(element: HTMLElement): boolean {
	const tag = element.tagName.toLowerCase();
	if (tag === 'textarea' || tag === 'select') return true;
	if (tag === 'input') {
		const type = (element as HTMLInputElement).type.toLowerCase();
		return !['button', 'checkbox', 'radio', 'submit', 'reset', 'image', 'color'].includes(type);
	}
	return false;
}

/**
 * Queries all enabled focusable controls directly participating in the toolbar,
 * excluding controls housed inside nested popups, menus, listboxes, or dialogs.
 */
export function getFocusableItems(container: HTMLElement | null): HTMLElement[] {
	if (!container) return [];
	const items = Array.from(container.querySelectorAll<HTMLElement>(TOOLBAR_FOCUSABLE_SELECTOR));
	return items.filter((item) => !isItemDisabled(item) && !isInsideCompositeWidget(item, container));
}

export { isInsideCompositeWidget, isItemDisabled, isNativeTextOrRangeInput };
