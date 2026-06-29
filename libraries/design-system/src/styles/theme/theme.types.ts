export type Theme = {
	surface?: string;
	'container-1'?: string;
	'container-2'?: string;
	'text-1'?: string;
	'text-2'?: string;
	'text-3'?: string;
	accent?: string;
	'accent-contrast'?: string;
	'accent-secondary'?: string;
	'accent-secondary-contrast'?: string;
};

export type Themeset = {
	primary: Theme;
	secondary?: Theme;
	contrast?: Theme;
	accent?: Theme;
};
