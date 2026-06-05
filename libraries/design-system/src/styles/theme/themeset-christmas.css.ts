import { css } from '@linaria/core';

export const themesetChristmas = css`
	:global() {
		:root {
			/* ==========================================================================
			   Primary Theme
			   ========================================================================== */
			--theme-primary-surface: light-dark(
				oklch(0.97 0.015 140),
				oklch(0.15 0.03 140)
			);
			--theme-primary-container-1: light-dark(
				oklch(0.93 0.025 140),
				oklch(0.2 0.04 140)
			);
			--theme-primary-container-2: light-dark(
				oklch(0.88 0.035 140),
				oklch(0.25 0.05 140)
			);
			--theme-primary-text-1: light-dark(
				oklch(0.2 0.03 140),
				oklch(0.96 0.01 140)
			);
			--theme-primary-text-2: light-dark(
				oklch(0.38 0.02 140),
				oklch(0.8 0.015 140)
			);
			--theme-primary-text-3: light-dark(
				oklch(0.55 0.02 140),
				oklch(0.65 0.02 140)
			);
			--theme-primary-accent: light-dark(
				oklch(0.55 0.18 25),
				oklch(0.65 0.18 25)
			);

			/* ==========================================================================
			   Secondary Theme
			   ========================================================================== */
			--theme-secondary-surface: light-dark(
				oklch(0.97 0.02 80),
				oklch(0.14 0.02 80)
			);
			--theme-secondary-container-1: light-dark(
				oklch(0.93 0.03 80),
				oklch(0.19 0.03 80)
			);
			--theme-secondary-container-2: light-dark(
				oklch(0.88 0.04 80),
				oklch(0.24 0.04 80)
			);
			--theme-secondary-text-1: light-dark(
				oklch(0.2 0.02 80),
				oklch(0.95 0.02 80)
			);
			--theme-secondary-text-2: light-dark(
				oklch(0.4 0.02 80),
				oklch(0.8 0.02 80)
			);
			--theme-secondary-text-3: light-dark(
				oklch(0.58 0.02 80),
				oklch(0.64 0.02 80)
			);
			--theme-secondary-accent: light-dark(
				oklch(0.45 0.14 140),
				oklch(0.62 0.14 140)
			);

			/* ==========================================================================
			   Contrast Theme
			   ========================================================================== */
			--theme-contrast-surface: light-dark(oklch(1 0 0), oklch(0.08 0.02 140));
			--theme-contrast-container-1: light-dark(
				oklch(0.93 0.01 140),
				oklch(0.14 0.03 140)
			);
			--theme-contrast-container-2: light-dark(
				oklch(0.85 0.02 140),
				oklch(0.2 0.04 140)
			);
			--theme-contrast-text-1: light-dark(
				oklch(0.1 0.03 140),
				oklch(0.98 0.01 140)
			);
			--theme-contrast-text-2: light-dark(
				oklch(0.28 0.02 140),
				oklch(0.85 0.02 140)
			);
			--theme-contrast-text-3: light-dark(
				oklch(0.45 0.02 140),
				oklch(0.7 0.02 140)
			);
			--theme-contrast-accent: light-dark(
				oklch(0.45 0.2 25),
				oklch(0.65 0.2 25)
			);

			/* ==========================================================================
			   Accent Theme
			   ========================================================================== */
			--theme-accent-surface: light-dark(
				oklch(0.94 0.05 25),
				oklch(0.15 0.06 25)
			);
			--theme-accent-container-1: light-dark(
				oklch(0.9 0.07 25),
				oklch(0.2 0.08 25)
			);
			--theme-accent-container-2: light-dark(
				oklch(0.84 0.09 25),
				oklch(0.26 0.09 25)
			);
			--theme-accent-text-1: light-dark(
				oklch(0.18 0.06 25),
				oklch(0.97 0.03 25)
			);
			--theme-accent-text-2: light-dark(
				oklch(0.36 0.05 25),
				oklch(0.82 0.03 25)
			);
			--theme-accent-text-3: light-dark(
				oklch(0.52 0.04 25),
				oklch(0.68 0.03 25)
			);
			--theme-accent-accent: light-dark(
				oklch(0.68 0.15 85),
				oklch(0.76 0.15 85)
			);
		}
	}
`;
