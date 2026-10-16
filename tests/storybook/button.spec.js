import { expect, test } from '@playwright/test'

/** @param {import('@playwright/test').Page} page @param {string} story */
async function openStory(page, story) {
	await page.goto(`/iframe.html?id=controls-button--${story}&viewMode=story`)
	await expect(page.locator('#storybook-root button')).toBeVisible()
	return page.locator('#storybook-root button')
}

test('primary buttons use white surfaces and dark text in automatic and explicit dark themes', async ({
	page
}) => {
	await page.emulateMedia({ colorScheme: 'dark' })
	const button = await openStory(page, 'primary')
	await expect(button).toHaveCSS('background-color', 'rgb(255, 255, 255)')
	await expect(button).toHaveCSS('color', 'rgb(38, 38, 38)')
	await page.emulateMedia({ colorScheme: 'light' })
	await page.evaluate(() => {
		document.documentElement.dataset.duiTheme = 'dark'
	})
	await expect(button).toHaveCSS('background-color', 'rgb(255, 255, 255)')
	await expect(button).toHaveCSS('color', 'rgb(38, 38, 38)')
	await button.hover()
	await expect(button).toHaveCSS('background-color', 'rgb(148, 255, 71)')
	await expect(button).toHaveCSS('color', 'rgb(0, 0, 0)')
	await page.mouse.move(0, 0)
	await page.evaluate(() => {
		document.documentElement.dataset.duiTheme = 'light'
	})
	await expect(button).toHaveCSS('background-color', 'rgb(0, 0, 0)')
	await expect(button).toHaveCSS('color', 'rgb(255, 255, 255)')
})

test('raised remains the default while flat hover and press use colors without movement', async ({
	page
}) => {
	const raised = await openStory(page, 'default')
	await expect(raised).not.toHaveCSS('box-shadow', 'none')
	await raised.hover()
	await page.mouse.down()
	await expect(raised).toHaveCSS('transform', 'matrix(1, 0, 0, 1, 3, 3)')
	await page.mouse.up()
	const flat = await openStory(page, 'flat')
	await expect(flat).toHaveCSS('box-shadow', 'none')
	await flat.hover()
	await expect(flat).toHaveCSS('background-color', 'rgb(148, 255, 71)')
	for (const dark of [false, true]) {
		await page.evaluate((dark) => {
			document.documentElement.dataset.duiTheme = dark ? 'dark' : 'light'
		}, dark)
		await page.mouse.down()
		await expect(flat).toHaveCSS('transform', 'none')
		await expect(flat).toHaveCSS('box-shadow', 'none')
		await expect(flat).toHaveCSS(
			'background-color',
			dark ? 'rgb(255, 255, 255)' : 'rgb(38, 38, 38)'
		)
		await expect(flat).toHaveCSS(
			'color',
			dark ? 'rgb(38, 38, 38)' : 'rgb(255, 255, 255)'
		)
		await page.mouse.up()
	}
})

test('disabled flat buttons retain native disabled behavior and do not get active styling', async ({
	page
}) => {
	const button = await openStory(page, 'flat-disabled')
	await expect(button).toBeDisabled()
	await button.hover({ force: true })
	await expect(button).toHaveCSS('background-color', 'rgb(255, 255, 255)')
	await expect(button).toHaveCSS('opacity', '0.5')
	await page.mouse.down()
	await expect(button).toHaveCSS('transform', 'none')
	await expect(button).toHaveCSS('box-shadow', 'none')
	await page.mouse.up()
})

test('aria-disabled buttons remain focusable and do not activate or get interactive styling', async ({
	page
}) => {
	const button = await openStory(page, 'aria-disabled')
	await expect(button).toHaveAttribute('aria-disabled', 'true')
	await expect(button).not.toHaveAttribute('disabled')
	await expect(button).toHaveCSS('opacity', '0.5')
	await button.focus()
	await expect(button).toBeFocused()
	await button.hover()
	await expect(button).toHaveCSS('background-color', 'rgb(255, 255, 255)')
	await page.mouse.down()
	await expect(button).toHaveCSS('transform', 'none')
	await expect(button).toHaveCSS(
		'box-shadow',
		'rgb(38, 38, 38) 3px 3px 0px 0px'
	)
	await page.mouse.up()
	await button.evaluate((element) => {
		if (element instanceof HTMLButtonElement) element.click()
	})
})

test('flat keys scale with their grid and preserve keyboard focus in reduced motion and forced colors', async ({
	page
}) => {
	const button = await openStory(page, 'flat-key')
	for (const width of [375, 1280]) {
		await page.setViewportSize({ width, height: 800 })
		const box = await button.boundingBox()
		if (!box) throw new Error('Expected flat key geometry')
		expect(box.width).toBeCloseTo(box.height, 1)
		expect(box.x + box.width).toBeLessThanOrEqual(width)
	}
	await page.emulateMedia({ reducedMotion: 'reduce' })
	await button.focus()
	await expect(button).toBeFocused()
	await expect(button).toHaveCSS('outline-style', 'dashed')
	await expect(button).toHaveCSS('transition-duration', '0s')
	await button.press('Space')
	await expect(button).toBeFocused()
	await page.emulateMedia({ forcedColors: 'active' })
	await expect(button).toHaveCSS('box-shadow', 'none')
	await expect(button).toHaveCSS('outline-style', 'dashed')
	await expect(button).toHaveCSS('outline-width', '2px')
})
