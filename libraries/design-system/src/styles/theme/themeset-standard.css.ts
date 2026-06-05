import { css } from '@linaria/core';

export const themesetStandard = css`
	:global() {
		:root {
			/* ==========================================================================
			   Primary Theme
			   ========================================================================== */
			--theme-primary-surface: light-dark(
				oklch(0.98 0.005 250),
				oklch(0.12 0.015 250)
			);
			--theme-primary-container-1: light-dark(
				oklch(0.95 0.01 250),
				oklch(0.18 0.02 250)
			);
			--theme-primary-container-2: light-dark(
				oklch(0.9 0.015 250),
				oklch(0.24 0.02 250)
			);
			--theme-primary-text-1: light-dark(
				oklch(0.2 0.01 250),
				oklch(0.95 0.005 250)
			);
			--theme-primary-text-2: light-dark(
				oklch(0.4 0.01 250),
				oklch(0.8 0.01 250)
			);
			--theme-primary-text-3: light-dark(
				oklch(0.55 0.01 250),
				oklch(0.65 0.015 250)
			);
			--theme-primary-accent: light-dark(
				oklch(0.6 0.18 250),
				oklch(0.7 0.16 250)
			);

			/* ==========================================================================
			   Secondary Theme
			   ========================================================================== */
			--theme-secondary-surface: light-dark(
				oklch(0.98 0.005 280),
				oklch(0.12 0.015 280)
			);
			--theme-secondary-container-1: light-dark(
				oklch(0.94 0.01 280),
				oklch(0.18 0.02 280)
			);
			--theme-secondary-container-2: light-dark(
				oklch(0.89 0.015 280),
				oklch(0.23 0.02 280)
			);
			--theme-secondary-text-1: light-dark(
				oklch(0.22 0.01 280),
				oklch(0.93 0.005 280)
			);
			--theme-secondary-text-2: light-dark(
				oklch(0.42 0.01 280),
				oklch(0.78 0.01 280)
			);
			--theme-secondary-text-3: light-dark(
				oklch(0.58 0.01 280),
				oklch(0.63 0.015 280)
			);
			--theme-secondary-accent: light-dark(
				oklch(0.55 0.18 280),
				oklch(0.68 0.16 280)
			);

			/* ==========================================================================
			   Contrast Theme
			   ========================================================================== */
			--theme-contrast-surface: light-dark(oklch(1 0 0), oklch(0.05 0 0));
			--theme-contrast-container-1: light-dark(
				oklch(0.92 0 0),
				oklch(0.15 0 0)
			);
			--theme-contrast-container-2: light-dark(
				oklch(0.85 0 0),
				oklch(0.22 0 0)
			);
			--theme-contrast-text-1: light-dark(oklch(0 0 0), oklch(1 0 0));
			--theme-contrast-text-2: light-dark(oklch(0.25 0 0), oklch(0.8 0 0));
			--theme-contrast-text-3: light-dark(oklch(0.45 0 0), oklch(0.6 0 0));
			--theme-contrast-accent: light-dark(
				oklch(0.4 0.18 260),
				oklch(0.8 0.15 260)
			);

			/* ==========================================================================
			   Accent Theme
			   ========================================================================== */
			--theme-accent-surface: light-dark(
				oklch(0.94 0.03 250),
				oklch(0.1 0.04 250)
			);
			--theme-accent-container-1: light-dark(
				oklch(0.9 0.04 250),
				oklch(0.16 0.05 250)
			);
			--theme-accent-container-2: light-dark(
				oklch(0.85 0.05 250),
				oklch(0.22 0.06 250)
			);
			--theme-accent-text-1: light-dark(
				oklch(0.15 0.04 250),
				oklch(0.96 0.02 250)
			);
			--theme-accent-text-2: light-dark(
				oklch(0.35 0.04 250),
				oklch(0.82 0.03 250)
			);
			--theme-accent-text-3: light-dark(
				oklch(0.5 0.04 250),
				oklch(0.68 0.03 250)
			);
			--theme-accent-accent: light-dark(
				oklch(0.52 0.22 250),
				oklch(0.75 0.18 250)
			);
		}
	}
`;
