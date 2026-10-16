import { type ReactElement, act } from 'react';
import { createRoot } from 'react-dom/client';

// Configure React act environment for Vitest/happy-dom
// @ts-ignore
globalThis.IS_REACT_ACT_ENVIRONMENT = true;

export function render(ui: ReactElement) {
	const container = document.createElement('div');
	document.body.appendChild(container);
	const root = createRoot(container);
	act(() => {
		root.render(ui);
	});
	return {
		container,
		unmount: () => {
			act(() => {
				root.unmount();
			});
			container.remove();
		},
	};
}
