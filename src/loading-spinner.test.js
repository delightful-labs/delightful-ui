import { describe, expect, it } from 'vitest'
import { render } from 'svelte/server'
import LoadingSpinner from './lib/Components/LoadingSpinner.svelte'
import Demo from './routes/+page.svelte'

describe('loading status server rendering', () => {
	it('provides default status text and hides decorative rings', () => {
		const { body } = render(LoadingSpinner)
		expect(body).toContain('role="status"')
		expect(body).toContain('Loading')
		expect([...body.matchAll(/aria-hidden="true"/g)]).toHaveLength(2)
	})

	it('escapes status text and forwards caller attributes and classes', () => {
		const { body } = render(LoadingSpinner, {
			props: {
				text: 'Saving <draft> & changes',
				id: 'save-status',
				class: 'save-indicator',
				hidden: true,
				'aria-live': 'off',
				style: '--dui-loading-spinner-size: 32px;'
			}
		})
		expect(body).toContain('Saving &lt;draft> &amp; changes')
		expect(body).toContain('id="save-status"')
		expect(body).toContain('save-indicator')
		expect(body).toMatch(/<div\b[^>]*\bhidden(?:=""|\s|>)/)
		expect(body).toContain('aria-live="off"')
		expect(body).toContain('--dui-loading-spinner-size: 32px;')
	})

	it('starts the caller-controlled preview ready with its indicator hidden', () => {
		const { body } = render(Demo)
		expect(body).toContain('Preview content: ready')
		expect(body).toMatch(
			/<div\b[^>]*id="loading-state-preview"[^>]*\bhidden(?:=""|\s|>)/
		)
	})
})
