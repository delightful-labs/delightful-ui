import { expect, test } from '@playwright/test'

/** @param {string} first @param {string} second */
function contrast(first, second) {
	/** @param {string} color */
	const luminance = (color) => {
		const channels = color
			.match(/[\d.]+/g)
			?.slice(0, 3)
			.map(Number)
		if (!channels || channels.length !== 3)
			throw new Error(`Invalid color: ${color}`)
		return channels.reduce((sum, channel, index) => {
			const value = channel / 255
			return (
				sum +
				(value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4) *
					[0.2126, 0.7152, 0.0722][index]
			)
		}, 0)
	}
	const values = [luminance(first), luminance(second)].sort((a, b) => a - b)
	return (values[1] + 0.05) / (values[0] + 0.05)
}

for (const theme of ['light', 'dark', 'automatic-dark']) {
	test(`error colors meet AA contrast in ${theme}`, async ({ page }) => {
		await page.emulateMedia({
			colorScheme: theme === 'automatic-dark' ? 'dark' : 'light',
			reducedMotion: 'reduce'
		})
		await page.goto(
			'/iframe.html?id=controls-button--destructive&viewMode=story'
		)
		await page.evaluate((theme) => {
			if (theme !== 'automatic-dark')
				document.documentElement.dataset.duiTheme = theme
		}, theme)
		const button = page.locator('#storybook-root button')
		await expect(button).toBeVisible()
		for (const state of ['default', 'hover', 'pressed', 'focus']) {
			if (state === 'hover') await button.hover()
			if (state === 'pressed') await page.mouse.down()
			if (state === 'focus') {
				await page.mouse.up()
				await page.mouse.move(0, 0)
				await button.focus()
			}
			const colors = await button.evaluate((element) => {
				const style = getComputedStyle(element)
				return {
					text: style.color,
					background: style.backgroundColor,
					border: style.borderTopColor,
					surface: getComputedStyle(document.body).backgroundColor
				}
			})
			expect(
				contrast(colors.text, colors.background),
				`${state} text`
			).toBeGreaterThanOrEqual(4.5)
			expect(
				contrast(colors.border, colors.surface),
				`${state} boundary`
			).toBeGreaterThanOrEqual(3)
		}
		await page.goto(
			'/iframe.html?id=feedback-statusmessage--error&viewMode=story'
		)
		await page.evaluate((theme) => {
			if (theme !== 'automatic-dark')
				document.documentElement.dataset.duiTheme = theme
		}, theme)
		const message = page.getByRole('alert')
		await expect(message).toBeVisible()
		const colors = await message.evaluate((element) => ({
			text: getComputedStyle(element).color,
			surface: getComputedStyle(document.body).backgroundColor
		}))
		expect(contrast(colors.text, colors.surface)).toBeGreaterThanOrEqual(4.5)
	})
}
