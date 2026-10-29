import { expect } from '@playwright/test'

export const png = Buffer.from(
	'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aD1sAAAAASUVORK5CYII=',
	'base64'
)
export const image = (name = 'image.png') => ({
	name,
	mimeType: 'image/png',
	buffer: png
})

/** @param {import('@playwright/test').Page} page */
export async function openImageInput(page, story = 'avatar', label = 'Avatar') {
	await page.addInitScript(() => {
		const tracked = Object.assign(window, {
			imageUrls: {
				created: /** @type {string[]} */ ([]),
				revoked: /** @type {string[]} */ ([])
			}
		})
		const create = URL.createObjectURL.bind(URL)
		const revoke = URL.revokeObjectURL.bind(URL)
		URL.createObjectURL = (file) => {
			const url = create(file)
			tracked.imageUrls.created.push(url)
			return url
		}
		URL.revokeObjectURL = (url) => {
			tracked.imageUrls.revoked.push(url)
			revoke(url)
		}
	})
	await page.goto(`/iframe.html?id=inputs-${story}--bound-form&viewMode=story`)
	await expect(page.getByLabel(label, { exact: true })).toBeVisible()
}
