import { expect, test } from '@playwright/test'

test.beforeEach(async ({ page }) => {
	await page.emulateMedia({ reducedMotion: 'reduce' })
})

for (const side of ['left', 'right']) {
	test(`overlay ${side} uses modal focus containment and restores its trigger`, async ({
		page
	}) => {
		await page.setViewportSize({ width: 1100, height: 700 })
		await page.goto(`/iframe.html?id=layout-drawer--${side}&viewMode=story`)
		const trigger = page.getByRole('button', { name: 'Open menu', exact: true })
		const dialog = page.getByRole('dialog', { name: 'Main menu', exact: true })
		const close = dialog.getByRole('button', {
			name: 'Close menu',
			exact: true
		})
		await trigger.click()
		await expect(dialog).toBeVisible()
		expect(await dialog.evaluate((el) => el.matches(':modal'))).toBe(true)
		await expect(close).toBeFocused()
		await page
			.locator('button[aria-controls$="-sidebar"]')
			.evaluate((el) => el.focus())
		await expect(close).toBeFocused()
		await close.press('Tab')
		await expect(
			dialog.getByRole('link', { name: 'Overview', exact: true })
		).toBeFocused()
		const box = await dialog.boundingBox()
		if (!box) throw new Error('Expected drawer geometry')
		expect(box.y).toBe(0)
		expect(box.height).toBe(700)
		expect(side === 'left' ? box.x : box.x + box.width).toBe(
			side === 'left' ? 0 : 1100
		)
		await page.keyboard.press('Escape')
		await expect(dialog).toBeHidden()
		await expect(trigger).toBeFocused()
		await trigger.click()
		await page.getByRole('link', { name: 'Accounts', exact: true }).click()
		await expect(dialog).toBeHidden()
		await expect(page).toHaveURL(/#accounts$/)
		await trigger.click()
		await close.click()
		await expect(dialog).toBeHidden()
		await expect(trigger).toBeFocused()
		await trigger.click()
		await page.mouse.click(side === 'left' ? 1000 : 50, 350)
		await expect(dialog).toBeHidden()
	})
}

test('inline reserves space, preserves page interaction and restores focus on scoped Escape', async ({
	page
}) => {
	await page.setViewportSize({ width: 1100, height: 700 })
	await page.goto(
		'/iframe.html?id=layout-drawer--inline-sidebar&viewMode=story'
	)
	const toggle = page.getByRole('button', { name: 'Toggle sidebar' })
	const content = page.getByRole('region', { name: 'Page content' })
	const before = await content.boundingBox()
	await toggle.click()
	const aside = page.getByRole('complementary', { name: 'Main menu' })
	await expect(aside).toBeVisible()
	await expect(toggle).toBeFocused()
	await expect(toggle).toHaveAttribute('aria-expanded', 'true')
	await expect(page.getByRole('dialog')).toHaveCount(0)
	const after = await content.boundingBox()
	if (!before || !after) throw new Error('Expected page geometry')
	expect(after.x).toBeGreaterThan(before.x)
	expect(after.width).toBeLessThan(before.width)
	const notes = page.getByRole('textbox', { name: 'Notes' })
	await notes.fill('Page stays interactive')
	await notes.press('Escape')
	await expect(aside).toBeVisible()
	await aside.getByRole('link', { name: 'Accounts', exact: true }).focus()
	await page.keyboard.press('Escape')
	await expect(aside).toBeHidden()
	await expect(toggle).toBeFocused()
	await expect(toggle).toHaveAttribute('aria-expanded', 'false')
	await expect(page.locator('aside')).toHaveAttribute('inert', '')
})

test('initially open inline sidebar uses an explicit return target and preserves external focus', async ({
	page
}) => {
	await page.goto(
		'/iframe.html?id=tests-drawerstates--initially-open&viewMode=story'
	)
	const aside = page.getByRole('complementary', { name: 'Fixture menu' })
	const toggle = page.getByRole('button', { name: 'Toggle drawer' })
	await aside.getByRole('button', { name: 'Close menu' }).click()
	await expect(aside).toBeHidden()
	await expect(toggle).toBeFocused()
	await toggle.click()
	const external = page.getByRole('button', { name: 'Close externally' })
	await external.click()
	await expect(aside).toBeHidden()
	await expect(external).toBeFocused()
})

test('changing modes closes the drawer without leaving a modal or focused hidden descendant', async ({
	page
}) => {
	await page.goto('/iframe.html?id=tests-drawerstates--default&viewMode=story')
	const toggle = page.getByRole('button', { name: 'Toggle drawer' })
	const mode = page.getByLabel('Drawer mode')
	await toggle.click()
	await page.getByRole('link', { name: 'Accounts' }).focus()
	await mode.selectOption('overlay')
	await expect(page.getByRole('dialog')).toHaveCount(0)
	await expect(toggle).toHaveAttribute('aria-expanded', 'false')
	await expect(toggle).toBeFocused()
	await toggle.click()
	await expect(page.getByRole('dialog')).toBeVisible()
	await mode.evaluate((el) => {
		if (!(el instanceof HTMLSelectElement)) throw new Error('Expected select')
		el.value = 'inline'
		el.dispatchEvent(new Event('change', { bubbles: true }))
	})
	await expect(page.getByRole('dialog')).toHaveCount(0)
	await expect(page.locator('aside')).toHaveAttribute('hidden', '')
	await expect(toggle).toHaveAttribute('aria-expanded', 'false')
	await expect(toggle).toBeFocused()
})

test('narrow inline layout stacks in DOM order and overlay content scrolls with reduced motion', async ({
	page
}) => {
	await page.setViewportSize({ width: 320, height: 600 })
	await page.goto(
		'/iframe.html?id=layout-drawer--inline-right-sidebar&viewMode=story'
	)
	await page.getByRole('button', { name: 'Toggle sidebar' }).click()
	const content = await page
		.getByRole('region', { name: 'Page content' })
		.boundingBox()
	const sidebar = await page
		.getByRole('complementary', { name: 'Main menu' })
		.boundingBox()
	if (!content || !sidebar) throw new Error('Expected stacked geometry')
	expect(sidebar.y).toBeGreaterThanOrEqual(content.y + content.height)
	expect(
		await page.evaluate(() => document.documentElement.scrollWidth)
	).toBeLessThanOrEqual(320)
	await page.goto(
		'/iframe.html?id=tests-drawerstates--long-overlay&viewMode=story'
	)
	await page.getByRole('button', { name: 'Toggle drawer' }).click()
	const dialog = page.getByRole('dialog', { name: 'Fixture menu' })
	const body = dialog.locator('.drawer-body')
	await expect(dialog).toHaveCSS('transition-duration', '0s')
	expect(await body.evaluate((el) => el.scrollHeight > el.clientHeight)).toBe(
		true
	)
	await dialog.getByRole('link', { name: 'Section 39', exact: true }).focus()
	await expect(
		dialog.getByRole('link', { name: 'Section 39', exact: true })
	).toBeFocused()
	expect(await body.evaluate((el) => el.scrollTop)).toBeGreaterThan(0)
})

test('inline descendants become inert immediately while exit animation reserves space', async ({
	page
}) => {
	await page.emulateMedia({ reducedMotion: 'no-preference' })
	await page.goto(
		'/iframe.html?id=layout-drawer--inline-sidebar&viewMode=story'
	)
	const toggle = page.getByRole('button', { name: 'Toggle sidebar' })
	await toggle.click()
	const aside = page.locator('aside')
	await expect(aside).toBeVisible()
	await aside.evaluate((el) =>
		el.style.setProperty('--dui-drawer-duration', '1s')
	)
	await aside.getByRole('button', { name: 'Close menu' }).click()
	await expect(aside).toHaveAttribute('hidden', '')
	await expect(aside).toHaveAttribute('inert', '')
	await expect(toggle).toBeFocused()
	await expect(
		page.getByRole('link', { name: 'Accounts', exact: true })
	).toHaveCount(0)
	await expect(aside).toBeHidden()
})
