import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
	testDir: 'tests/storybook',
	outputDir: 'test-results/storybook',
	use: { baseURL: 'http://127.0.0.1:6007' },
	projects: [
		{ name: 'chromium', use: { ...devices['Desktop Chrome'] } },
		{
			name: 'webkit-mobile',
			testMatch: '**/tag-input.spec.js',
			use: { ...devices['iPhone 13'] }
		}
	],
	webServer: {
		command:
			'pnpm exec vite preview --config .storybook/vite.config.js --outDir storybook-test-static --host 127.0.0.1 --port 6007 --strictPort',
		url: 'http://127.0.0.1:6007',
		reuseExistingServer: false
	}
})
