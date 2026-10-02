export const reset = `
	/* 1. Box Sizing, Margin, and Padding Reset */
	/* Applies border-box layout calculations and clears default margins and paddings globally. */
	*,
	*::before,
	*::after {
		box-sizing: border-box;
		font: inherit;
		margin: 0;
		padding: 0;
	}

	/* Enables smooth transitions and animations to/from intrinsic sizing keywords (e.g., height: 0 to height: auto). */
	/* Progressive enhancement: Cutting-edge CSS Values & Units Level 4 property with limited browser support (Chromium 129+). Unsupported browsers safely ignore it. */
	/* Scoped to prefers-reduced-motion: no-preference to honor user accessibility preferences. */
	:root {
		@media (prefers-reduced-motion: no-preference) {
			interpolate-size: allow-keywords;
		}
	}

	/* 2. Document Base Height and Scroll */
	/* Ensures full viewport heights can be calculated and enables smooth scrolling by default. */
	html,
	body {
		height: 100%;
		scroll-behavior: smooth;
		scrollbar-gutter: stable; /* Preserves layout during scroll */
	}

	/* Preps the browser engine window */
	html {
		color-scheme: light dark; /* Tells browser dark mode is supported */
		text-rendering: optimizeLegibility; /* Forces advanced font kerning early */
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
	}

	/* 3. Baseline Typography */
	/* Establishes line-height, text rendering quality, and font-smoothing baselines. */
	body {
		font-synthesize: none; /* Protects font weight rendering */
		line-height: 1.5;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		text-rendering: optimizeSpeed;
	}

	/* 4. Media & Fluid Responsive Assets */
	/* Restricts media components to their container width and removes baseline alignment gaps. */
	img,
	picture,
	video,
	canvas,
	svg {
		display: block;
		height: auto;
		max-width: 100%;
	}
	img,
	picture,
	video {
		/* Apply dimming and contrast enhancement in dark mode to prevent visual fatigue from bright assets. */
		@media (prefers-color-scheme: dark) {
			filter: brightness(0.8) contrast(1.2);

			/* Restore original brightness and contrast on hover for detail inspection. */
			&:hover {
				filter: brightness(1) contrast(1);
			}
		}
	}

	/* 5. Typography Inheritances */
	/* Forces form fields to inherit fonts and colors from parent text layers. */
	input,
	textarea,
	select {
		font: inherit;
		color: inherit;
	}

	/* 6. Word Wrapping Prevention */
	/* Prevents continuous words and links from overflowing container boundaries. */
	p,
	h1,
	h2,
	h3,
	h4,
	h5,
	h6,
	a,
	span {
		overflow-wrap: break-word;
	}

	/* 7. Stacking Context */
	/* Isolates application roots to prevent floating layouts from corrupting overlays. */
	#root,
	#storybook-root {
		isolation: isolate;
	}

	/* 8. Reduced Motion Respect */
	/* Automatically disables animations and transitions if preferred by the user's OS settings. */
	@media (prefers-reduced-motion: reduce) {
		*,
		*::before,
		*::after {
			animation-duration: 0.01ms !important;
			animation-iteration-count: 1 !important;
			transition-duration: 0.01ms !important;
			scroll-behavior: auto !important;
		}

		html,
		body {
			scroll-behavior: auto !important;
		}
	}

	/* 9. Complete Button Reset */
	/* Resets default browser styles on button elements to act as clean visual slates. */
	button {
		appearance: none;
		background: none;
		border: none;
		border-radius: 0;
		color: inherit;
		cursor: pointer;
		font: inherit;
		margin: 0;
		overflow: visible;
		padding: 0;
		width: auto;
		-webkit-font-smoothing: inherit;
	}

	/* 10. List Style Semantic Reset */
	/* Safari VoiceOver removes list semantics when list-style: none is applied. */
	/* Explicitly using role="list" in HTML preserves screen-reader semantics, and we style it here. */
	[role='list'] {
		list-style: none;
	}
`;
