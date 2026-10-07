import type { ChangeEvent, ComponentPropsWithoutRef, ReactNode } from 'react';
import type { SWITCH_SIZES } from './_Switch.constants';

export type SwitchSize = (typeof SWITCH_SIZES)[number];

export interface BaseSwitchProps {
	/**
	 * Unique identifier for the switch input element.
	 * If omitted, an accessible unique identifier is generated automatically.
	 */
	id?: string;
	/**
	 * Visual label text or node displayed beside the switch.
	 */
	label?: ReactNode;
	/**
	 * Controlled checked state of the switch.
	 */
	checked?: boolean;
	/**
	 * Default checked state for uncontrolled usage.
	 */
	defaultChecked?: boolean;
	/**
	 * Callback triggered when switch checked state toggles.
	 */
	onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
	/**
	 * Disables user interaction and applies dimmed visual styling.
	 */
	disabled?: boolean;
	/**
	 * Sizing preset dictating track and thumb dimensions.
	 */
	size?: SwitchSize;
	/**
	 * Stretches switch container to span 100% width of parent container.
	 */
	fullWidth?: boolean;
}

export type SwitchProps = BaseSwitchProps &
	Omit<ComponentPropsWithoutRef<'input'>, keyof BaseSwitchProps | 'style' | 'type' | 'size'>;

/**
 * Backward-compatible alias for SwitchProps.
 */
export type ISwitch = SwitchProps;
