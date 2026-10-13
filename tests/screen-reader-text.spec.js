import { expect, test } from '@playwright/test'

test.beforeEach(async ({ page }) => {
	await page.goto('/')
})

test('clipped text remains available to accessible names and descriptions', async ({
	page
}) => {
	const section = page.getByRole('region', {
		name: 'LoadingSpinner',
		exact: true
	})
	const spinner = section.getByRole('status').first()
	const text = spinner.locator('span')
	await expect(text).toHaveText('Loading')
	await expect(text).toHaveCSS('width', '1px')
	await expect(text).toHaveCSS('height', '1px')
	await expect(text).toHaveCSS('clip-path', 'inset(50%)')
	await expect(text).toHaveCSS('white-space', 'nowrap')
	await expect(text).toHaveCSS('position', 'absolute')
	await expect(text).not.toHaveAttribute('aria-hidden')
	await expect(text).not.toHaveAttribute('hidden')

	// Wire native references to the real rendered span without changing the demo.
	await text.evaluate((element) => {
		element.id = 'test-loading-description'
	})
	const toggle = section.locator('button')
	await toggle.evaluate((element) => {
		element.setAttribute('aria-describedby', 'test-loading-description')
	})
	await expect(toggle).toHaveAccessibleDescription('Loading')
	await toggle.evaluate((element) => {
		element.setAttribute('aria-labelledby', 'test-loading-description')
	})
	await expect(toggle).toHaveAccessibleName('Loading')
})

test('loading status keeps supplementary text clipped across visibility changes', async ({
	page
}) => {
	const section = page.getByRole('region', {
		name: 'LoadingSpinner',
		exact: true
	})
	const spinner = section.locator('#loading-state-preview')
	const toggle = section.getByRole('button', { name: 'Toggle loading preview' })
	await expect(spinner).toBeHidden()
	await toggle.click()
	await expect(spinner).toBeVisible()
	await expect(spinner).toMatchAriaSnapshot('- status: Loading preview content')
	await expect(spinner.locator('span')).toHaveCSS('clip-path', 'inset(50%)')
	await expect(spinner.locator('span')).toHaveCSS('width', '1px')
	await expect(toggle).toBeFocused()
	await toggle.press('Space')
	await expect(spinner).toBeHidden()
	await expect(toggle).toBeFocused()
})
