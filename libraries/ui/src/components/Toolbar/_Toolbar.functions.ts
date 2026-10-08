import { TOOLBAR_FOCUSABLE_SELECTOR } from './_Toolbar.constants';

/**
 * Checks whether an element is disabled either natively or via ARIA attributes.
 */
function isItemDisabled(element: HTMLElement): boolean {
	return (
		(element as HTMLButtonElement).disabled === true ||
		element.getAttribute('aria-disabled') === 'true' ||
		element.hasAttribute('disabled')
	);
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
 * Queries all enabled focusable controls contained within the toolbar element.
 */
export function getFocusableItems(container: HTMLElement | null): HTMLElement[] {
	if (!container) return [];
	const items = Array.from(container.querySelectorAll<HTMLElement>(TOOLBAR_FOCUSABLE_SELECTOR));
	return items.filter((item) => !isItemDisabled(item));
}

export { isItemDisabled, isNativeTextOrRangeInput };
