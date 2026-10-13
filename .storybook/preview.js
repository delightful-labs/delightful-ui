import '../src/lib/theme.css'

const hiddenAttributes = /^data-sveltekit-/

/** @type {import('@storybook/svelte-vite').Preview} */
const preview = {
	parameters: {
		layout: 'padded',
		controls: {
			exclude: hiddenAttributes,
			matchers: { color: /(background|color)$/i, date: /Date$/ }
		},
		docs: {
			controls: { exclude: hiddenAttributes },
			argTypes: { exclude: hiddenAttributes }
		}
	}
}

export default preview
