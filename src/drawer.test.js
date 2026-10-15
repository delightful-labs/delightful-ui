import { expect, test } from 'vitest'
import { render } from 'svelte/server'
import { Drawer } from './lib/index.js'

const labels = { heading: 'Main & settings', closeLabel: 'Close menu' }

test('overlay renders a labelled native dialog and explicit close control', () => {
	const { body } = render(Drawer, { props: { ...labels, side: 'right' } })
	expect(body).toContain('<dialog')
	expect(body).toContain('data-side="right"')
	expect(body).toContain('closedby="any"')
	expect(body).toContain('Main &amp; settings')
	expect(body).toMatch(
		/<span class="screen-reader-text(?:\s[^>]*)?>[\s\S]*?Close menu[\s\S]*?<\/span>/
	)
	expect(body).not.toContain('aria-label="Close menu"')
	expect(body).not.toContain('<aside')
})

test('closed inline sidebar is hidden and inert without modal semantics', () => {
	const { body } = render(Drawer, {
		props: { ...labels, mode: 'inline', id: 'sidebar' }
	})
	expect(body).toContain('<aside')
	expect(body).toContain('id="sidebar"')
	expect(body).toMatch(/<aside\b[^>]*\bhidden(?:=""|\s|>)/)
	expect(body).toMatch(/<aside\b[^>]*\binert(?:=""|\s|>)/)
	expect(body).not.toContain('<dialog')
	expect(body).not.toContain('aria-modal')
})

test('initially open inline sidebar has a stable heading association and native attributes', () => {
	const { body } = render(Drawer, {
		props: {
			...labels,
			mode: 'inline',
			open: true,
			id: 'sidebar',
			class: 'custom',
			triggerId: 'toggle',
			headingLevel: 'h3'
		}
	})
	const id = body.match(/<h3\b[^>]*id="([^"]+)"/)?.[1]
	expect(id).toBeTruthy()
	expect(body).toContain(`aria-labelledby="${id}"`)
	expect(body).toContain('custom')
	expect(body).not.toMatch(/<aside\b[^>]*\b(?:hidden|inert)(?:=""|\s|>)/)
	expect(body).toMatch(
		/<span class="screen-reader-text(?:\s[^>]*)?>[\s\S]*?Close menu[\s\S]*?<\/span>/
	)
	expect(body).not.toContain('aria-label="Close menu"')
	expect(body).not.toContain('triggerId=')
})
