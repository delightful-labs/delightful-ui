<script>
	import InputWrapper from './InputWrapper.svelte'
	import createHtmlId from '$lib/utils/createHtmlId'
	import createFieldTitle from '$lib/utils/createFieldTitle'

	/**
	 * @type {import('$lib/types').InputModes}
	 */
	export let inputmode = undefined

	/**
	 * @type {string}
	 */
	export let title = createFieldTitle()

	/**
	 * @type {string}
	 */
	export let key = createHtmlId(title)

	/**
	 * @type {number|undefined}
	 */
	export let maxlength = undefined

	/**
	 * @type {string|undefined}
	 */
	export let placeholder = undefined

	/**
	 * @type {boolean}
	 */
	export let required = false

	/**
	 * @type {number|undefined}
	 */
	export let size = undefined

	/**
	 * @type {string}
	 */
	export let style = ''

	/**
	 * @type {number|undefined}
	 */
	export let value = undefined

	/**
	 * @type {boolean}
	 */
	export let hideArrows = false

	// @TODO: convert this to a state that can be more easily used,
	// i.e. 'no-user input', 'invalid', 'valid'
	// might actually use a real state machine for this.
	// (Can a state machine run in a use action?)
	// Then you can run different types of validation:
	// i.e. validate on blur, validate on submit, validate on input
	/**
	 * @type {boolean}
	 */
	let dataValid = true

	let input

	const truncateToMaxLength = () => {
		if (value) {
			const stringValue = value.toString()
			if (maxlength && stringValue.length > maxlength) {
				value = parseInt(stringValue.slice(0, maxlength))
			}
		}
	}
</script>

<InputWrapper {title} {required} {key}>
	<input
		bind:this={input}
		class={hideArrows ? 'hide-arrows' : ''}
		id={key}
		{inputmode}
		{title}
		{placeholder}
		type="number"
		{required}
		{size}
		{style}
		data-valid={dataValid}
		bind:value
		on:input={maxlength ? () => truncateToMaxLength() : undefined}
		on:invalid={() => (dataValid = false)}
		on:input={() => (dataValid = true)}
	/>
</InputWrapper>

<style>
	.hide-arrows {
		-moz-appearance: textfield;
		appearance: textfield;
	}

	.hide-arrows::-webkit-inner-spin-button,
	.hide-arrows::-webkit-outer-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}
</style>
