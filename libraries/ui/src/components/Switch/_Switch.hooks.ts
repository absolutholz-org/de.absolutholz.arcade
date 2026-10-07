import { type ChangeEvent, useId, useState } from 'react';

export interface UseSwitchOptions {
	id?: string;
	checked?: boolean;
	defaultChecked?: boolean;
	disabled?: boolean;
	onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
}

export function useSwitch({
	id: propId,
	checked: controlledChecked,
	defaultChecked = false,
	disabled = false,
	onChange,
}: UseSwitchOptions = {}) {
	const generatedId = useId();
	const id = propId || generatedId;

	const isControlled = controlledChecked !== undefined;
	const [uncontrolledChecked, setUncontrolledChecked] = useState(defaultChecked);

	const isChecked = isControlled ? controlledChecked : uncontrolledChecked;

	const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
		if (disabled) {
			event.preventDefault();
			return;
		}

		if (!isControlled) {
			setUncontrolledChecked(event.target.checked);
		}

		onChange?.(event);
	};

	return {
		id,
		isChecked,
		handleChange,
	};
}
