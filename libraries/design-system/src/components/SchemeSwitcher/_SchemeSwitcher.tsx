import { type ChangeEvent } from 'react';
import { SCHEME_SWITCHER_NAME } from './_SchemeSwitcher.constants';
import { useScheme } from './_SchemeSwitcher.hooks';
import type { Scheme } from './_SchemeSwitcher.types';

export function SchemeSwitcher() {
	const [scheme, setScheme] = useScheme();

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		setScheme(e.target.value as Scheme);
	};

	return (
		<div style={{ display: 'flex', gap: '16px' }}>
			<label>
				<input
					type="radio"
					name={SCHEME_SWITCHER_NAME}
					value="light"
					checked={scheme === 'light'}
					onChange={handleChange}
				/>
				Light
			</label>
			<label>
				<input
					type="radio"
					name={SCHEME_SWITCHER_NAME}
					value="dark"
					checked={scheme === 'dark'}
					onChange={handleChange}
				/>
				Dark
			</label>
			<label>
				<input
					type="radio"
					name={SCHEME_SWITCHER_NAME}
					value="system"
					checked={scheme === 'system'}
					onChange={handleChange}
				/>
				Sync with System
			</label>
		</div>
	);
}
