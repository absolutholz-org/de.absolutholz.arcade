import type { SupportedLanguageCode } from '@arcade/lib-i18n/types/i18n.types';
import type { UserSession } from '@arcade/lib-user';
import type { PopoverAlign } from '../Popover/_Popover.types';

export interface HeaderUserMenuProps {
	/**
	 * Active language code for localized strings.
	 */
	lang?: SupportedLanguageCode;

	/**
	 * Alignment for the popover menu relative to the trigger.
	 * @default 'bottom'
	 */
	align?: PopoverAlign;

	/**
	 * Optional explicit user session override (primarily used for test harnesses and preview isolation).
	 * Defaults to the reactive global `useUserSession()` hook.
	 */
	session?: UserSession;

	/**
	 * Optional additional CSS class name.
	 */
	className?: string;

	/**
	 * Optional DOM ID attribute.
	 */
	id?: string;
}
