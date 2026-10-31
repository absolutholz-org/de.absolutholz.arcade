import { css } from '@linaria/core';
import { styled } from '@linaria/react';

export const statusBar = css`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  width: 100%;
`;

export const statusMetric = css`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-text-primary);

  &[data-intersecting='true'] {
    color: var(--color-status-danger, var(--color-danger));
  }

  &[data-solved='true'] {
    color: var(--color-status-success, var(--color-success));
  }
`;

export const boardArea = css`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  max-width: 38rem;
  margin: 0 auto;
  padding: 0.5rem;
`;

export const ControlsWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 0;
  width: 100%;
`;

export const CanvasWrapper = styled.div`
  width: 100%;
  height: 100%;
  background: var(--color-surface-canvas, var(--color-surface-secondary));
  border: 1px solid var(--color-border-default);
  border-radius: 0.75rem;
  overflow: hidden;
  touch-action: none;
  user-select: none;
`;

export const SvgCanvas = styled.svg`
  width: 100%;
  height: 100%;
  display: block;
  touch-action: none;
  user-select: none;
`;

export const EdgeLine = styled.line`
  stroke-linecap: round;
  transition: stroke 120ms ease, stroke-width 120ms ease;

  &[data-intersecting='false'] {
    stroke: var(--color-text-secondary);
    stroke-width: 3.5;
    stroke-dasharray: none;
  }

  &[data-intersecting='true'] {
    stroke: var(--color-status-danger, var(--color-danger));
    stroke-width: 5;
    stroke-dasharray: 12 8;
  }

  &[data-solved='true'] {
    stroke: var(--color-status-success, var(--color-success));
    stroke-width: 4;
    stroke-dasharray: none;
  }
`;

export const VertexGroup = styled.g`
  cursor: grab;
  outline: none;
  touch-action: none;

  &[data-dragging='true'] {
    cursor: grabbing;
  }

  &:focus-visible circle[data-role='halo'] {
    opacity: 1;
    stroke: var(--color-focus-ring, var(--color-primary));
    stroke-width: 4;
  }
`;

export const VertexHalo = styled.circle`
  fill: none;
  stroke: transparent;
  stroke-width: 3;
  opacity: 0;
  pointer-events: none;
  transition: opacity 120ms ease;

  &[data-selected='true'] {
    opacity: 1;
    stroke: var(--color-focus-ring, var(--color-primary));
    stroke-width: 4;
  }

  &[data-dragging='true'] {
    opacity: 1;
    stroke: var(--color-interactive-primary, var(--color-primary));
    stroke-width: 5;
  }
`;

export const VertexCircle = styled.circle`
  fill: var(--color-surface-elevated);
  stroke: var(--color-interactive-primary, var(--color-primary));
  stroke-width: 4;
  transition: fill 120ms ease, stroke 120ms ease;

  &[data-intersecting='true'] {
    stroke: var(--color-status-danger, var(--color-danger));
  }

  &[data-selected='true'] {
    fill: var(--color-interactive-primary, var(--color-primary));
    stroke: var(--color-text-primary);
  }

  &[data-dragging='true'] {
    fill: var(--color-interactive-primary, var(--color-primary));
    stroke: var(--color-focus-ring, var(--color-primary));
  }

  &[data-solved='true'] {
    stroke: var(--color-status-success, var(--color-success));
  }
`;

export const VertexLabel = styled.text`
  fill: var(--color-text-primary);
  font-size: 1.125rem;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: central;
  pointer-events: none;
  user-select: none;

  &[data-selected='true'],
  &[data-dragging='true'] {
    fill: var(--color-surface-elevated);
  }
`;

export const RulesContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  color: var(--color-text-primary);
  font-size: 0.9375rem;
  line-height: 1.5;
`;
