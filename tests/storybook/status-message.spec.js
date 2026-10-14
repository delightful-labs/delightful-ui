import { expect, test } from '@playwright/test'

test('mounted feedback transitions with one live region and preserves focus', async ({
	page
}) => {
	await page.goto(
		'/iframe.html?id=tests-statusmessagestates--default&viewMode=story'
	)
	const feedback = page.locator('#feedback')
	await expect(feedback).toHaveText('Saving changes')
	await expect(feedback).toHaveAttribute('role', 'status')
	await expect(page.getByRole('status')).toHaveCount(1)
	await expect(feedback.locator('.screen-reader-text')).toHaveCount(0)
	await page.getByRole('button', { name: 'Complete', exact: true }).click()
	await expect(feedback).toHaveText('Changes saved')
	await expect(feedback.locator('[aria-hidden]')).toHaveCount(0)
	await expect(
		page.getByRole('button', { name: 'Complete', exact: true })
	).toBeFocused()
	await page.getByRole('button', { name: 'Fail', exact: true }).click()
	await expect(page.getByRole('alert')).toHaveText('Save failed')
	await expect(page.getByRole('status')).toHaveCount(0)
	await page.getByRole('button', { name: 'Retry', exact: true }).click()
	await expect(feedback).toHaveText('Saving changes')
	await expect(page.getByRole('status')).toHaveCount(1)
	await page.getByRole('button', { name: 'Toggle visibility' }).click()
	await expect(feedback).toBeHidden()
	await page.getByRole('button', { name: 'Toggle visibility' }).click()
	await expect(feedback).toBeVisible()
})

test('loading text wraps on narrow screens and the spinner respects reduced motion', async ({
	page
}) => {
	await page.setViewportSize({ width: 320, height: 640 })
	await page.emulateMedia({ reducedMotion: 'reduce' })
	await page.goto(
		'/iframe.html?id=feedback-statusmessage--wrapping&viewMode=story'
	)
	const feedback = page.getByRole('status')
	await expect(feedback).toBeVisible()
	await expect(feedback).toHaveCSS('gap', '8px')
	const rings = feedback.locator('.ring')
	await expect(rings.first()).toBeVisible()
	await expect(rings.last()).toBeHidden()
	await expect(rings.first()).toHaveCSS('animation-name', 'none')
	const box = await feedback.boundingBox()
	if (!box) throw new Error('Expected feedback geometry')
	expect(box.x + box.width).toBeLessThanOrEqual(320)
	expect(
		await page.evaluate(() => document.documentElement.scrollWidth)
	).toBeLessThanOrEqual(320)
})

test('decorative spinner omits hidden text and a separate announcement', async ({
	page
}) => {
	await page.goto(
		'/iframe.html?id=feedback-loadingspinner--decorative&viewMode=story'
	)
	await expect(page.locator('.ring').first()).toBeVisible()
	await expect(page.locator('.screen-reader-text')).toHaveCount(0)
	await expect(page.getByRole('status')).toHaveCount(0)
})
