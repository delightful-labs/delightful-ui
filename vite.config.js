import { sveltekit } from '@sveltejs/kit/vite'
import { resolve } from 'path'

/** @type {import('vite').UserConfig} */
const config = {
	plugins: [sveltekit()],
	resolve: {
    alias: {
      $components: resolve('./src/lib/Components')
    }
  },
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	}
};

export default config;
