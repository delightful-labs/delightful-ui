import js from '@eslint/js'
import prettier from 'eslint-config-prettier'
import svelte from 'eslint-plugin-svelte'
import globals from 'globals'
import { resolve } from 'node:path'

export default [
	{
		ignores: [
			'node_modules/**',
			'.svelte-kit/**',
			'build/**',
			'dist/**',
			'.storybook/**',
			'src/stories/**'
		]
	},
	js.configs.recommended,
	...svelte.configs['flat/recommended'],
	prettier,
	...svelte.configs['flat/prettier'],
	{ languageOptions: { globals: { ...globals.browser, ...globals.node } } },
	{
		files: ['**/*.svelte'],
		languageOptions: {
			parserOptions: {
				svelteConfig: {
					alias: {
						$lib: resolve('src/lib'),
						$components: resolve('src/lib/Components')
					}
				}
			}
		}
	}
]
