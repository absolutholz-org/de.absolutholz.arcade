import { themeColor } from '@arcade/lib-ui/styles/theme/theme.utils';
import { css } from '@linaria/core';
import { styled } from '@linaria/react';

export const statusBar = css`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-lg);
  padding-inline: 0;
  padding-block: 0;
  width: 100%;
  background-color: transparent;
`;

export const statusMetric = css`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: ${themeColor('text-1')};

  &[data-intersecting='true'] {
    color: light-dark(oklch(0.55 0.22 25), oklch(0.68 0.22 25));
  }

  &[data-solved='true'] {
    color: light-dark(oklch(0.55 0.18 145), oklch(0.7 0.18 145));
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

export const RulesContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  color: ${themeColor('text-1')};
  font-size: 0.9375rem;
  line-height: 1.5;
`;
