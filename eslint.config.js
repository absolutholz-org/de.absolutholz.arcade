// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from 'eslint-plugin-storybook';
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintConfigPrettier from 'eslint-config-prettier';

export default tseslint.config(
	eslint.configs.recommended,
	...tseslint.configs.recommended,
	eslintConfigPrettier,
	...storybook.configs['flat/recommended'],
	{
		ignores: [
			'**/dist/**',
			'**/node_modules/**',
			'**/coverage/**',
			'.git/**',
			'eslint.config.js',
			'**/storybook-static/**',
			'**/.storybook/**',
		],
	},
	{
		files: ['**/*.ts', '**/*.tsx'],
		languageOptions: {
			parserOptions: {
				project: './tsconfig.json',
				tsconfigRootDir: import.meta.dirname,
			},
		},
		rules: {
			'@typescript-eslint/consistent-type-imports': [
				'error',
				{
					prefer: 'type-imports',
					fixStyle: 'separate-type-imports',
				},
			],
			'no-restricted-imports': [
				'error',
				{
					patterns: [
						{
							group: [
								'*.ts',
								'*.tsx',
								'./**/*.ts',
								'./**/*.tsx',
								'../**/*.ts',
								'../**/*.tsx',
							],
							message:
								'NEVER use .ts or .tsx file extensions inside JavaScript/TypeScript import paths. Strip the extension or use .css/.js as appropriate.',
						},
						{
							group: ['**/_*', '!./_*'],
							message:
								'Importing private files prefixed with an underscore is forbidden outside their parent directory.',
						},
					],
				},
			],
		},
	},
	{
		files: ['**/*.js', '**/*.jsx'],
		rules: {
			'no-restricted-imports': [
				'error',
				{
					patterns: [
						{
							group: [
								'*.ts',
								'*.tsx',
								'./**/*.ts',
								'./**/*.tsx',
								'../**/*.ts',
								'../**/*.tsx',
							],
							message:
								'NEVER use .ts or .tsx file extensions inside JavaScript/TypeScript import paths. Strip the extension or use .css/.js as appropriate.',
						},
						{
							group: ['**/_*', '!./_*'],
							message:
								'Importing private files prefixed with an underscore is forbidden outside their parent directory.',
						},
					],
				},
			],
		},
	},
);
