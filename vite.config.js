import adapter from '@sveltejs/adapter-auto'
import { sveltekit } from '@sveltejs/kit/vite'
import { defineConfig } from 'vitest/config'

export default defineConfig({
	plugins: [
		sveltekit({
			adapter: adapter(),
			alias: { $lib: './src/lib', $components: './src/lib/Components' }
		})
	],
	test: { include: ['src/**/*.{test,spec}.{js,ts}'] }
})
