import '../src/lib/theme.css'

/** @type {import('@storybook/svelte-vite').Preview} */
const preview = {
	parameters: {
		layout: 'padded',
		controls: {
			matchers: { color: /(background|color)$/i, date: /Date$/ }
		}
	}
}

export default preview
