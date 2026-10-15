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

test('compact feedback transitions between spinner and dots without duplicating announcements or moving focus', async ({
	page
}) => {
	await page.goto(
		'/iframe.html?id=tests-statusmessagestates--compact&viewMode=story'
	)
	const feedback = page.locator('#feedback')
	await expect(feedback).toHaveText('Saving changes')
	await expect(page.getByRole('status')).toHaveCount(1)
	await expect(feedback.locator('.indicator')).toHaveCount(0)
	await expect(feedback.locator('.spinner').last()).toHaveCSS('width', '16px')
	await expect(feedback).toHaveCSS('font-size', '14px')
	await page.getByRole('button', { name: 'Complete', exact: true }).click()
	await expect(feedback).toHaveText('Changes saved')
	await expect(feedback.locator('.indicator')).toHaveCount(1)
	await expect(feedback.locator('.indicator')).toHaveAttribute(
		'aria-hidden',
		'true'
	)
	await expect(feedback.locator('.spinner')).toHaveCount(0)
	await expect(page.getByRole('status')).toHaveCount(1)
	await expect(
		page.getByRole('button', { name: 'Complete', exact: true })
	).toBeFocused()
	await page.getByRole('button', { name: 'Fail', exact: true }).click()
	await expect(page.getByRole('alert')).toHaveText('Save failed')
	await expect(page.getByRole('status')).toHaveCount(0)
	await expect(feedback.locator('.indicator')).toHaveCount(1)
	await page.getByRole('button', { name: 'Retry', exact: true }).click()
	await expect(feedback).toHaveText('Saving changes')
	await expect(feedback.locator('.indicator')).toHaveCount(0)
	await expect(page.getByRole('status')).toHaveCount(1)
	await expect(page.getByRole('alert')).toHaveCount(0)
	await page.getByRole('button', { name: 'Toggle visibility' }).click()
	await expect(feedback).toBeHidden()
	await page.getByRole('button', { name: 'Toggle visibility' }).click()
	await expect(feedback).toBeVisible()
})

for (const state of ['offline', 'pending']) {
	test(`compact ${state} stays informational with visible text`, async ({
		page
	}) => {
		await page.goto(
			`/iframe.html?id=feedback-statusmessage--compact-${state}&viewMode=story`
		)
		const feedback = page.getByRole('status')
		await expect(feedback).toContainText(
			state === 'offline' ? 'Offline' : 'Changes waiting to sync'
		)
		await expect(page.getByRole('alert')).toHaveCount(0)
		await expect(feedback.locator('.indicator')).toHaveCount(1)
		await expect(feedback.locator('.indicator')).toHaveAttribute(
			'aria-hidden',
			'true'
		)
		await expect(feedback.locator('.spinner')).toHaveCount(0)
	})
}

test('compact loading respects reduced motion with a single announcement', async ({
	page
}) => {
	await page.emulateMedia({ reducedMotion: 'reduce' })
	await page.goto(
		'/iframe.html?id=feedback-statusmessage--compact-syncing&viewMode=story'
	)
	const feedback = page.getByRole('status')
	await expect(feedback).toHaveText('Syncing changes…')
	await expect(page.getByRole('status')).toHaveCount(1)
	await expect(feedback.locator('.ring').first()).toHaveCSS(
		'animation-name',
		'none'
	)
	await expect(feedback.locator('.ring').first()).toBeVisible()
	await expect(feedback.locator('.ring').last()).toBeHidden()
})

test('compact text wraps on narrow screens without shrinking the dot', async ({
	page
}) => {
	await page.setViewportSize({ width: 320, height: 640 })
	await page.goto(
		'/iframe.html?id=feedback-statusmessage--compact-wrapping&viewMode=story'
	)
	const feedback = page.getByRole('status')
	await expect(feedback).toBeVisible()
	const indicator = feedback.locator('.indicator')
	await expect(indicator).toHaveCSS('width', '10px')
	await expect(indicator).toHaveCSS('height', '10px')
	const box = await feedback.boundingBox()
	if (!box) throw new Error('Expected compact feedback geometry')
	expect(box.x + box.width).toBeLessThanOrEqual(320)
	expect(
		await page.evaluate(() => document.documentElement.scrollWidth)
	).toBeLessThanOrEqual(320)
})

/** @type {Array<'light' | 'dark'>} */
const colorSchemes = ['light', 'dark']

for (const colorScheme of colorSchemes) {
	test(`compact indicators use theme tokens in ${colorScheme} mode`, async ({
		page
	}) => {
		await page.emulateMedia({ colorScheme })
		await page.goto(
			'/iframe.html?id=feedback-statusmessage--compact-synced&viewMode=story'
		)
		const feedback = page.getByRole('status')
		await expect(feedback).toHaveText('All changes synced')
		const indicator = feedback.locator('.indicator')
		await expect(indicator).toHaveCSS('background-color', 'rgb(148, 255, 71)')
		await expect(indicator).toHaveCSS(
			'border-top-color',
			colorScheme === 'dark' ? 'rgb(255, 255, 255)' : 'rgb(38, 38, 38)'
		)
		await feedback.evaluate((element) => {
			element.style.setProperty(
				'--dui-status-message-success-color',
				'rgb(10, 20, 30)'
			)
			element.style.setProperty('--dui-status-message-indicator-size', '12px')
		})
		await expect(indicator).toHaveCSS('background-color', 'rgb(10, 20, 30)')
		await expect(indicator).toHaveCSS('width', '12px')
		await expect(indicator).toHaveCSS('height', '12px')
	})
}
