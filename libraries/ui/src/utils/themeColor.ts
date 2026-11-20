/**
 * Syncs `<meta name="theme-color" id="meta-theme-color">` from the resolved
 * root element background color so mobile system bars match the active
 * themeset and color scheme.
 */
export function syncMetaThemeColor(): void {
	if (typeof document === 'undefined' || typeof window === 'undefined') {
		return;
	}
	const metaTheme = document.getElementById('meta-theme-color');
	if (!metaTheme) {
		return;
	}
	const surfaceBg = window.getComputedStyle(document.documentElement).backgroundColor;
	if (surfaceBg && surfaceBg !== 'transparent' && surfaceBg !== 'rgba(0, 0, 0, 0)') {
		metaTheme.setAttribute('content', surfaceBg);
	}
}
