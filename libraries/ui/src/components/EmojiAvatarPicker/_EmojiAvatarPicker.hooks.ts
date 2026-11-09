import { isValidSingleGraphemeEmoji } from '@arcade/lib-user';
import { type KeyboardEvent, type MouseEvent, useCallback, useEffect, useId, useRef, useState } from 'react';
import { ARCADE_AVATAR_EMOJIS, GRID_COLUMNS } from './_EmojiAvatarPicker.constants';
import type { EmojiAvatarPickerProps } from './_EmojiAvatarPicker.types';

interface UseEmojiAvatarPickerOptions {
	value: EmojiAvatarPickerProps['value'];
	onChange: EmojiAvatarPickerProps['onChange'];
	id?: string;
}

export function useEmojiAvatarPicker({ value, onChange, id: customId }: UseEmojiAvatarPickerOptions) {
	const rawId = useId();
	const pickerId = customId || `emoji-picker-${rawId.replace(/:/g, '')}`;
	const triggerId = `${pickerId}-trigger`;
	const radiogroupId = `${pickerId}-radiogroup`;
	const customInputId = `${pickerId}-custom-input`;

	const resolvedValue = typeof value === 'string' ? value : value?.value || '👾';

	const [isOpen, setIsOpen] = useState(false);
	const [focusedIndex, setFocusedIndex] = useState(() => {
		const idx = ARCADE_AVATAR_EMOJIS.findIndex((e) => e.value === resolvedValue);
		return idx >= 0 ? idx : 0;
	});
	const [customInput, setCustomInput] = useState('');
	const [customError, setCustomError] = useState<string | null>(null);

	const wasOpenRef = useRef(false);
	const popoverContentRef = useRef<HTMLDivElement | null>(null);

	const getOptionDomId = useCallback((index: number) => `${pickerId}-option-${index}`, [pickerId]);

	const closePopover = useCallback(() => {
		if (popoverContentRef.current) {
			const popoverEl = popoverContentRef.current.closest?.('[popover]') as HTMLElement | null;
			if (popoverEl && typeof (popoverEl as unknown as { hidePopover?: () => void }).hidePopover === 'function') {
				(popoverEl as unknown as { hidePopover: () => void }).hidePopover();
			}
		}
	}, []);

	const selectEmoji = useCallback(
		(emojiValue: string) => {
			const trimmed = emojiValue.trim();
			if (!isValidSingleGraphemeEmoji(trimmed)) {
				setCustomError('Please enter a single valid emoji.');
				return;
			}
			onChange({ type: 'emoji', value: trimmed });
			setCustomError(null);
			setCustomInput('');
			closePopover();
		},
		[onChange, closePopover],
	);

	const handleOpenChange = useCallback((open: boolean) => {
		setIsOpen(open);
		if (!open) {
			setCustomError(null);
			setCustomInput('');
		}
	}, []);

	// Focus management: move focus to selected emoji on open, restore to trigger on close
	useEffect(() => {
		if (isOpen) {
			const idx = ARCADE_AVATAR_EMOJIS.findIndex((e) => e.value === resolvedValue);
			const targetIndex = idx >= 0 ? idx : 0;
			setFocusedIndex(targetIndex);
			requestAnimationFrame(() => {
				const el = document.getElementById(getOptionDomId(targetIndex));
				el?.focus();
			});
		} else if (wasOpenRef.current) {
			const activeEl = document.activeElement;
			if (!activeEl || activeEl === document.body || activeEl.closest?.(`[id="${radiogroupId}"]`)) {
				document.getElementById(triggerId)?.focus();
			}
		}
		wasOpenRef.current = isOpen;
	}, [isOpen, resolvedValue, getOptionDomId, radiogroupId, triggerId]);

	const focusOptionAtIndex = useCallback(
		(index: number) => {
			setFocusedIndex(index);
			requestAnimationFrame(() => {
				document.getElementById(getOptionDomId(index))?.focus();
			});
		},
		[getOptionDomId],
	);

	const handleOptionKeyDown = useCallback(
		(event: KeyboardEvent<HTMLButtonElement>, currentIndex: number) => {
			const total = ARCADE_AVATAR_EMOJIS.length;

			switch (event.key) {
				case 'ArrowRight': {
					event.preventDefault();
					const next = (currentIndex + 1) % total;
					focusOptionAtIndex(next);
					break;
				}
				case 'ArrowLeft': {
					event.preventDefault();
					const prev = (currentIndex - 1 + total) % total;
					focusOptionAtIndex(prev);
					break;
				}
				case 'ArrowDown': {
					event.preventDefault();
					const next = (currentIndex + GRID_COLUMNS) % total;
					focusOptionAtIndex(next);
					break;
				}
				case 'ArrowUp': {
					event.preventDefault();
					const prev = (currentIndex - GRID_COLUMNS + total) % total;
					focusOptionAtIndex(prev);
					break;
				}
				case 'Home': {
					event.preventDefault();
					focusOptionAtIndex(0);
					break;
				}
				case 'End': {
					event.preventDefault();
					focusOptionAtIndex(total - 1);
					break;
				}
				case 'Enter':
				case ' ': {
					event.preventDefault();
					selectEmoji(ARCADE_AVATAR_EMOJIS[currentIndex].value);
					break;
				}
				default:
					break;
			}
		},
		[focusOptionAtIndex, selectEmoji],
	);

	const handleCustomApply = useCallback(
		(event?: MouseEvent | KeyboardEvent) => {
			event?.preventDefault();
			event?.stopPropagation();

			const trimmed = customInput.trim();
			if (!trimmed) {
				return;
			}

			if (isValidSingleGraphemeEmoji(trimmed)) {
				selectEmoji(trimmed);
			} else {
				setCustomError('Please enter a single valid emoji.');
			}
		},
		[customInput, selectEmoji],
	);

	const handleCustomInputKeyDown = useCallback(
		(event: KeyboardEvent<HTMLInputElement>) => {
			if (event.key === 'Enter') {
				handleCustomApply(event);
			}
		},
		[handleCustomApply],
	);

	const handleCustomInputChange = useCallback((val: string) => {
		setCustomInput(val);
		setCustomError(null);
	}, []);

	return {
		currentEmoji: resolvedValue,
		customError,
		customInput,
		customInputId,
		focusedIndex,
		getOptionDomId,
		handleCustomApply,
		handleCustomInputChange,
		handleCustomInputKeyDown,
		handleOpenChange,
		handleOptionKeyDown,
		isOpen,
		pickerId,
		popoverContentRef,
		radiogroupId,
		selectEmoji,
		triggerId,
	};
}
