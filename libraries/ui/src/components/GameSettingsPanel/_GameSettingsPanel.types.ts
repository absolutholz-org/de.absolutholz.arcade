import type { GameSettingsConfig } from '@arcade/lib-games';
import type { SupportedLanguageCode } from '@arcade/lib-i18n/types/i18n.types';

export type GameSettingsPanelMode = 'compact' | 'detailed';

/**
 * Backward-compatible or flexible language prop accepting canonical codes or string codes.
 */
export type SupportedLanguage = SupportedLanguageCode | string;

export interface GameSettingsPanelProps<T extends Record<string, unknown> = Record<string, unknown>> {
	/**
	 * Declarative configuration schema for the game's settings.
	 */
	config: GameSettingsConfig<T>;

	/**
	 * Active language code for localization.
	 */
	lang: SupportedLanguage;

	/**
	 * Render mode:
	 * - 'compact' for in-game dialogs (only safe mid-round toggles).
	 * - 'detailed' for standalone settings pages (all fields, descriptions, appearance, reset).
	 */
	mode: GameSettingsPanelMode;

	/**
	 * Callback fired whenever a setting is modified by the user.
	 */
	onSettingsChange?: (newSettings: T) => void;

	/**
	 * Optional callback for resetting gameplay progress/stats in detailed mode.
	 */
	onResetProgress?: () => void;

	/**
	 * Optional CSS class name for styling container.
	 */
	className?: string;
}
