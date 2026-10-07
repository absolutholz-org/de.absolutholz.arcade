import { type KeyboardEvent, useCallback, useEffect, useId, useRef, useState } from 'react';
import type { CollapsibleListboxOption } from './_CollapsibleListbox.types';

interface UseCollapsibleListboxOptions<T extends string = string> {
	activeId?: T;
	defaultActiveId?: T;
	onSelect?: (id: T) => void;
	options: CollapsibleListboxOption<T>[];
	id?: string;
}

export function useCollapsibleListbox<T extends string = string>({
	activeId,
	defaultActiveId,
	onSelect,
	options,
	id: customId,
}: UseCollapsibleListboxOptions<T>) {
	const rawId = useId();
	const listboxId = customId || `listbox-${rawId.replace(/:/g, '')}`;
	const triggerId = `${listboxId}-trigger`;

	const [uncontrolledActiveId, setUncontrolledActiveId] = useState<T>(
		defaultActiveId ?? activeId ?? (options[0]?.id as T),
	);
	const [isOpen, setIsOpen] = useState(false);
	const wasOpenRef = useRef(false);

	const resolvedActiveId = activeId !== undefined ? activeId : uncontrolledActiveId;
	const activeOption = options.find((opt) => opt.id === resolvedActiveId) ?? options[0];

	const getOptionDomId = useCallback((optionId: string) => `${listboxId}-opt-${optionId}`, [listboxId]);

	const handleOpenChange = useCallback((open: boolean) => {
		setIsOpen(open);
	}, []);

	// Move focus to the active option when opened, or restore focus to the trigger when closed
	useEffect(() => {
		if (isOpen) {
			const targetId = resolvedActiveId || options[0]?.id;
			if (targetId) {
				const domId = getOptionDomId(targetId);
				requestAnimationFrame(() => {
					document.getElementById(domId)?.focus();
				});
			}
		} else if (wasOpenRef.current) {
			const activeEl = document.activeElement;
			if (!activeEl || activeEl === document.body || activeEl.closest?.(`[id="${listboxId}"]`)) {
				document.getElementById(triggerId)?.focus();
			}
		}
		wasOpenRef.current = isOpen;
	}, [isOpen, resolvedActiveId, options, getOptionDomId, listboxId, triggerId]);

	const focusOptionAtIndex = useCallback(
		(index: number) => {
			const target = options[index];
			if (target) {
				const domId = getOptionDomId(target.id);
				document.getElementById(domId)?.focus();
			}
		},
		[options, getOptionDomId],
	);

	const handleOptionClick = useCallback(
		(id: T) => {
			if (activeId === undefined) {
				setUncontrolledActiveId(id);
			}
			onSelect?.(id);
		},
		[activeId, onSelect],
	);

	const handleTriggerKeyDown = useCallback(
		(event: KeyboardEvent<HTMLButtonElement>) => {
			if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
				event.preventDefault();
				if (!isOpen) {
					event.currentTarget.click();
				}
			}
		},
		[isOpen],
	);

	const handleOptionKeyDown = useCallback(
		(event: KeyboardEvent<HTMLButtonElement>, currentIndex: number) => {
			switch (event.key) {
				case 'ArrowDown': {
					event.preventDefault();
					const nextIndex = (currentIndex + 1) % options.length;
					focusOptionAtIndex(nextIndex);
					break;
				}
				case 'ArrowUp': {
					event.preventDefault();
					const prevIndex = (currentIndex - 1 + options.length) % options.length;
					focusOptionAtIndex(prevIndex);
					break;
				}
				case 'Home': {
					event.preventDefault();
					focusOptionAtIndex(0);
					break;
				}
				case 'End': {
					event.preventDefault();
					focusOptionAtIndex(options.length - 1);
					break;
				}
				default: {
					if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
						const char = event.key.toLowerCase();
						for (let i = 1; i <= options.length; i++) {
							const idx = (currentIndex + i) % options.length;
							const opt = options[idx];
							const text = typeof opt.label === 'string' ? opt.label : opt.title || opt.id;
							if (text.toLowerCase().startsWith(char)) {
								event.preventDefault();
								focusOptionAtIndex(idx);
								break;
							}
						}
					}
				}
			}
		},
		[options, focusOptionAtIndex],
	);

	return {
		activeOption,
		getOptionDomId,
		handleOpenChange,
		handleOptionClick,
		handleOptionKeyDown,
		handleTriggerKeyDown,
		isOpen,
		listboxId,
		resolvedActiveId,
		triggerId,
	};
}
