import { css } from '@linaria/core';

export const themesetClient2 = css`
	:global() {
		:root {
			/* ==========================================================================
			   Primary Theme
			   ========================================================================== */
			--theme-primary-surface: light-dark(
				oklch(0.97 0.005 40),
				oklch(0.12 0.01 40)
			);
			--theme-primary-container-1: light-dark(
				oklch(0.93 0.01 40),
				oklch(0.17 0.015 40)
			);
			--theme-primary-container-2: light-dark(
				oklch(0.88 0.015 40),
				oklch(0.23 0.02 40)
			);
			--theme-primary-text-1: light-dark(
				oklch(0.18 0.01 40),
				oklch(0.95 0.005 40)
			);
			--theme-primary-text-2: light-dark(
				oklch(0.38 0.01 40),
				oklch(0.8 0.01 40)
			);
			--theme-primary-text-3: light-dark(
				oklch(0.55 0.01 40),
				oklch(0.64 0.01 40)
			);
			--theme-primary-accent: light-dark(
				oklch(0.58 0.16 40),
				oklch(0.68 0.16 40)
			);

			/* ==========================================================================
			   Secondary Theme
			   ========================================================================== */
			--theme-secondary-surface: light-dark(
				oklch(0.97 0.01 90),
				oklch(0.12 0.015 90)
			);
			--theme-secondary-container-1: light-dark(
				oklch(0.93 0.015 90),
				oklch(0.17 0.02 90)
			);
			--theme-secondary-container-2: light-dark(
				oklch(0.88 0.02 90),
				oklch(0.22 0.025 90)
			);
			--theme-secondary-text-1: light-dark(
				oklch(0.2 0.015 90),
				oklch(0.94 0.01 90)
			);
			--theme-secondary-text-2: light-dark(
				oklch(0.4 0.01 90),
				oklch(0.79 0.01 90)
			);
			--theme-secondary-text-3: light-dark(
				oklch(0.58 0.01 90),
				oklch(0.63 0.01 90)
			);
			--theme-secondary-accent: light-dark(
				oklch(0.62 0.13 80),
				oklch(0.72 0.13 80)
			);

			/* ==========================================================================
			   Contrast Theme
			   ========================================================================== */
			--theme-contrast-surface: light-dark(oklch(1 0 0), oklch(0.06 0.005 40));
			--theme-contrast-container-1: light-dark(
				oklch(0.92 0.01 40),
				oklch(0.12 0.01 40)
			);
			--theme-contrast-container-2: light-dark(
				oklch(0.84 0.02 40),
				oklch(0.18 0.015 40)
			);
			--theme-contrast-text-1: light-dark(
				oklch(0.08 0.01 40),
				oklch(0.98 0.005 40)
			);
			--theme-contrast-text-2: light-dark(
				oklch(0.28 0.01 40),
				oklch(0.85 0.01 40)
			);
			--theme-contrast-text-3: light-dark(
				oklch(0.48 0.01 40),
				oklch(0.7 0.01 40)
			);
			--theme-contrast-accent: light-dark(
				oklch(0.62 0.16 75),
				oklch(0.75 0.15 75)
			);

			/* ==========================================================================
			   Accent Theme
			   ========================================================================== */
			--theme-accent-surface: light-dark(
				oklch(0.95 0.04 45),
				oklch(0.14 0.04 45)
			);
			--theme-accent-container-1: light-dark(
				oklch(0.91 0.05 45),
				oklch(0.19 0.05 45)
			);
			--theme-accent-container-2: light-dark(
				oklch(0.85 0.07 45),
				oklch(0.25 0.06 45)
			);
			--theme-accent-text-1: light-dark(
				oklch(0.18 0.03 45),
				oklch(0.96 0.02 45)
			);
			--theme-accent-text-2: light-dark(
				oklch(0.38 0.03 45),
				oklch(0.82 0.02 45)
			);
			--theme-accent-text-3: light-dark(
				oklch(0.55 0.02 45),
				oklch(0.66 0.02 45)
			);
			--theme-accent-accent: light-dark(
				oklch(0.62 0.18 50),
				oklch(0.72 0.18 50)
			);
		}
	}
`;
