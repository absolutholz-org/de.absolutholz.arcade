import { VisuallyHidden } from '@arcade/lib-ui/components/VisuallyHidden';
import { styled } from '@linaria/react';
import { type JSX, useEffect, useRef } from 'react';
import { ALL_COLORS, type ColorIndex } from '../../engine/types.ts';

interface ColorDockProps {
	readonly currentColor: ColorIndex;
	readonly colors?: readonly ColorIndex[];
	readonly onSelectColor: (color: ColorIndex) => void;
	readonly disabled?: boolean;
	readonly showColorblindShapes: boolean;
	readonly gridId?: string;
}

const DockContainer = styled.section`
	display: block;
	width: 100%;
	max-width: 32rem;
	margin: 1.5rem auto 0;
`;

const DockList = styled.ul`
	display: grid;
	gap: 0.5rem;
	padding: 0;
	margin: 0;
	list-style: none;

	&[data-count='4'] {
		grid-template-columns: repeat(4, 1fr);
	}
	&[data-count='5'] {
		grid-template-columns: repeat(5, 1fr);
	}
	&[data-count='6'] {
		grid-template-columns: repeat(6, 1fr);
	}
`;

const ColorButton = styled.button`
	position: relative;
	display: grid;
	place-items: center;
	width: 100%;
	aspect-ratio: 1 / 1;
	min-width: 2.75rem;
	min-height: 2.75rem;
	border: 3px solid transparent;
	border-radius: 0.75rem;
	cursor: pointer;
	user-select: none;
	font-weight: 700;
	font-size: 1.25rem;
	box-shadow: 0 0.125rem 0.5rem rgba(0, 0, 0, 0.2);
	transition: transform 0.15s ease, border-color 0.15s ease, opacity 0.15s ease;

	&[data-color='0'] {
		background-color: var(--color-flood-color-0);
		color: var(--color-flood-color-0-fg);
	}
	&[data-color='1'] {
		background-color: var(--color-flood-color-1);
		color: var(--color-flood-color-1-fg);
	}
	&[data-color='2'] {
		background-color: var(--color-flood-color-2);
		color: var(--color-flood-color-2-fg);
	}
	&[data-color='3'] {
		background-color: var(--color-flood-color-3);
		color: var(--color-flood-color-3-fg);
	}
	&[data-color='4'] {
		background-color: var(--color-flood-color-4);
		color: var(--color-flood-color-4-fg);
	}
	&[data-color='5'] {
		background-color: var(--color-flood-color-5);
		color: var(--color-flood-color-5-fg);
	}

	&:hover:not(:disabled) {
		transform: translateY(-0.125rem);
		box-shadow: 0 0.25rem 0.75rem rgba(0, 0, 0, 0.3);
	}

	&:focus-visible {
		outline: 3px solid var(--arcade-focus, oklch(0.75 0.18 150));
		outline-offset: 3px;
	}

	&[data-current='true'] {
		opacity: 0.35;
		cursor: not-allowed;
		border-color: var(--color-flood-board-border, oklch(0.5 0.03 260));
		transform: none;
	}

	&:disabled {
		opacity: 0.3;
		cursor: not-allowed;
		transform: none;
	}
`;

const BadgeSpan = styled.span`
	position: absolute;
	top: 0.25rem;
	right: 0.25rem;
	font-size: 0.625rem;
	line-height: 1;
	opacity: 0.75;
	font-weight: 800;
`;

const SHAPE_GLYPHS: Record<ColorIndex, string> = {
	0: '●',
	1: '▲',
	2: '■',
	3: '◆',
	4: '★',
	5: '✚',
};

const COLOR_NAMES: Record<ColorIndex, string> = {
	0: 'Coral',
	1: 'Amber',
	2: 'Emerald',
	3: 'Cyan',
	4: 'Indigo',
	5: 'Magenta',
};

export function ColorDock({
	currentColor,
	colors = ALL_COLORS,
	onSelectColor,
	disabled = false,
	showColorblindShapes,
	gridId = 'color-flood-grid',
}: ColorDockProps): JSX.Element {
	const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);

	// Keyboard number shortcuts (1-N)
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (disabled) return;
			// Ignore if focusing text fields or inputs
			if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) {
				return;
			}

			const keyNum = Number.parseInt(e.key, 10);
			if (!Number.isNaN(keyNum) && keyNum >= 1 && keyNum <= colors.length) {
				const colorIndex = colors[keyNum - 1];
				if (colorIndex !== currentColor) {
					e.preventDefault();
					onSelectColor(colorIndex);
				}
			}
		};

		window.addEventListener('keydown', handleKeyDown);
		return () => window.removeEventListener('keydown', handleKeyDown);
	}, [currentColor, onSelectColor, disabled, colors]);

	return (
		<DockContainer aria-label="Color selector control dock">
			<DockList data-count={String(colors.length)}>
				{colors.map((color, index) => {
					const isCurrent = color === currentColor;
					const isDisabled = disabled || isCurrent;
					const keyNumber = index + 1;

					return (
						<li key={`color-btn-${color}`} style={{ listStyle: 'none' }}>
							<ColorButton
								ref={(el) => {
									buttonRefs.current[index] = el;
								}}
								type="button"
								data-color={String(color)}
								data-current={isCurrent ? 'true' : 'false'}
								disabled={isDisabled}
								aria-controls={gridId}
								aria-pressed={isCurrent}
								aria-label={`Color ${keyNumber}: ${COLOR_NAMES[color]}${isCurrent ? ' (currently active)' : ''}`}
								onClick={() => onSelectColor(color)}
							>
								<BadgeSpan aria-hidden="true">{keyNumber}</BadgeSpan>
								{showColorblindShapes ? (
									<span aria-hidden="true">{SHAPE_GLYPHS[color]}</span>
								) : (
									<VisuallyHidden>{COLOR_NAMES[color]}</VisuallyHidden>
								)}
							</ColorButton>
						</li>
					);
				})}
			</DockList>
		</DockContainer>
	);
}
