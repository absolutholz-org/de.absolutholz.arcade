import { useMemo } from 'react';
import type { Themeset } from '../../styles/theme/theme.types';
import { getThemeMapping } from '../../styles/theme/theme.utils';

/**
 * Hook to retrieve the theme mapping variables for a given themeset theme.
 */
export function useThemeMapping(themeName: keyof Themeset) {
	return useMemo(() => getThemeMapping(themeName), [themeName]);
}
