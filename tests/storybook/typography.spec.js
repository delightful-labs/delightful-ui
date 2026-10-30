import { expect, test } from '@playwright/test'

for (const kind of ['heading', 'text']) {
	test(`${kind} scales with root typography and inherits valid line-height overrides`, async ({
		page
	}) => {
		await page.goto(
			`/iframe.html?id=typography-${kind}--default&viewMode=story`
		)
		const content =
			kind === 'heading'
				? page.getByRole('heading', { name: 'Account settings', exact: true })
				: page.getByText('Manage your account preferences.', { exact: true })
		await expect(content).toBeVisible()
		await page.evaluate(() => document.fonts.ready)
		const baseline = await content.boundingBox()
		if (!baseline) throw new Error('Expected default typography geometry')
		await page.evaluate(() => {
			document.documentElement.style.fontSize = '32px'
		})
		const enlarged = await content.boundingBox()
		if (!enlarged) throw new Error('Expected enlarged typography geometry')
		expect(enlarged.height).toBeGreaterThan(baseline.height)
		await page.evaluate((kind) => {
			document.documentElement.style.setProperty(
				`--dui-${kind}-line-height`,
				'3'
			)
		}, kind)
		const inherited = await content.boundingBox()
		if (!inherited) throw new Error('Expected inherited typography geometry')
		expect(inherited.height).toBeGreaterThan(enlarged.height)
		await content.evaluate((element, kind) => {
			element.style.setProperty(
				`--dui-${kind}-line-height`,
				'invalid-line-height'
			)
		}, kind)
		const recovered = await content.boundingBox()
		if (!recovered) throw new Error('Expected recovered typography geometry')
		expect(recovered.height).toBeCloseTo(inherited.height, 1)
	})
}
