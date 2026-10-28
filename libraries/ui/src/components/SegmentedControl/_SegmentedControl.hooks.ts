import { useCallback, useRef } from 'react';

export interface SegmentedControlNavigableItem {
	id: string;
	disabled?: boolean;
}

export function useSegmentedControlNavigation({
	items,
	onChange,
}: {
	items: readonly SegmentedControlNavigableItem[];
	onChange: (id: string) => void;
}) {
	const itemRefs = useRef<Map<string, HTMLButtonElement | null>>(new Map());

	const setItemRef = useCallback((id: string, el: HTMLButtonElement | null) => {
		if (el) {
			itemRefs.current.set(id, el);
		} else {
			itemRefs.current.delete(id);
		}
	}, []);

	const enabledItems = items.filter((item) => !item.disabled);

	const handleKeyDown = useCallback(
		(event: React.KeyboardEvent<HTMLButtonElement>, currentId: string) => {
			const enabledIds = enabledItems.map((item) => item.id);
			if (enabledIds.length === 0) return;

			const currentIndex = enabledIds.indexOf(currentId);
			if (currentIndex === -1) return;

			let nextIndex = -1;

			switch (event.key) {
				case 'ArrowRight':
				case 'ArrowDown':
					event.preventDefault();
					nextIndex = (currentIndex + 1) % enabledIds.length;
					break;
				case 'ArrowLeft':
				case 'ArrowUp':
					event.preventDefault();
					nextIndex = (currentIndex - 1 + enabledIds.length) % enabledIds.length;
					break;
				case 'Home':
					event.preventDefault();
					nextIndex = 0;
					break;
				case 'End':
					event.preventDefault();
					nextIndex = enabledIds.length - 1;
					break;
				default:
					return;
			}

			if (nextIndex !== -1) {
				const nextId = enabledIds[nextIndex];
				onChange(nextId);
				const targetEl = itemRefs.current.get(nextId);
				if (targetEl) {
					targetEl.focus();
				}
			}
		},
		[enabledItems, onChange],
	);

	return {
		setItemRef,
		handleKeyDown,
	};
}
