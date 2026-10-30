import { expect, test } from '@playwright/test'

/** @param {import('@playwright/test').Page} page @param {string} story */
async function openStory(page, story) {
	await page.goto(`/iframe.html?id=controls-button--${story}&viewMode=story`)
	await expect(page.locator('#storybook-root button')).toBeVisible()
	return page.locator('#storybook-root button')
}

test('primary buttons remain available across automatic and explicit theme changes', async ({
	page
}) => {
	await page.emulateMedia({ colorScheme: 'dark' })
	const button = await openStory(page, 'primary')
	await expect(button).toBeEnabled()
	await page.emulateMedia({ colorScheme: 'light' })
	await page.evaluate(() => {
		document.documentElement.dataset.duiTheme = 'dark'
	})
	await expect(button).toBeEnabled()
	await button.hover()
	await page.mouse.move(0, 0)
	await page.evaluate(() => {
		document.documentElement.dataset.duiTheme = 'light'
	})
	await expect(button).toBeEnabled()
})

test('raised and flat buttons remain usable while hovered and pressed', async ({
	page
}) => {
	const raised = await openStory(page, 'default')
	await expect(raised).toBeEnabled()
	await raised.hover()
	await page.mouse.down()
	await page.mouse.up()
	const flat = await openStory(page, 'flat-secondary')
	await expect(flat).toBeEnabled()
	await flat.hover()
	for (const dark of [false, true]) {
		await page.evaluate((dark) => {
			document.documentElement.dataset.duiTheme = dark ? 'dark' : 'light'
		}, dark)
		await page.mouse.down()
		await expect(flat).toBeEnabled()
		await page.mouse.up()
	}
})

test('disabled flat buttons retain native disabled behavior', async ({
	page
}) => {
	const button = await openStory(page, 'flat-disabled')
	await expect(button).toBeDisabled()
	await button.hover({ force: true })
	await page.mouse.down()
	await page.mouse.up()
})

test('aria-disabled buttons remain focusable and do not activate', async ({
	page
}) => {
	const button = await openStory(page, 'aria-disabled')
	await expect(button).toHaveAttribute('aria-disabled', 'true')
	await expect(button).not.toHaveAttribute('disabled')
	await button.focus()
	await expect(button).toBeFocused()
	await button.hover()

	await page.mouse.down()

	await page.mouse.up()
	await button.evaluate((element) => {
		if (element instanceof HTMLButtonElement) element.click()
	})
})

test('flat keys scale with their grid and preserve keyboard focus across motion preferences', async ({
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
	await button.press('Space')
	await expect(button).toBeFocused()
	await page.emulateMedia({ forcedColors: 'active' })
})

test('theme spacing stays fluid and scoped overrides preserve inherited layout', async ({
	page
}) => {
	await page.setViewportSize({ width: 320, height: 800 })
	const button = await openStory(page, 'default')
	await page.evaluate(() => document.fonts.ready)
	const narrow = await button.boundingBox()
	if (!narrow) throw new Error('Expected narrow button geometry')

	await page.setViewportSize({ width: 1280, height: 800 })
	const wide = await button.boundingBox()
	if (!wide) throw new Error('Expected wide button geometry')
	expect(wide.width).toBeGreaterThan(narrow.width)

	await button.evaluate((element) => {
		element.style.setProperty('--dui-spacing-md', '64px')
	})
	const scoped = await button.boundingBox()
	if (!scoped) throw new Error('Expected overridden button geometry')
	expect(scoped.width).toBeGreaterThan(wide.width)

	await button.evaluate((element) => {
		element.style.setProperty('--dui-spacing-md', 'invalid-spacing')
	})
	const inherited = await button.boundingBox()
	if (!inherited) throw new Error('Expected inherited button geometry')
	expect(inherited.width).toBeCloseTo(wide.width, 1)

	await page.evaluate(() => {
		document.documentElement.style.fontSize = '20px'
	})
	const enlarged = await button.boundingBox()
	if (!enlarged) throw new Error('Expected enlarged button geometry')
	expect(enlarged.width).toBeGreaterThan(inherited.width)
	expect(enlarged.height).toBeGreaterThan(inherited.height)
	await button.focus()
	await expect(button).toBeFocused()
})

test('button height overrides inherit and invalid local values preserve the inherited target', async ({
	page
}) => {
	const button = await openStory(page, 'default')
	const baseline = await button.boundingBox()
	if (!baseline) throw new Error('Expected default button geometry')
	await page.evaluate(() => {
		document.documentElement.style.setProperty(
			'--dui-button-min-height',
			'80px'
		)
	})
	const inherited = await button.boundingBox()
	if (!inherited) throw new Error('Expected inherited button geometry')
	expect(inherited.height).toBeGreaterThan(baseline.height)
	await button.evaluate((element) => {
		element.style.setProperty('--dui-button-min-height', '120px')
	})
	const local = await button.boundingBox()
	if (!local) throw new Error('Expected local button geometry')
	expect(local.height).toBeGreaterThan(inherited.height)
	await button.evaluate((element) => {
		element.style.setProperty('--dui-button-min-height', 'invalid-height')
	})
	const recovered = await button.boundingBox()
	if (!recovered) throw new Error('Expected recovered button geometry')
	expect(recovered.height).toBeCloseTo(inherited.height, 1)
	await button.focus()
	await button.press('Space')
	await expect(button).toBeFocused()
})

test('keypad keeps square keys and reachable actions at narrow and wide widths', async ({
	page
}) => {
	await page.goto(
		'/iframe.html?id=controls-numberkeypad--default&viewMode=story'
	)
	const keypad = page.getByRole('group', { name: 'Number keypad', exact: true })
	const digit = keypad.getByRole('button', { name: '7', exact: true })
	const next = keypad.getByRole('button', { name: 'Next', exact: true })
	await expect(digit).toBeVisible()
	for (const width of [320, 1280]) {
		await page.setViewportSize({ width, height: 900 })
		const keyBox = await digit.boundingBox()
		const nextBox = await next.boundingBox()
		if (!keyBox || !nextBox) throw new Error('Expected keypad geometry')
		expect(keyBox.width).toBeCloseTo(keyBox.height, 1)
		expect(nextBox.width).toBeGreaterThan(keyBox.width)
		for (const box of [keyBox, nextBox]) {
			expect(box.x).toBeGreaterThanOrEqual(0)
			expect(box.x + box.width).toBeLessThanOrEqual(width)
		}
	}
	await digit.click()
	await expect(page.getByRole('status', { name: 'Last key' })).toHaveText('7')
	await next.focus()
	await next.press('Enter')
	await expect(page.getByRole('status', { name: 'Last key' })).toHaveText(
		'next'
	)
})

test('keypad accepts rectangular ratios without losing native key activation', async ({
	page
}) => {
	await page.setViewportSize({ width: 1280, height: 900 })
	await page.goto(
		'/iframe.html?id=controls-numberkeypad--rectangular-keys&viewMode=story'
	)
	const digit = page.getByRole('button', { name: '7', exact: true })
	await expect(digit).toBeVisible()
	const box = await digit.boundingBox()
	if (!box) throw new Error('Expected rectangular key geometry')
	expect(box.width / box.height).toBeCloseTo(1.5, 1)
	await digit.focus()
	await digit.press('Space')
	await expect(page.getByRole('status', { name: 'Last key' })).toHaveText('7')
})
