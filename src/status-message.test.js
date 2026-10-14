import { describe, expect, it } from 'vitest'
import { render } from 'svelte/server'
import { StatusMessage } from './lib/index.js'

describe('status message server rendering', () => {
	it('renders visible escaped caller text with status semantics by default', () => {
		const { body } = render(StatusMessage, {
			props: { text: 'Saved <draft> & changes' }
		})
		expect(body).toContain('role="status"')
		expect(body).toContain('Saved &lt;draft> &amp; changes')
		expect(body).not.toContain('screen-reader-text')
		expect(body).not.toContain('class="spinner')
	})

	it('exposes one live region while excluding the loading decoration', () => {
		const { body } = render(StatusMessage, {
			props: { variant: 'loading', text: 'Loading accounts' }
		})
		expect([...body.matchAll(/role="status"/g)]).toHaveLength(1)
		expect(body).toContain('role="presentation"')
		expect(body).toContain('aria-hidden="true"')
		expect(body).not.toContain('screen-reader-text')
		expect([...body.matchAll(/Loading accounts/g)]).toHaveLength(1)
	})

	it('uses alert semantics for errors and respects caller role/attributes', () => {
		const { body } = render(StatusMessage, {
			props: { variant: 'error', text: 'Save failed' }
		})
		expect(body).toContain('role="alert"')
		const { body: overridden } = render(StatusMessage, {
			props: {
				variant: 'error',
				text: 'Save failed',
				role: 'presentation',
				id: 'feedback',
				class: 'custom',
				hidden: true,
				'aria-live': 'off'
			}
		})
		expect(overridden).toContain('role="presentation"')
		expect(overridden).not.toContain('role="alert"')
		expect(overridden).toContain('id="feedback"')
		expect(overridden).toContain('custom')
		expect(overridden).toMatch(/<div\b[^>]*\bhidden(?:=""|\s|>)/)
		expect(overridden).toContain('aria-live="off"')
	})
})
