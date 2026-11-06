import { themeColor } from './theme/theme.utils';

export const focusVisibleRing = `
	outline: 2px solid transparent;
	outline-offset: 2px;

	&:focus-visible {
		outline-color: ${themeColor('accent')};
	}
`;
