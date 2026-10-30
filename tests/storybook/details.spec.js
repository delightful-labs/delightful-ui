import { expect, test } from '@playwright/test'

for (const story of ['inline', 'absolute', 'right-caret', 'custom-caret']) {
	test(`Details ${story} renders and toggles with the keyboard`, async ({
		page
	}) => {
		/** @type {string[]} */
		const errors = []
		page.on('pageerror', (error) => errors.push(error.message))
		await page.goto(
			`/iframe.html?id=disclosure-details--${story}&viewMode=story`
		)
		const details = page.locator('details')
		const summary = details.locator('summary')
		await expect(summary).toHaveText(/Options/)
		await expect(summary).toBeVisible()
		await expect(details).not.toHaveAttribute('open')
		if (story !== 'custom-caret') {
			await expect(summary.locator('svg')).toHaveAttribute(
				'viewBox',
				'0 0 24 24'
			)
		}
		await summary.focus()
		await summary.press('Enter')
		await expect(details).toHaveAttribute('open', '')
		if (story !== 'custom-caret') {
			await expect(summary.locator('svg')).toHaveAttribute(
				'viewBox',
				'0 0 24 24'
			)
		}
		if (story === 'absolute') {
			await expect(
				details.getByRole('link', { name: 'View options' })
			).toBeVisible()
		} else {
			await expect(details.getByText('Additional information.')).toBeVisible()
		}
		await summary.press('Space')
		await expect(details).not.toHaveAttribute('open')
		expect(errors).toEqual([])
	})
}

test('summary target inherits its minimum height and recovers from an invalid override', async ({
	page
}) => {
	await page.goto('/iframe.html?id=disclosure-details--inline&viewMode=story')
	const details = page.locator('details')
	const summary = details.locator('summary')
	await expect(summary).toBeVisible()
	const baseline = await summary.boundingBox()
	if (!baseline) throw new Error('Expected default summary geometry')
	await details.evaluate((element) => {
		element.style.setProperty('--dui-details-summary-min-height', '80px')
	})
	const inherited = await summary.boundingBox()
	if (!inherited) throw new Error('Expected inherited summary geometry')
	expect(inherited.height).toBeGreaterThan(baseline.height)
	await summary.evaluate((element) => {
		element.style.setProperty(
			'--dui-details-summary-min-height',
			'invalid-height'
		)
	})
	const recovered = await summary.boundingBox()
	if (!recovered) throw new Error('Expected recovered summary geometry')
	expect(recovered.height).toBeCloseTo(inherited.height, 1)
	await summary.focus()
	await summary.press('Enter')
	await expect(details).toHaveAttribute('open', '')
	await summary.press('Space')
	await expect(details).not.toHaveAttribute('open')
})
