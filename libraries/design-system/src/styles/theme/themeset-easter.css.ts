import { css } from '@linaria/core';

export const themesetEaster = css`
	:global() {
		:root {
			/* ==========================================================================
			   Primary Theme
			   ========================================================================== */
			--theme-primary-surface: light-dark(
				oklch(0.98 0.01 300),
				oklch(0.12 0.02 300)
			);
			--theme-primary-container-1: light-dark(
				oklch(0.95 0.02 300),
				oklch(0.17 0.03 300)
			);
			--theme-primary-container-2: light-dark(
				oklch(0.9 0.03 300),
				oklch(0.22 0.04 300)
			);
			--theme-primary-text-1: light-dark(
				oklch(0.2 0.02 300),
				oklch(0.95 0.01 300)
			);
			--theme-primary-text-2: light-dark(
				oklch(0.4 0.02 300),
				oklch(0.8 0.02 300)
			);
			--theme-primary-text-3: light-dark(
				oklch(0.58 0.02 300),
				oklch(0.65 0.02 300)
			);
			--theme-primary-accent: light-dark(
				oklch(0.85 0.18 90),
				oklch(0.88 0.16 90)
			);

			/* ==========================================================================
			   Secondary Theme
			   ========================================================================== */
			--theme-secondary-surface: light-dark(
				oklch(0.97 0.02 150),
				oklch(0.12 0.02 150)
			);
			--theme-secondary-container-1: light-dark(
				oklch(0.94 0.03 150),
				oklch(0.17 0.03 150)
			);
			--theme-secondary-container-2: light-dark(
				oklch(0.89 0.04 150),
				oklch(0.22 0.04 150)
			);
			--theme-secondary-text-1: light-dark(
				oklch(0.2 0.02 150),
				oklch(0.95 0.02 150)
			);
			--theme-secondary-text-2: light-dark(
				oklch(0.4 0.02 150),
				oklch(0.8 0.02 150)
			);
			--theme-secondary-text-3: light-dark(
				oklch(0.58 0.02 150),
				oklch(0.65 0.02 150)
			);
			--theme-secondary-accent: light-dark(
				oklch(0.72 0.15 45),
				oklch(0.78 0.14 45)
			);

			/* ==========================================================================
			   Contrast Theme
			   ========================================================================== */
			--theme-contrast-surface: light-dark(oklch(1 0 0), oklch(0.1 0.04 300));
			--theme-contrast-container-1: light-dark(
				oklch(0.94 0.02 300),
				oklch(0.16 0.05 300)
			);
			--theme-contrast-container-2: light-dark(
				oklch(0.86 0.03 300),
				oklch(0.22 0.06 300)
			);
			--theme-contrast-text-1: light-dark(
				oklch(0.12 0.04 300),
				oklch(0.98 0.01 300)
			);
			--theme-contrast-text-2: light-dark(
				oklch(0.32 0.03 300),
				oklch(0.85 0.02 300)
			);
			--theme-contrast-text-3: light-dark(
				oklch(0.48 0.02 300),
				oklch(0.7 0.02 300)
			);
			--theme-contrast-accent: light-dark(
				oklch(0.82 0.18 110),
				oklch(0.86 0.18 110)
			);

			/* ==========================================================================
			   Accent Theme
			   ========================================================================== */
			--theme-accent-surface: light-dark(
				oklch(0.97 0.02 350),
				oklch(0.12 0.02 350)
			);
			--theme-accent-container-1: light-dark(
				oklch(0.94 0.03 350),
				oklch(0.17 0.03 350)
			);
			--theme-accent-container-2: light-dark(
				oklch(0.89 0.04 350),
				oklch(0.22 0.04 350)
			);
			--theme-accent-text-1: light-dark(
				oklch(0.2 0.02 350),
				oklch(0.96 0.02 350)
			);
			--theme-accent-text-2: light-dark(
				oklch(0.4 0.02 350),
				oklch(0.8 0.02 350)
			);
			--theme-accent-text-3: light-dark(
				oklch(0.58 0.02 350),
				oklch(0.65 0.02 350)
			);
			--theme-accent-accent: light-dark(
				oklch(0.6 0.22 340),
				oklch(0.7 0.2 340)
			);
		}
	}
`;
