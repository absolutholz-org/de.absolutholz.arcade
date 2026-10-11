import { useEffect, useId, useRef } from 'react';

export interface UsePauseOverlayParams {
	isOpen: boolean;
	onResume?: () => void;
	id?: string;
}

export function usePauseOverlay({ isOpen, onResume, id }: UsePauseOverlayParams) {
	const generatedId = useId();
	const overlayId = id || generatedId;
	const titleId = `${overlayId}-title`;
	const descriptionId = `${overlayId}-description`;
	const resumeButtonRef = useRef<HTMLButtonElement>(null);

	useEffect(() => {
		if (!isOpen) {
			return;
		}

		resumeButtonRef.current?.focus();

		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === 'Escape') {
				event.preventDefault();
				onResume?.();
			}
		};

		window.addEventListener('keydown', handleKeyDown);

		return () => {
			window.removeEventListener('keydown', handleKeyDown);
		};
	}, [isOpen, onResume]);

	return {
		titleId,
		descriptionId,
		resumeButtonRef,
	};
}
