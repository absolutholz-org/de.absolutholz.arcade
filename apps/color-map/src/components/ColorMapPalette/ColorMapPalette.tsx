import { useI18n } from '@arcade/lib-i18n/hooks/useI18n';
import type { JSX } from 'react';
import { ALL_COLORS, COLOR_SHAPES, type ColorIndex } from '../../engine/types';
import * as S from './ColorMapPalette.styles';

export type ActiveTool = ColorIndex | 'eraser';

export interface ColorMapPaletteProps {
	readonly activeTool: ActiveTool;
	readonly isPencilMode: boolean;
	readonly highlightConflicts: boolean;
	readonly showColorblindShapes: boolean;
	readonly disabled: boolean;
	readonly onSelectTool: (tool: ActiveTool) => void;
	readonly onTogglePencilMode: () => void;
	readonly onToggleHighlightConflicts: () => void;
}

export function ColorMapPalette({
	activeTool,
	isPencilMode,
	highlightConflicts,
	showColorblindShapes,
	disabled,
	onSelectTool,
	onTogglePencilMode,
	onToggleHighlightConflicts,
}: ColorMapPaletteProps): JSX.Element {
	const { t } = useI18n('color-map');

	return (
		<S.PaletteBar role="toolbar" aria-label={t('aria.paletteToolbar')}>
			<S.SwatchGroup>
				{ALL_COLORS.map((color) => {
					const isSelected = activeTool === color;
					const colorName = t(`colors.c${color}` as 'colors.c0');
					const shapeName = t(`shapes.s${color}` as 'shapes.s0');

					return (
						<S.ColorSwatchButton
							key={`swatch-${color}`}
							type="button"
							data-color={String(color)}
							data-selected={isSelected ? 'true' : 'false'}
							aria-pressed={isSelected}
							aria-label={t('aria.colorSwatch', {
								index: color + 1,
								color: colorName,
								shape: shapeName,
							})}
							disabled={disabled}
							onClick={() => onSelectTool(color)}
						>
							<S.KeyHint aria-hidden="true">{color + 1}</S.KeyHint>
							{showColorblindShapes && <span aria-hidden="true">{COLOR_SHAPES[color]}</span>}
						</S.ColorSwatchButton>
					);
				})}
			</S.SwatchGroup>

			<S.ToolGroup>
				<S.ToolToggleButton
					type="button"
					data-active={activeTool === 'eraser' ? 'true' : 'false'}
					aria-pressed={activeTool === 'eraser'}
					aria-label={t('aria.eraserTool')}
					disabled={disabled}
					onClick={() => onSelectTool('eraser')}
				>
					<span aria-hidden="true">⌫</span>
					<span>{t('controls.erase')}</span>
				</S.ToolToggleButton>

				<S.ToolToggleButton
					type="button"
					data-active={isPencilMode ? 'true' : 'false'}
					aria-pressed={isPencilMode}
					aria-label={t('aria.pencilToggle')}
					disabled={disabled}
					onClick={onTogglePencilMode}
				>
					<span aria-hidden="true">✏️</span>
					<span>{isPencilMode ? t('controls.pencilOn') : t('controls.pencil')}</span>
				</S.ToolToggleButton>

				<S.ToolToggleButton
					type="button"
					data-active={highlightConflicts ? 'true' : 'false'}
					aria-pressed={highlightConflicts}
					aria-label={t('aria.conflictsToggle')}
					disabled={disabled}
					onClick={onToggleHighlightConflicts}
				>
					<span aria-hidden="true">⚠</span>
					<span>{t('controls.highlightConflicts')}</span>
				</S.ToolToggleButton>
			</S.ToolGroup>
		</S.PaletteBar>
	);
}
